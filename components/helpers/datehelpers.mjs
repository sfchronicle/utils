// Add SFC utils
import { getSettings } from '../../settings'
const settings = getSettings()

// declare date function variables
// Convert date to readable time
const readablePubDate = convertDatesToAP(settings.PROJECT.DATE)
// Check safely for MOD_DATE
let readableModDate
// Convert date string to AP style abbreviations
let pubdateString = readablePubDate
let moddateString = ''

function convertDatesToAP(dateString) {
  // Convert date string to AP style abbreviations
  let newDateString = dateString
  newDateString = newDateString
    .replace('January', 'Jan.')
    .replace('February', 'Feb.')
    .replace('August', 'Aug.')
    .replace('September', 'Sept.')
    .replace('October', 'Oct.')
    .replace('November', 'Nov.')
    .replace('December', 'Dec.')
    .replace('AM', 'a.m.')
    .replace('PM', 'p.m.')
  // Return the result
  return newDateString
}

;(function prepDates() {
  if (typeof settings.PROJECT.MOD_DATE !== 'undefined') {
    readableModDate = convertDatesToAP(settings.PROJECT.MOD_DATE)
  } else {
    // If MOD_DATE does not exist, set false so it doesn't render
    readableModDate = false
  }

  // Only check moddate if we have a value
  if (readableModDate) {
    moddateString = readableModDate

    // Chop time off pubdate if possible
    try {
      // eslint-disable-next-line prefer-destructuring
      pubdateString = readablePubDate.match(/.*\d{4}/gm)[0]
    } catch (err) {
      // That's fine
      console.log(err)
    }
  }
})()

export { pubdateString, moddateString }