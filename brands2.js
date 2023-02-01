
// Set brand object to override CSS based on this market's styles
let getBrands2 = function(market){
	// We can add any Hearst global overrides here:
	let defaultObj = {
		styles: {
			"@alert-red": "#d20000",
			// Defaults
			"@hed": '"Lora", Georgia, serif',
			"@hed-alt": '"Lora", Georgia, serif',
			"@serif": '"Lora", Georgia, serif',
			"@sans": '"Source Sans Pro", Helvetica, sans-serif',
			"@sans-alt": '"Source Sans Pro", Helvetica, sans-serif',

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
				"@brand-secondary": "#FFBC30",
				"@hed": '"Tiempos Headline", Georgia, serif',
				"@hed-alt": '"Tiempos Headline", Georgia, serif',
				"@serif": '"Tiempos", Georgia, serif',
				"@sans": '"National", Helvetica, sans-serif',
				"@sans-alt": '"National", Helvetica, sans-serif'
			},
			attributes: {
				"marketPrefix": "sf",
				"siteName": "The San Francisco Chronicle",
				"twitter": "sfchronicle",
				"gaAccount": "UA-1616916-26",
				"subscribeLink": "https://www.sfchronicle.com/subproject",
				"sailCustomer": "fca2a0390286f0e53120a668534d9529"
			}
		},

		/* Houston Chronicle */
		Houston: {
			styles: {
				"@brand": "#FF7500",
				"@brand-secondary": "#1874CB",
				"@hed": '"Publico Headline", Georgia, serif',
				"@hed-alt": '"Marr Sans Condensed", Georgia, serif',
				"@serif": '"Publico", Georgia, serif',
				"@sans": '"Marr Sans", Helvetica, sans-serif',
				"@sans-alt": '"Marr Sans Condensed", Helvetica, sans-serif'
			},
			attributes: {
				"marketPrefix": "hc",
				"siteName": "The Houston Chronicle",
				"twitter": "HoustonChron",
				"invert": true,
				"gaAccount": "UA-1616916-24",
				"subscribeLink": "https://www.houstonchronicle.com/subproject",
				"sailCustomer": "48e30b5083cf6bf47c519651453c9e8a"
			}
		},

		/* Albany Times Union */
		Albany: {
			styles: {
				"@brand": "#006FBA",
				"@brand-secondary": "#E5A72C",
				"@hed": '"ChronicleDispCond", Georgia, serif',
				"@hed-alt": '"ChronicleDispCond", Georgia, serif',
				"@serif": '"ChronicleText", Georgia, serif',
				"@sans": '"HelveticaNeue", Helvetica, sans-serif',
				"@sans-alt": '"HelveticaNeueCond", Helvetica, sans-serif'
			},
			attributes: {
				"marketPrefix": "tu",
				"siteName": "Times Union",
				"twitter": "timesunion",
				"invert": true,
				"gaAccount": "UA-1616916-7",
				"subscribeLink": "https://www.timesunion.com/subproject",
				"sailCustomer": "5bb9eee089bdc2e27cbd265535ad1f90"
			}
		},

		/* San Antonio Express News */
		SanAntonio: {
			styles: {
				"@brand": "#BA142D",
				"@brand-secondary": "#189196"
			},
			attributes: {
				"marketPrefix": "sa",
				"siteName": "Express News",
				"twitter": "ExpressNews",
				"invert": true,
				"gaAccount": "UA-1616916-27",
				"subscribeLink": "https://www.expressnews.com/subproject",
				"sailCustomer": "aec52c4681ed63b5beab139a2584f0d4"
			}
		},

		/* Connecticut */
		CT: {
			styles: {
				"@brand": "#1A98FF",
				"@brand-secondary": "#FFBC30"
			},
			attributes: {
				"marketPrefix": "in",
				"siteName": "CTInsider",
				"twitter": "insider_ct",
				"invert": true,
				"gaAccount": "UA-1616916-99",
				"subscribeLink": "https://www.ctinsider.com/subproject",
				"sailCustomer": "9b21160afa226c9f84d27b47c3d52364"
			}
		},

		/* Communities */
		Texcom: {
			styles: {
				"@brand": "#900900",
				"@brand-secondary": "#189196"
			},
			attributes: {
				"marketPrefix": "texcom/mrt",
				"siteName": "Midland Reporter-Telegram",
				"twitter": "mwtnews",
				"invert": true,
				"gaAccount": "UA-1616916-99",
				"subscribeLink": "/subproject",
				"sailCustomer": "4a181de0b63a131cf27f8ea9485e5e1c"
			}
		},
		Midcom: {
			styles: {
				"@brand": "#900900",
				"@brand-secondary": "#189196"
			},
			attributes: {
				"marketPrefix": "midcom/mid",
				"siteName": "Midland Daily News",
				"twitter": "MDN",
				"invert": true,
				"gaAccount": "UA-1616916-99",
				"subscribeLink": "/subproject",
				"sailCustomer": "f3dc0abb53995f957783e76eff3ef01e"
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
				"sailCustomer": "4a181de0b63a131cf27f8ea9485e5e1c"
			}
		},

		/* Misc */
		TK: {
			styles: {
				"@brand": "#900900",
				"@brand-secondary": "#189196"
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

module.exports = { getBrands2 }
