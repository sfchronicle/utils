
let { getBrands } = require('sfc-utils/brands')

// Handle nav for various markets and include nav options for other links
let getSpecialNav = function(meta, urlAdd, forceColor, navLink, navArray){

	// If we aren't passing meta in, we have to call getSettings here
	if (!meta){
		let {getSettings} = require('sfc-utils/settings')
		meta = getSettings()
	}

	// If a link object was not provided, make one
	if (!navLink){
		navLink = {
			url: "#___gatsby",
			text: "Special Report",
			target: "_self"
		}
	}

	// If a navArray was provided, create the subnav
	let subnav = ""
	let dropdownIcon = ""
	if (navArray && navArray.length > 0){
		subnav = `<ul id="subnav">`
		for (let i = 0; i <navArray.length; i++){
			subnav += `<li><a class="active" href="${navArray[i].url}" target="${navArray[i].target}"><span class="arrow-bullet">▶</span> ${navArray[i].text}</a></li>`
		}
		subnav += `</ul>`
		// Add a dropdown icon
		dropdownIcon = `<div class="dropdown-icon">▾</div>`
	}

	// Extension to URL if passed in
	if (!urlAdd){
		urlAdd = ""
	}

	let {attributes: {marketPrefix, invert}} = getBrands(meta.PROJECT.MARKET_KEY)
	// Handle various CT domains
	if (typeof window !== "undefined"){
		switch(window.location.origin){
			case "https://www.ctpost.com": marketPrefix = "ct"; break;
			case "https://www.nhregister.com": marketPrefix = "nh"; break;
			case "https://www.greenwichtime.com": marketPrefix = "gt"; break;
			case "https://www.stamfordadvocate.com": marketPrefix = "st"; break;
			case "https://www.thehour.com": marketPrefix = "th"; break;
			case "https://www.newstimes.com": marketPrefix = "nt"; break;
			case "https://www.middletownpress.com": marketPrefix = "mp"; break;
		}
	}

	// Default is white text on black nav (SFC style)
	let invertClass = ""
	let color = "white"
	// If inverted, do black on white nav
	// Only change things if color isn't forced to white
	if (invert || forceColor === "white"){
		invertClass = "invert"
		color = "black"
	}

	let subfolder = ""
	if (meta.PROJECT.SUBFOLDER){
		subfolder = meta.PROJECT.SUBFOLDER + "/"
	}

	let navHTML = `<nav class="topper-special-nav-container ${invertClass}">
    <div class="topper-special-nav-center">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <img
            class="topper-nav-desk-logo"
            alt="Logo"
            src="https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-${color}.png"
          ></img>
          <img
            class="topper-nav-mobile-logo"
            alt="Logo"
            src="https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-square-${color}.png"
          ></img>
        </div>
      </a>
    </div>
    <div class="topper-nav-right">
      
    </div>
    ${subnav}
  </nav>`

  return navHTML
}

module.exports = { getSpecialNav }