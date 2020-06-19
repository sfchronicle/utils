
let { getSettings } = require('./settings')
let settings = getSettings()

let { getMarketConfig } = require('./marketconfig')

// Handle nav for various markets and include nav options for other links
let getNav = function(inverted, urlAdd, navLink, navArray){
	// TODO: Support navArray and create submenu

	// If a link object was not provided, make one
	if (!navLink){
		navLink = {
			url: "#___gatsby",
			text: "Special Report",
			target: "_self"
		}
	}

	// Extension to URL if passed in
	if (!urlAdd){
		urlAdd = ""
	}

	let [marketPrefix, invert] = getMarketConfig(inverted)

	// If inverted, do black on white nav
	let invertClass = ""
	let color = "white"
	if (invert){
		invertClass = "invert"
		color = "black"
	}

	let subfolder = ""
	if (settings.PROJECT.SUBFOLDER){
		subfolder = settings.PROJECT.SUBFOLDER + "/"
	}

	let navHTML = `<nav class="topper-nav-container ${invertClass}">
    <div class="topper-nav-left">
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
      <a
        class="topper-nav-title"
        href="${navLink.url}"
        target="${navLink.target || "_blank"}"
      >
        ${navLink.text}
      </a>
    </div>
    <div class="topper-nav-right">
      <div class="topper-nav-social">
        <a
          id="topper-nav-mail-icon"
          title="Share via email"
          href="mailto:?subject=${ settings.PROJECT.TITLE }&body=${ settings.PROJECT.DESCRIPTION }%0A%0A${settings.MAIN_DOMAIN}%2F${ subfolder }${ settings.PROJECT.SLUG }%2F${urlAdd}">
          <svg
					  width="24"
					  height="24"
					  viewBox="0 0 24 24"
					  fill="none"
					  xmlns="http://www.w3.org/2000/svg"
					>
					  <path
					    fill-rule="evenodd"
					    clip-rule="evenodd"
					    d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z"
					    fill="currentColor"
					  />
					</svg>
        </a>
      </div>
      <div class="topper-nav-social">
        <a
          id="topper-nav-facebook-icon"
          title="Share on Facebook"
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
					  width="24"
					  height="24"
					  viewBox="0 0 24 24"
					  fill="none"
					  xmlns="http://www.w3.org/2000/svg"
					>
					  <path
					    d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
					    fill="currentColor"
					  />
					</svg>
        </a>
      </div>

      <div class="topper-nav-social">
        <a target="_blank" rel="noopener noreferrer" id="twitter-icon" title="Share on Twitter" href="https://twitter.com/intent/tweet?url=${settings.MAIN_DOMAIN}%2F${ subfolder }${ settings.PROJECT.SLUG }%2F${urlAdd}&text=${ settings.PROJECT.TWITTER_TEXT }">
          <svg
					  width="24"
					  height="24"
					  viewBox="0 0 24 24"
					  fill="none"
					  xmlns="http://www.w3.org/2000/svg"
					>
					  <path
					    fill-rule="evenodd"
					    clip-rule="evenodd"
					    d="M8 3C9.10457 3 10 3.89543 10 5V8H16C17.1046 8 18 8.89543 18 10C18 11.1046 17.1046 12 16 12H10V14C10 15.6569 11.3431 17 13 17H16C17.1046 17 18 17.8954 18 19C18 20.1046 17.1046 21 16 21H13C9.13401 21 6 17.866 6 14V5C6 3.89543 6.89543 3 8 3Z"
					    fill="currentColor"
					  />
					</svg>
        </a>
      </div>
    </div>
  </nav>`

  return navHTML
}

module.exports = { getNav }