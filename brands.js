
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

			"marketPrefix": "tu",
		},

		/* San Antonio Express News */
		SanAntonio: {
			styles: {
				"@brand": "#ba141a",
			},
			
			"marketPrefix": "sa",
		},

		/* Connecticut Post */
		CTPost: {
			styles: {
				"@brand": "#900900",
			},
			
			"marketPrefix": "ct",
		},

		/* New Haven Register */
		NewHaven: {
			styles: {
				"@brand": "#39547a",
			},
			
			"marketPrefix": "nh",
		},

		/* Greenwich Times */
		Greenwich: {
			styles: {
				"@brand": "#175647",
			},
			
			"marketPrefix": "gt",
		},

		/* Stamford Advocate */
		Stamford: {
			styles: {
				"@brand": "#0154a5",
			},

			"marketPrefix": "st",
		},

		/* The Norwalk Hour */
		TheHour: {
			styles: {
				"@brand": "#2e5687",
			},

			"marketPrefix": "th",
		},

		/* The News-Times */
		NewsTimes: {
			styles: {
				"@brand": "#468cae",
			},

			"marketPrefix": "nt",
		},

		/* Misc */
		TK: {
			styles: {},
			"marketPrefix": "tk"
		}
	}

	// Combine global and market styles to return the final object
	let combinedStyles = {
		styles: Object.assign(defaultObj.styles, marketObj[market].styles),
		marketPrefix: marketObj[market].marketPrefix
	}
	return combinedStyles
}

module.exports = { getBrands }