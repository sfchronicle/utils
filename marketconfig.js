
let { getSettings } = require('./settings')
let settings = getSettings()

// Handle nav for various markets and include nav options for other links
let getMarketConfig = function(inverted){
	// Set icons based on market
	let marketPrefix = ""
	switch(settings.PROJECT.MARKET_KEY){
		case "SFC": marketPrefix = "sf"; break;
		// Invert is the default for Houston
		// Add inverted = !inverted; for any that have that mod
		case "Houston": marketPrefix = "hc"; inverted = !inverted; break;
		case "SanAntonio": marketPrefix = "sa"; inverted = !inverted; break;
		case "Albany": marketPrefix = "tu"; break;
		case "CT": marketPrefix = "ct"; break;
		default: marketPrefix = "tk"; break;
	}

	// If inverted, do black on white na
  return [ marketPrefix, inverted ]
}

module.exports = { getMarketConfig }