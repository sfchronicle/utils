/*

Uses the Google Drive API to parse Google Doc 
with ArchieML generate JSON file

Sheets must be "published to web" before they
can be accessed by this task

Run `grunt docs` to run task

*/

var { google } = require('googleapis')
var async = require('async')
var url = require('url')
var writeFile = require('write')
var authObj = require("./googleauth");
var archieml = require('archieml')
var htmlparser = require('htmlparser2')
var Entities = require('html-entities').AllHtmlEntities

let googleAuth = (config) => {
  var auth = null
  authObj.authenticate({fallback: false})
  .then((resp) => {
    auth = resp
    grabDocs(auth, config).catch(() => {
      // If the first attempt failed, then make another req using the fallback
      authObj.authenticate({fallback: true}).then((resp) => {
        auth = resp
        grabDocs(auth, config)
      })
    })
  }).catch(() => { // Failure if we fall back but there's no token
    auth = authObj.task();
    grabDocs(auth, config)
  });
}

var camelCase = function(str) {
  return str.replace(/[^\w]+(\w)/g, function(all, match) {
    return match.toUpperCase()
  })
}

/*
 * Large document sets may hit rate limits; you can find details on your quota at:
 * https://console.developers.google.com/apis/api/drive.googleapis.com/quotas?project=<project>
 * where <project> is the project you authenticated with using `grunt google-auth`
 */
let grabDocs = (auth, config) => {
  return new Promise((resolve, reject) => {
    var drive = google.drive({
      auth,
      version: 'v3',
    })

    async.eachLimit(
      config.GOOGLE_DOCS,
      2, // adjust this up or down based on rate limiting
      async function(fileId) {
        var meta = await drive.files.get({
          fileId,
        })
        .catch(() => { // Maybe service account we doesn't have permissions -- try with normal token
          reject()
        })
        if (!meta){
          return
        }
        var filename = 'src/data/' + meta.data.name.replace(/\s+/g, '_') + '.json'

        drive.files.export({ fileId: fileId, mimeType: 'text/html' }, function(
          err,
          docHtml
        ) {
          var handler = new htmlparser.DomHandler(function(error, dom) {
            var tagHandlers = {
              _base: function(tag) {
                var str = ''
                tag.children.forEach(function(child) {
                  if ((func = tagHandlers[child.name || child.type]))
                    str += func(child)
                })
                return str
              },
              text: function(textTag) {
                return textTag.data
              },
              span: function(spanTag) {
                return tagHandlers._base(spanTag)
              },
              p: function(pTag) {
                return tagHandlers._base(pTag) + '\n'
              },
              a: function(aTag) {
                var href = aTag.attribs.href
                if (href === undefined) return ''

                // extract real URLs from Google's tracking
                // from: http://www.google.com/url?q=http%3A%2F%2Fwww.sfchronicle.com...
                // to: http://www.sfchronicle.com...
                if (
                  aTag.attribs.href &&
                  url.parse(aTag.attribs.href, true).query &&
                  url.parse(aTag.attribs.href, true).query.q
                ) {
                  href = url.parse(aTag.attribs.href, true).query.q
                }

                var str = '<a href="' + href + '">'
                str += tagHandlers._base(aTag)
                str += '</a>'
                return str
              },
              li: function(tag) {
                return '* ' + tagHandlers._base(tag) + '\n'
              },
            }

            ;['ul', 'ol'].forEach(function(tag) {
              tagHandlers[tag] = tagHandlers.span
            })

            ;['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(tag) {
              tagHandlers[tag] = tagHandlers.p
            })

            var body = dom[0].children[1]
            var parsedText = tagHandlers._base(body)

            // Convert html entities into the characters as they exist in the google doc
            var entities = new Entities()
            parsedText = entities.decode(parsedText)

            // Remove smart quotes from inside tags
            parsedText = parsedText.replace(/<[^<>]*>/g, function(match) {
              return match.replace(/”|“/g, '"').replace(/‘|’/g, "'")
            })

            // Parse with Archie
            var parsed = archieml.load(parsedText)

            // Create the file
            writeFile(filename, JSON.stringify(parsed, null, 2))
          })

          var parser = new htmlparser.Parser(handler)
          parser.write(docHtml.data)
          parser.done()
          console.log('\x1b[32m', filename + ' created successfully')
          // Exit the promise
          resolve(true)
        })
      }
    )
  })
}



module.exports = { googleAuth }
