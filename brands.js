
// Set brand object to override CSS based on this market's styles
let getBrands = function(market){
	// We can add any Hearst global overrides here:
	let defaultObj = {
		"@alert-red": "#d20000",
		// Defaults
		"@hed-black": '"Lora Bold", Georgia, serif',
		"@hed-light": '"Lora Regular", Georgia, serif',
		"@serif-book": '"Lora Regular", Georgia, serif',
		"@serif-bold": '"Lora Regular", Georgia, serif',

		"@sans-light": '"Source Sans Pro Regular", Helvetica, sans-serif',
		"@sans-med": '"Source Sans Pro Regular", Helvetica, sans-serif',
		"@sans-book": '"Source Sans Pro Semibold", Helvetica, sans-serif',
		"@sans-bold": '"Source Sans Pro Bold", Helvetica, sans-serif',
	}

	// Handle market-specific styles here:
	let marketObj = {
		/* San Franicsco Chronicle */
		SFC: {
			"@brand": "#2cb9bf",
			"@hed-black": '"Tiempos Headline Black", Georgia, serif',
			"@hed-light": '"Tiempos Headline Light", Georgia, serif',
			"@serif-book": '"Tiempos Regular", Georgia, serif',
			"@serif-bold": '"Tiempos Bold", Georgia, serif',

			"@sans-light": '"National Light", Helvetica, sans-serif',
			"@sans-med": '"National Medium", Helvetica, sans-serif',
			"@sans-book": '"National Book", Helvetica, sans-serif',
			"@sans-bold": '"National Bold", Helvetica, sans-serif',
		},

		/* Houston Chronicle */
		Houston: {
			"@brand": "#ff7500",
			"@hed-black": '"Marr Sans Condensed Semibold", Georgia, serif',
			"@hed-light": '"Publico Headline Medium", Georgia, serif',
			"@serif-book": '"Publico Text Roman", Georgia, serif',
			"@serif-bold": '"Publico Text Bold", Georgia, serif',

			"@sans-light": '"Marr Sans Regular", Helvetica, sans-serif',
			"@sans-med": '"Marr Sans Regular", Helvetica, sans-serif',
			"@sans-book": '"Marr Sans Regular", Helvetica, sans-serif',
			"@sans-bold": '"Marr Sans Semibold", Helvetica, sans-serif',
		},

		/* Albany Times Union */
		Albany: {
			"@brand": "#0095c7",
			"@hed-black": '"ChronicleDispCond-Black", Georgia, serif',
			"@hed-light": '"ChronicleDispCond-Roman", Georgia, serif',
			"@serif-book": '"ChronicleTextG2-Roman", Georgia, serif',
			"@serif-bold": '"ChronicleTextG2-Bold", Georgia, serif',

			"@sans-light": '"HelveticaNeue-Roman", Helvetica, sans-serif',
			"@sans-med": '"HelveticaNeue-Roman", Helvetica, sans-serif',
			"@sans-book": '"HelveticaNeue-Roman", Helvetica, sans-serif',
			"@sans-bold": '"HelveticaNeue-HeavyCond", Helvetica, sans-serif',
		},

		/* San Antonio Express News */
		SanAntonio: {
			"@brand": "#ba141a",
		},

		/* Connecticut Post */
		CTPost: {
			"@brand": "#900900",
		},

		/* New Haven Register */
		NewHaven: {
			"@brand": "#39547a",
		},

		/* Greenwich Times */
		Greenwich: {
			"@brand": "#175647",
		},

		/* Stamford Advocate */
		Stamford: {
			"@brand": "#0154a5",
		},

		/* The Norwalk Hour */
		TheHour: {
			"@brand": "#2e5687",
		},

		/* The News-Times */
		NewsTimes: {
			"@brand": "#468cae",
		},

	}

	// Combine global and market styles to return the final object
	let combinedStyles = Object.assign(defaultObj, marketObj[market])
	return combinedStyles
}

module.exports = { getBrands }