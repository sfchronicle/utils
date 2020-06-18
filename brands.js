
// Set brand object to override CSS based on this market's styles
let getBrands = function(market){
	// We can add any Hearst global overrides here:
	let defaultObj = {
		styles: {
			"@alert-red": "#d20000",
			// Defaults
			"@hed": '"Lora Bold", Georgia, serif',
			"@hed-alt": '"Lora Regular", Georgia, serif',
			"@serif-book": '"Lora Regular", Georgia, serif',
			"@serif-bold": '"Lora Regular", Georgia, serif',

			"@sans-light": '"Source Sans Pro Regular", Helvetica, sans-serif',
			"@sans-med": '"Source Sans Pro Regular", Helvetica, sans-serif',
			"@sans-book": '"Source Sans Pro Semibold", Helvetica, sans-serif',
			"@sans-bold": '"Source Sans Pro Bold", Helvetica, sans-serif',
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
			
			// Also include other things tied to the brand
			"homepageLink": "https://www.sfchronicle.com",
			"marketPrefix": "sf",
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

			"homepageLink": "https://www.houstonchronicle.com",
			"marketPrefix": "hc",
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

			"homepageLink": "https://www.timesunion.com",
			"marketPrefix": "tu",
		},

		/* San Antonio Express News */
		SanAntonio: {
			styles: {
				"@brand": "#ba141a",
			},
			
			"homepageLink": "https://www.expressnews.com",
			"marketPrefix": "sa",
		},

		/* Connecticut Post */
		CTPost: {
			styles: {
				"@brand": "#900900",
			},
			
			"homepageLink": "https://www.ctpost.com/",
			"marketPrefix": "ct",
		},

		/* New Haven Register */
		NewHaven: {
			styles: {
				"@brand": "#39547a",
			},
			
			"homepageLink": "https://www.nhregister.com/",
			"marketPrefix": "nh",
		},

		/* Greenwich Times */
		Greenwich: {
			styles: {
				"@brand": "#175647",
			},
			
			"homepageLink": "https://www.nhregister.com/",
			"marketPrefix": "nh",
		},

		/* Stamford Advocate */
		Stamford: {
			styles: {
				"@brand": "#0154a5",
			},

			"homepageLink": "https://www.stamfordadvocate.com/",
			"marketPrefix": "st",
		},

		/* The Norwalk Hour */
		TheHour: {
			styles: {
				"@brand": "#2e5687",
			},

			"homepageLink": "https://www.thehour.com",
			"marketPrefix": "th",
		},

		/* The News-Times */
		NewsTimes: {
			styles: {
				"@brand": "#468cae",
			},

			"homepageLink": "https://www.newstimes.com",
			"marketPrefix": "nt",
		},
	}

	// Combine global and market styles to return the final object
	let combinedStyles = {
		styles: Object.assign(defaultObj.styles, marketObj[market].styles)
	}
	return combinedStyles
}

module.exports = { getBrands }