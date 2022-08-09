
// Set brand object to override CSS based on this market's styles
let getBrands = function(market){
	// We can add any Hearst global overrides here:
	let defaultObj = {
		styles: {
			"@alert-red": "#d20000",
			// Defaults
			"@hed": '"Lora", Georgia, serif',
			"@hed-secondary": '"Lora", Georgia, serif',
			"@serif": '"Lora", Georgia, serif',
			"@sans": '"Source Sans Pro", Helvetica, sans-serif',
			"@sans-cond": '"Source Sans Pro", Helvetica, sans-serif',
		},
		attributes: {
			"subscribeLink": "https://www.hearst.com/newspapers?projects=true"
		}
	}

	// Handle market-specific styles here:
	let marketObj = {
		/* San Franicsco Chronicle */
		SFC: {
			styles: {
				"@brand": "#26A0A5",
				"@hed": '"Tiempos Headline", Georgia, serif',
				"@hed-secondary": '"Tiempos Headline", Georgia, serif',
				"@serif": '"Tiempos", Georgia, serif',
				"@sans": '"National", Helvetica, sans-serif',
				"@sans-cond": '"National", Helvetica, sans-serif',
			},
			attributes: {
				"marketPrefix": "sf",
				"siteName": "The San Francisco Chronicle",
				"twitter": "sfchronicle",
				"gaAccount": "UA-1616916-26",
				"subscribeLink": "https://www.sfchronicle.com/subproject"
			}
		},

		/* Houston Chronicle */
		Houston: {
			styles: {
				"@brand": "#ff7500",
				"@hed": '"Publico Headline", Georgia, serif',
				"@hed-secondary": '"Marr Sans Condensed", Georgia, serif',
				"@serif": '"Publico", Georgia, serif',
				"@sans": '"Marr Sans", Helvetica, sans-serif',
				"@sans-cond": '"Marr Sans Condensed", Georgia, serif',
			},
			attributes: {
				"marketPrefix": "hc",
				"siteName": "The Houston Chronicle",
				"twitter": "HoustonChron",
				"invert": true,
				"gaAccount": "UA-1616916-24",
				"subscribeLink": "https://www.houstonchronicle.com/subproject"
			}
		},

		/* Albany Times Union */
		Albany: {
			styles: {
				"@brand": "#006FBA",
				"@hed": '"ChronicleDispCond", Georgia, serif',
				"@hed-secondary": '"ChronicleDispCond", Georgia, serif',
				"@serif": '"ChronicleText", Georgia, serif',
				"@sans": '"HelveticaNeue", Helvetica, sans-serif',
				"@sans-cond": '"HelveticaNeueCond", Helvetica, sans-serif',
				"@base-font-size": "20px",

			},
			attributes: {
				"marketPrefix": "tu",
				"siteName": "Times Union",
				"twitter": "timesunion",
				"invert": true,
				"gaAccount": "UA-1616916-7",
				"subscribeLink": "https://www.timesunion.com/subproject"
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
				"gaAccount": "UA-1616916-27",
				"subscribeLink": "https://www.expressnews.com/subproject"
			}
		},

		/* Connecticut */
		CT: {
			styles: {
				"@brand": "#1A98FF",
			},
			attributes: {
				"marketPrefix": "in",
				"siteName": "CTInsider",
				"twitter": "insider_ct",
				"invert": true,
				"gaAccount": "UA-1616916-99",
				"subscribeLink": "https://www.ctinsider.com/subproject"
			}
		},

		/* Connecticut */
		Texcom: {
			styles: {
				"@brand": "#900900",
			},
			attributes: {
				"marketPrefix": "texcom/mrt",
				"siteName": "Midland Reporter-Telegram",
				"twitter": "mwtnews",
				"invert": true,
				"gaAccount": "UA-1616916-99",
				"subscribeLink": "/subproject"
			}
		},

		/* Connecticut */
		Midcom: {
			styles: {
				"@brand": "#900900",
			},
			attributes: {
				"marketPrefix": "midcom/mid",
				"siteName": "Midland Daily News",
				"twitter": "MDN",
				"invert": true,
				"gaAccount": "UA-1616916-99",
				"subscribeLink": "/subproject"
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
