
/*

Uses the Google Sheets API to pull data from Sheets and load it onto shared
state. Writes the data out to JSON for later reference. Does not currently
check for existing data to merge--it does a fresh pull every time.

*/

/*

Uses the Google Sheets API to pull data from Sheets and load it onto shared
state. Writes the data out to JSON for later reference. Does not currently
check for existing data to merge--it does a fresh pull every time.

*/

var async = require('async')
var { google } = require('googleapis')
var api = google.sheets('v4')
var writeFile = require('write')
var authObj = require('./googleauth')

var camelCase = function (str) {
  return str.replace(/[^\w]+(\w)/g, function (all, match) {
    return match.toUpperCase()
  })
}

var cast = function (str) {
  if (typeof str !== 'string') {
    if (typeof str.value == 'string') {
      str = str.value
    } else {
      return str
    }
  }
  if (str.match(/^-?(0?\.|[1-9])[\d\.]*$/) || str == '0') {
    var n = Number(str)
    if (isNaN(n)) return str
    return n
  }
  if (str.toLowerCase() == 'true' || str.toLowerCase() == 'false') {
    return str.toLowerCase() == 'true' ? true : false
  }
  return str
}

let googleAuth = (project) => {
  var auth = null
  authObj
    .authenticate({ fallback: false })
    .then((resp) => {
      auth = resp
      grabSheets(auth, project).catch(() => {
        // If the first attempt failed, then make another req using the fallback
        authObj.authenticate({ fallback: true }).then((resp) => {
          auth = resp
          grabSheets(auth, project)
        })
      })
    })
    .catch(() => {
      // Failure if we fall back but there's no token
      auth = authObj.task()
      grabSheets(auth, project)
    })
}

let grabSheets = (auth, project) => {
  return new Promise((resolveAll, rejectAll) => {
    var sheetKeys = project.GOOGLE_SHEETS

    if (!sheetKeys || !sheetKeys.length) {
      console.log(
        'You must specify a spreadsheet key in project.json or auth.json!'
      )
      return false
    }

    let promiseStack = []
    for (var spreadsheetId of sheetKeys) {
      let promiseItem = new Promise((resolve, reject) => {
        getSheet(resolve, reject, auth, spreadsheetId)
      })
      promiseStack.push(promiseItem)
    }

    Promise.all(promiseStack)
      .then(() => {
        // Resolve the whole thing
        resolveAll()
      })
      .catch(() => {
        // If this was triggered, reject all to fall back
        rejectAll()
      })
  })
}

let getSheet = async (resolve, reject, auth, spreadsheetId) => {
  let output = await api.spreadsheets
    .get({
      auth,
      spreadsheetId,
    })
    .catch(() => {
      // This might fail if we don't have access
      reject()
    })
  if (!output) {
    return
  }
  var book = output.data
  var { sheets, spreadsheetId } = book
  for (var sheet of sheets) {
    if (sheet.properties.title[0] == '_') continue
    var response = await api.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheet.properties.title}!A:AAA`,
      majorDimension: 'ROWS',
    })
    var { values } = response.data
    var header = values.shift()
    var isKeyed = header.indexOf('key') > -1
    var isValued = header.indexOf('value') > -1
    var out = isKeyed ? {} : []
    for (var row of values) {
      // skip blank rows
      if (!row.length) continue
      var obj = {}
      row.forEach(function (value, i) {
        var key = header[i]
        obj[key] = cast(value)
      })
      if (isKeyed) {
        out[obj.key] = isValued ? obj.value : obj
      } else {
        out.push(obj)
      }
    }
    var filename = `src/data/${sheet.properties.title.replace(
      /\s+/g,
      '_'
    )}.sheet.json`
    console.log(`Saving sheet to ${filename}`)
    // grunt.file.write(filename, JSON.stringify(out, null, 2));
    writeFile(filename, JSON.stringify(out, null, 2))
    resolve(filename)
  }
}




module.exports = { googleAuth }

