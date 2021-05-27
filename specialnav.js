
let { getBrands } = require('./brands')

// Handle nav for various markets and include nav options for other links
let getSpecialNav = function(meta, urlAdd, forceColor, navLink, navArray){

	// If we aren't passing meta in, we have to call getSettings here
	if (!meta){
		let {getSettings} = require('./settings')
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
	const getSubLink = () => {
		let subscribeLink
		switch(marketPrefix){
			case "sf": subscribeLink = "https://subscription.sfchronicle.com/"; break;
			case "hc": subscribeLink = "https://offers.houstonchronicle.com/"; break;
			case "en": subscribeLink = "https://subscription.expressnews.com/"; break;
			case "tu": subscribeLink = "https://subscription.timesunion.com/"; break;
			case "ct": "https://subscription.hearstmediact.com/?siteid=CT_PO"; break;
			case "nh": "https://subscription.hearstmediact.com/?siteid=CT_NHR"; break;
			case "gt": "https://subscription.hearstmediact.com/?siteid=CT_GT"; break;
			case "st": "https://subscription.hearstmediact.com/?siteid=CT_AD"; break;
			case "th": "https://subscription.hearstmediact.com/?siteid=CT_HR"; break;
			case "nt": "https://subscription.hearstmediact.com/?siteid=CT_NT"; break;
			case "mp": "https://subscription.hearstmediact.com/?siteid=CT_MP"; break;

		}
		return subscribeLink
	}
	const subLink = getSubLink();
	const getLinkHtml = (prefix) =>{
		let htmlBlock = `<a class="special-nav-subscribe-link" href=${subLink} target="_blank">
		<p>Subscribe</p>
		</a>`
		if(prefix == "ct"){
			htmlBlock += `<a class="special-nav-newsletter-link" href="https://link.ctpost.com/join/signup-po" target="_blank">
			<p>Subscribe</p>
			</a>`
		}
		else if(prefix == "sf"){
			htmlBlock += `<a class="special-nav-newsletter-link" href="https://link.sfchronicle.com/join/signup" target="_blank">
			<p>Subscribe</p>
			</a>`
		}
		else if(prefix == "hc"){
			htmlBlock += `<a class="special-nav-newsletter-link" href="hhttps://link.houstonchronicle.com/join/signup-hc" target="_blank">
			<p>Subscribe</p>
			</a>`
	}
	return htmlBlock
}
	let navRightHtml = getSubLink(marketPrefix)
	console.log(subLink)
	let navHTML = `<nav class="topper-special-nav-container ${invertClass}">
	<div class="special-nav-left">
	<a class="special-nav-back" 
	href="/"
	target="_blank"
	rel="noopener noreferrer">
		<svg class="special-nav-carrot" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
		viewBox="0 0 16.9 15" style="enable-background:new 0 0 16.9 15;" xml:space="preserve">
		<polygon points="9,14.5 2,7.5 9,0.5 10.3,1.8 4.5,7.5 10.3,13.2 "/>
		</svg>
		<p class="special-nav-home">
		Home
		<p>
	</a>
	</div>
	<div class="special-nav-center"> 
	<a class = "special-nav-logo-link"
		href="/"
        target="_blank"
        rel="noopener noreferrer">
	  <img
	  class="topper-special-nav-desk-logo"
	  alt="Logo"
	  src="https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-${color}.png"
	></img>
	</a>
	</div>
	<div class="special-nav-right">
	${navHTML}
	</div>
  </nav>`

  return navHTML
}

module.exports = { getSpecialNav }