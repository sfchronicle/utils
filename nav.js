let { getBrands } = require("./brands");

// Handle nav for various markets and include nav options for other links
let getNav = function (
  meta,
  urlAdd,
  forceColor,
  navLink,
  navArray,
  subInstead
) {
  // If we aren't passing meta in, we have to call getSettings here
  if (!meta) {
    let { getSettings } = require("./settings");
    meta = getSettings();
  }

  // If a link object was not provided, make one
  if (!navLink) {
    navLink = "";
  }

  // If a navArray was provided, create the subnav
  let subnav = "";
  let dropdownIcon = "";
  if (navArray && navArray.length > 0) {
    subnav = `<ul id="subnav">`;
    for (let i = 0; i < navArray.length; i++) {
      subnav += `<li><a class="active" href="${navArray[i].url}" target="${navArray[i].target}"><span class="arrow-bullet">▶</span> ${navArray[i].text}</a></li>`;
    }
    subnav += `</ul>`;
    // Add a dropdown icon
    dropdownIcon = `<div class="dropdown-icon">▾</div>`;
  }

  // Extension to URL if passed in
  if (!urlAdd) {
    urlAdd = "";
  }

  let {
    attributes: { marketPrefix, invert, subscribeLink },
  } = getBrands(meta.PROJECT.MARKET_KEY);
  // Handle various CT domains
  if (typeof window !== "undefined") {
    switch (window.location.origin) {
      case "https://www.ctpost.com":
        marketPrefix = "ct";
        break;
      case "https://www.nhregister.com":
        marketPrefix = "nh";
        break;
      case "https://www.greenwichtime.com":
        marketPrefix = "gt";
        break;
      case "https://www.stamfordadvocate.com":
        marketPrefix = "st";
        break;
      case "https://www.thehour.com":
        marketPrefix = "th";
        break;
      case "https://www.newstimes.com":
        marketPrefix = "nt";
        break;
      case "https://www.middletownpress.com":
        marketPrefix = "mp";
        break;
      case "https://www.ctinsider.com":
        marketPrefix = "in";
        break;

      case "https://www.beaumontenterprise.com":
        marketPrefix = "texcom/beau";
        break;
      case "https://www.lmtonline.com":
        marketPrefix = "texcom/laredo";
        break;
      case "https://www.mrt.com":
        marketPrefix = "texcom/mrt";
        break;
      case "https://www.myplainview.com":
        marketPrefix = "texcom/plain";
        break;

      case "https://www.bigrapidsnews.com":
        marketPrefix = "midcom/big";
        break;
      case "https://www.manisteenews.com":
        marketPrefix = "midcom/mani";
        break;
      case "https://www.ourmidland.com":
        marketPrefix = "midcom/mid";
        break;
      case "https://www.michigansthumb.com":
        marketPrefix = "midcom/huron";
        break;
      case "https://www.recordpatriot.com":
        marketPrefix = "midcom/benzie";
        break;
      case "https://www.theheraldreview.com":
        marketPrefix = "midcom/hr";
        break;
      case "https://www.lakecountystar.com":
        marketPrefix = "midcom/lc";
        break;
      case "https://www.thetelegraph.com":
        marketPrefix = "midcom/alton";
        break;
      case "https://www.theintelligencer.com":
        marketPrefix = "midcom/ed";
        break;
      case "https://www.myjournalcourier.com":
        marketPrefix = "midcom/jv";
        break;
    }
  }

  // Default is white text on black nav (SFC style)
  let invertClass = "";
  let color = "white";
  // If inverted, do black on white nav
  // Only change things if color isn't forced to white
  if (invert || forceColor === "white") {
    invertClass = "invert";
    color = "black";
  }

  let subfolder = "";
  if (meta.PROJECT.SUBFOLDER) {
    subfolder = meta.PROJECT.SUBFOLDER + "/";
  }

  let rightBlock = `
		<div class="topper-nav-social">
      <a
        id="topper-nav-mail-icon"
        title="Share via email"
        href="mailto:?subject=${meta.PROJECT.TITLE}&body=${meta.PROJECT.DESCRIPTION}%0A%0A${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}">
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
        href="https://www.facebook.com/sharer/sharer.php?u=${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}"
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
      <a target="_blank" rel="noopener noreferrer" id="twitter-icon" title="Share on Twitter" href="https://twitter.com/intent/tweet?url=${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}&text=${meta.PROJECT.TWITTER_TEXT}">
		<svg
			width="24"
			height="24"
			viewBox="0 0 248 204"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
		<path
			data-name="Twitter Logo"
			fill="currentColor"
			d="M222 51.29c.15 2.16.15 4.34.15 6.52 0 66.74-50.8 143.69-143.69 143.69A142.91 142.91 0 0 1 1 178.82a102.72 102.72 0 0 0 12 .72 101.29 101.29 0 0 0 62.72-21.66 50.53 50.53 0 0 1-47.18-35.07 50.35 50.35 0 0 0 22.8-.86 50.53 50.53 0 0 1-40.52-49.5v-.64a50.25 50.25 0 0 0 22.92 6.32 50.55 50.55 0 0 1-15.6-67.42 143.38 143.38 0 0 0 104.08 52.77 50.55 50.55 0 0 1 86.06-46.06 101.19 101.19 0 0 0 32.06-12.26 50.66 50.66 0 0 1-22.2 27.93 100.89 100.89 0 0 0 29-7.94A102.84 102.84 0 0 1 222 51.29z"
		/>
		</svg>
      </a>
    </div>
  `;

  if (subInstead) {
    rightBlock = `
  		<a class="sub-box" href="${subscribeLink}" target="_blank">
  			<div>Subscribe</div>
  		</a>
  	`;
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
        id="nav-title"
        href="${navLink.url}"
        target="${navLink.target || "_blank"}"
      >
        ${navLink.text}${dropdownIcon}
      </a>
    </div>
    <div class="topper-nav-right">
      ${rightBlock}
    </div>
    ${subnav}
  </nav>`;

  return navHTML;
};

module.exports = { getNav };
