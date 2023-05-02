
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

			"@sans": '"Source Sans Pro Light", Helvetica, sans-serif',
			"@sans-light": '"Source Sans Pro Light", Helvetica, sans-serif',
			"@sans-med": '"Source Sans Pro Regular", Helvetica, sans-serif',
			"@sans-book": '"Source Sans Pro Regular", Helvetica, sans-serif',
			"@sans-bold": '"Source Sans Pro Bold", Helvetica, sans-serif',

			// Icons
			"@sub-icon": `url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white"><path d="M160 416H96c-17.67 0-32-14.33-32-32V128c0-17.67 14.33-32 32-32h64c17.67 0 32-14.33 32-32S177.7 32 160 32H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h64c17.67 0 32-14.33 32-32S177.7 416 160 416zM502.6 233.4l-128-128c-12.51-12.51-32.76-12.49-45.25 0c-12.5 12.5-12.5 32.75 0 45.25L402.8 224H192C174.3 224 160 238.3 160 256s14.31 32 32 32h210.8l-73.38 73.38c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0l128-128C515.1 266.1 515.1 245.9 502.6 233.4z"/></svg>')`,
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
				"@hed": '"Tiempos Headline Black", Georgia, serif',
				"@hed-alt": '"Tiempos Headline Light", Georgia, serif',
				"@serif-book": '"Tiempos Regular", Georgia, serif',
				"@serif-bold": '"Tiempos Bold", Georgia, serif',

				"@sans": '"National Medium", Helvetica, sans-serif',
				"@sans-light": '"National Light", Helvetica, sans-serif',
				"@sans-med": '"National Medium", Helvetica, sans-serif',
				"@sans-book": '"National Book", Helvetica, sans-serif',
				"@sans-bold": '"National Bold", Helvetica, sans-serif',
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
				"@hed": '"Marr Sans Condensed Semibold", Georgia, serif',
				"@hed-alt": '"Publico Headline Medium", Georgia, serif',
				"@serif-book": '"Publico Text Roman", Georgia, serif',
				"@serif-bold": '"Publico Text Bold", Georgia, serif',

				"@sans": '"Marr Sans Regular", Helvetica, sans-serif',
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
				"gaAccount": "UA-1616916-24",
				"subscribeLink": "https://www.houstonchronicle.com/subproject"
			}
		},

		/* Albany Times Union */
		Albany: {
			styles: {
				"@brand": "#006FBA",
				"@hed": '"ChronicleDispCond-Black", Georgia, serif',
				"@hed-alt": '"ChronicleDispCond-Roman", Georgia, serif',
				"@serif-book": '"ChronicleTextG2-Roman", Georgia, serif',
				"@serif-bold": '"ChronicleTextG2-Bold", Georgia, serif',
				"@base-font-size": "20px",

				"@sans": '"HelveticaNeue-Roman", Helvetica, sans-serif',
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
				"siteName": "Express-News",
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
		Conroe: {
			styles: {
				"@brand": "#900900",
				"@brand-secondary": "#189196"
			},
			attributes: {
				"marketPrefix": "conroe",
				"siteName": "Conroe Courier",
				"twitter": "ConroeCourier",
				"invert": true,
				"gaAccount": "UA-1616916-99",
				"subscribeLink": "https://www.yourconroenews.com/subproject",
				"sailCustomer": "4a181de0b63a131cf27f8ea9485e5e1c",
				"sailSiteName": "the-courier-of-montgomery-county",
				"siteId": 68
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
