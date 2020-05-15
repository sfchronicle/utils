
// Set brand object to override CSS based on this market's styles
let getBrands = function(market){
	// We can add any Hearst global overrides here:
	let globalObj = {
		"@alert-red": "#d20000"
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

		/* San Antonio Express News */
		SanAntonio: {
			"@brand": "#ff7500",
		},

		/* Albany Times Union */
		Albany: {
			"@brand": "#ff7500",
		},

		/* Connecticut Post */
		CTPost: {
			"@brand": "#ff7500",
		},

		/* New Haven */
		NewHaven: {
			"@brand": "#ff7500",
		},

		/* Greenwich Time */
		Greenwich: {
			"@brand": "#ff7500",
		},

		/* Stamford Advocate */
		Stamford: {
			"@brand": "#ff7500",
		},

		/* The Norwalk Hour */
		TheHour: {
			"@brand": "#ff7500",
		},

		/* The News-Times */
		NewsTimes: {
			"@brand": "#ff7500",
		},

	}

	// Combine global and market styles to return the final object
	let combinedStyles = Object.assign(globalObj, marketObj[market])
	return combinedStyles
}

module.exports = { getBrands }