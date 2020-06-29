
// Set brand object to override CSS based on this market's styles
let getBrands = function(market){
	// We can add any Hearst global overrides here:
	let defaultObj = {
		styles: {
			"@alert-red": "#d20000",
			// Defaults
			"@hed": '"Lora Bold", Georgia, serif',
			"@hed-alt": '"Lora Regular", Georgia, serif',
			"@serif-book": '"Lora Light", Georgia, serif',
			"@serif-bold": '"Lora Light", Georgia, serif',

			"@sans-light": '"Source Sans Pro Light", Helvetica, sans-serif',
			"@sans-med": '"Source Sans Pro Regular", Helvetica, sans-serif',
			"@sans-book": '"Source Sans Pro Regular", Helvetica, sans-serif',
			"@sans-bold": '"Source Sans Pro Bold", Helvetica, sans-serif',
		},
		attributes: {
			"subscribeLink": "https://www.hearst.com/newspapers"
		}
	}

	// Handle market-specific styles here:
	let marketObj = {
		/* San Franicsco Chronicle */
		SFC: {
			styles: {
				"@brand": "#2cb9bf",
				"@hed": '"Tiempos Headline Black", Georgia, serif',
				"@hed-alt": '"Tiempos Headline Light", Georgia, serif',
				"@serif-book": '"Tiempos Regular", Georgia, serif',
				"@serif-bold": '"Tiempos Bold", Georgia, serif',

				"@sans-light": '"National Light", Helvetica, sans-serif',
				"@sans-med": '"National Medium", Helvetica, sans-serif',
				"@sans-book": '"National Book", Helvetica, sans-serif',
				"@sans-bold": '"National Bold", Helvetica, sans-serif',
			},
			attributes: {
				"marketPrefix": "sf",
				"siteName": "The San Francisco Chronicle",
				"twitter": "sfchronicle",
				"subscribeLink": "https://offers.sfchronicle.com/subscribe"
			}
		},

		/* Houston Chronicle */
		Houston: {
			styles: {
				"@brand": "#ff7500",
				"@hed": '"Marr Sans Condensed Semibold", Georgia, serif',
				"@hed-alt": '"Publico Headline Medium", Georgia, serif',
				"@serif-book": '"Publico Text Roman", Georgia, serif',
				"@serif-bold": '"Publico Text Bold", Georgia, serif',

				"@sans-light": '"Marr Sans Regular", Helvetica, sans-serif',
				"@sans-med": '"Marr Sans Regular", Helvetica, sans-serif',
				"@sans-book": '"Marr Sans Regular", Helvetica, sans-serif',
				"@sans-bold": '"Marr Sans Semibold", Helvetica, sans-serif',
			},
			attributes: {
				"marketPrefix": "hc",
				"siteName": "The Houston Chronicle",
				"twitter": "HoustonChron",
				"invert": true,
				"subscribeLink": "https://offers.sfchronicle.com/subscribe"
			}
		},

		/* Albany Times Union */
		Albany: {
			styles: {
				"@brand": "#0095c7",
				"@hed": '"ChronicleDispCond-Black", Georgia, serif',
				"@hed-alt": '"ChronicleDispCond-Roman", Georgia, serif',
				"@serif-book": '"ChronicleTextG2-Roman", Georgia, serif',
				"@serif-bold": '"ChronicleTextG2-Bold", Georgia, serif',

				"@sans-light": '"HelveticaNeue-Roman", Helvetica, sans-serif',
				"@sans-med": '"HelveticaNeue-Roman", Helvetica, sans-serif',
				"@sans-book": '"HelveticaNeue-Roman", Helvetica, sans-serif',
				"@sans-bold": '"HelveticaNeue-HeavyCond", Helvetica, sans-serif',
			},
			attributes: {
				"marketPrefix": "tu",
				"siteName": "Times Union",
				"twitter": "timesunion",
				"invert": true,
				"subscribeLink": "https://offers.sfchronicle.com/subscribe"
			}
		},

		/* San Antonio Express News */
		SanAntonio: {
			styles: {
				"@brand": "#ba141a",
			},
			attributes: {
				"marketPrefix": "sa",
				"siteName": "Express News",
				"twitter": "ExpressNews",
				"invert": true,
				"subscribeLink": "https://offers.sfchronicle.com/subscribe"
			}
		},

		/* Connecticut */
		CT: {
			styles: {
				"@brand": "#900900",
			},
			attributes: {
				"marketPrefix": "ct",
				"siteName": "Connecticut Post",
				"twitter": "connpost",
				"invert": true,
				"subscribeLink": "https://offers.sfchronicle.com/subscribe"
			}
		},

		/* Misc */
		TK: {
			styles: {
				"@brand": "#900900",
			},
			attributes: {
				"marketPrefix": "tk",
				"siteName": "Hearst Digital News",
				"twitter": "Hearst",
				"invert": true,
			}
		}
	}

	// Combine global and market styles to return the final object
	let combinedStyles = {
		styles: Object.assign(defaultObj.styles, marketObj[market].styles),
		attributes: Object.assign(defaultObj.attributes, marketObj[market].attributes)
	}
	return combinedStyles
}

module.exports = { getBrands }