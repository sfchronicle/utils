let { getBrands3 } = require("./brands3");

// Handle nav for various markets and include nav options for other links
let getNav2 = function (
  meta,
  urlAdd,
  forceColor,
  navLink,
  navArray,
  overrides
) {
  // If we aren't passing meta in, we have to call getSettings here
  if (!meta) {
    let { getSettings } = require("./settings");
    meta = getSettings();
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
  } = getBrands3(meta.PROJECT.MARKET_KEY);
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
  // Allow option to force white text on black nav
  if (forceColor === "black") {
    invertClass = "";
    color = "white";
  }

  let subfolder = "";
  if (meta.PROJECT.SUBFOLDER) {
    subfolder = meta.PROJECT.SUBFOLDER + "/";
  }

  // Handle overrides assignment
  let desktopIcon = `https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-${color}.png`;
  let mobileIcon = `https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-square-${color}.png`;
  let iconLink = "/";
  if (overrides) {
    if (overrides.desktopIcon) {
      desktopIcon = overrides.desktopIcon;
    }
    if (overrides.mobileIcon) {
      mobileIcon = overrides.mobileIcon;
    }
    if (overrides.subscribeLink) {
      subscribeLink = overrides.subscribeLink;
    }
    if (overrides.iconLink) {
      iconLink = overrides.iconLink;
    }
  }

  // If a link object was provided, format the insert
  let navLinkInsert = "";
  if (navLink && navLink.url !== "") {
    navLinkInsert = `
      <a
        class="nav2-title"
        id="nav2-title"
        href="${navLink.url}"
        target="${navLink.target || "_blank"}"
      >
        ${navLink.text}${dropdownIcon}
      </a>
    `;
  }

  // Using style tags just to make this easy
  let rightBlock = `
    <a id="nav2-sub-box" class="hnp-subscribe" style="font-weight: 700;" href="${subscribeLink}" target="_blank">
      <div>Subscribe</div>
    </a>
  `;

  // Add sign-in here (we can comment this out if we want to remove this)
  rightBlock =
    `
  <a id="nav2-sub-box" class="hnp-signin" style="margin: 0; font-weight: 700;" href="/realm">
    <span>Sign&nbsp;in</span>
  </a>
  <span style="font-size: 14px; padding: 2px 0 2px;">or</span>` + rightBlock;

  let navHTML = `<nav class="nav2-container ${invertClass}">
    <div class="nav2-left">
      ${navLinkInsert}
    </div>
    <div class="nav2-center">
    <a
      href="${iconLink}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
        <img
          class="nav2-desk-logo"
          alt="Logo"
          src="${desktopIcon}"
        />
        <img
          class="nav2-mobile-logo"
          alt="Logo"
          src="${mobileIcon}"
        />
      </div>
    </a>
    </div>
    <div class="nav2-right ${subscribeLink ? "" : "hide-sub"}">
      ${rightBlock}
    </div>
    ${subnav}
  </nav>`;

  return navHTML;
};

module.exports = { getNav2 };
