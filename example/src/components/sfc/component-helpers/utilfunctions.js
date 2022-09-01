
// Grabs a param from the URL structure
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function convertURL(url){
  // Check if we already have a ?
  let newURL = url
  let paramConcat = "&"
  if (newURL.indexOf("?") === -1){
    paramConcat = "?"
  }
  newURL += paramConcat + "fromRichie=1"
  return newURL
}

// Adds Richie param to an array of links
function setRichieParam(linksArray){
  if (!linksArray){
    return null;
  }
  if (typeof window !== "undefined"){
    let param = getParameterByName("fromRichie")

    // Check if we're dealing with a string
    if (typeof linksArray == "string"){
      if (param){
        let newURL = convertURL(linksArray)
        return newURL
      } else {
        return linksArray
      }
    }

    // Otherwise, assume array
    let newArray = linksArray.slice()
    if (param){
      // If we found the param, loop through and add it to all the section links
      for (let item in newArray){
        let thisItem = newArray[item]
        thisItem.url = convertURL(thisItem.url)
      }
    }
    return newArray
  } else {
    // If window is undefined, return empty
    return []
  }
}

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

export { getParameterByName, setRichieParam, debounce }