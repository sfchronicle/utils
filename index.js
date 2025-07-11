const { appCheck } = require("./appcheck.js");

// Blend the HDN var with whatever is already present on the page
// Returns a string for injection into the head of the page
let blendHDN = function (meta) {
  if (!meta.PROJECT) {
    // If we don't have a properly formatted meta var coming in, this is a legacy template and needs settings pulled
    let url_add = meta.url_add || "";
    meta = getSettings();
    meta.URL_ADD = url_add;
  }
  let sailthru = "";
  if (meta.SAIL_CUST) {
    sailthru = meta.SAIL_CUST;
  }

  // Set vars with the new object
  let {
    PAYWALL_SETTING,
    URL_ADD,
    MAIN_DOMAIN,
    PROJECT: {
      AUTHORS,
      ANALYTICS_CREDIT,
      TITLE,
      HEARST_CATEGORY,
      KEY_SUBJECTS,
      SUBFOLDER,
      OPT_SLASH,
      SLUG,
      MARKET_KEY,
      ISO_PUBDATE,
      ISO_MODDATE,
      CANONICAL_URL,
    },
  } = meta;
  BASE_DOMAIN = MAIN_DOMAIN;
  if (MARKET_KEY === "CT") {
    BASE_DOMAIN = "ctinsider.com";
  }
  const siteDomain = MAIN_DOMAIN;
  // Check if we need a slash
  let slash = OPT_SLASH;

  // Add the canonical here unless it's sent in
  if (!CANONICAL_URL) {
    CANONICAL_URL = `${BASE_DOMAIN}/${SUBFOLDER}${slash}${SLUG}`;
  }

  // If canonical has a slash at the end, remove it
  if (CANONICAL_URL.slice(-1) === "/") {
    CANONICAL_URL = CANONICAL_URL.slice(0, -1);
  }

  // Add the url add here unless it's sent in
  if (!URL_ADD) {
    URL_ADD = "";
  }

  // If url add does not end with a /, add it
  if (URL_ADD && URL_ADD.slice(-1) !== "/") {
    URL_ADD += "/";
  }

  // Get dates from env
  let pubdate = "";
  let pubTime = "";
  if (ISO_PUBDATE) {
    pubdate = ISO_PUBDATE.toString().split("T")[0] + " 00:00:00";
    const pubdateTime = pubdate + "T" + "00:00:00";
    pubTime = new Date(pubdateTime).getTime();
  } else {
    // If we don't have a pubdate, use today
    pubdate = new Date().toISOString().split("T")[0] + " 00:00:00";
    pubTime = new Date().getTime();
  }
  let moddate = "";
  let modTime = "";
  if (ISO_MODDATE) {
    moddate = ISO_MODDATE.toString().split("T")[0] + " 00:00:00";
    const moddateTime = moddate + "T" + "00:00:00";
    modTime = new Date(moddateTime).getTime();
  }

  // Setting up vars
  let HDN = {};
  HDN.dataLayer = {};
  HDN.dataLayer.content = {};
  HDN.dataLayer.href = {};
  HDN.dataLayer.source = {};
  HDN.dataLayer.sharing = {};
  HDN.dataLayer.presentation = {};
  HDN.dataLayer.paywall = {};

  // HDN.dataLayer object for content and href data
  HDN.dataLayer.content.title = meta.DISPLAY_TITLE || TITLE;
  HDN.dataLayer.content.subtitle = meta.PROJECT.DECK || "";
  HDN.dataLayer.content.objectId = `${SUBFOLDER}${slash}${SLUG}/${URL_ADD}`;
  HDN.dataLayer.content.objectType = "project";

  // Check if we have more than one HEARST_CATEGORY, split on commas
  var categories = HEARST_CATEGORY.split(",").map((item) => item.trim());
  HDN.dataLayer.content.sectionPath = categories;

  var key_subjects = KEY_SUBJECTS
    ? KEY_SUBJECTS.split(",").map((item) => item.trim())
    : [];
  HDN.dataLayer.content.keySubjects = key_subjects;
  HDN.dataLayer.content.pubDate = pubdate;
  HDN.dataLayer.content.pubDateTimestamp = pubTime;
  HDN.dataLayer.content.lastModifiedDate = moddate;
  HDN.dataLayer.content.lastModifiedDateTimestamp = modTime;
  HDN.dataLayer.content.wordCount = "";
  HDN.dataLayer.content.keywords = key_subjects;
  HDN.dataLayer.content.keyPersons = [];
  HDN.dataLayer.content.keyOrganizations = [];
  HDN.dataLayer.content.keyConcepts = [];
  HDN.dataLayer.content.keyCategories = [];
  HDN.dataLayer.content.keyPlaces = [];
  HDN.dataLayer.content.keyNlpPerson = [];
  HDN.dataLayer.content.keyNlpLocation = [];
  HDN.dataLayer.content.keyNlpOrganization = [];
  HDN.dataLayer.content.keyNlpEvent = [];
  HDN.dataLayer.content.keyNlpWorkOfArt = [];
  HDN.dataLayer.content.keyNlpConsumerGood = [];
  HDN.dataLayer.content.keyNlpOther = [];
  HDN.dataLayer.content.keyNlpUnknown = [];
  HDN.dataLayer.content.hasChatBot = meta.HAS_CHAT_BOT || false;

  // Signal to Blueconic that we are ready for gift button
  HDN.dataLayer.content.giftEnabled = meta.GIFT_ENABLED;

  // HDN.dataLayer object for source information
  HDN.dataLayer.source.authorName = ""; // Set below
  HDN.dataLayer.source.authorTitle = "";
  HDN.dataLayer.source.originalSourceSite = "";
  HDN.dataLayer.source.publishingSite = "";
  HDN.dataLayer.source.sourceSite = "";
  switch (MARKET_KEY) {
    case "SFC":
      HDN.dataLayer.source.authorTitle = "San Francisco Chronicle Staff";
      HDN.dataLayer.source.originalSourceSite = "SF";
      HDN.dataLayer.source.publishingSite = "premiumsfgate";
      HDN.dataLayer.source.sourceSite = "sfgate";
      break;
    case "Houston":
      HDN.dataLayer.source.authorTitle = "Houston Chronicle Staff";
      HDN.dataLayer.source.originalSourceSite = "HC";
      break;
    case "SanAntonio":
      HDN.dataLayer.source.authorTitle = "Express News Staff";
      HDN.dataLayer.source.originalSourceSite = "EN";
      break;
    case "Albany":
      HDN.dataLayer.source.authorTitle = "Times Union Staff";
      HDN.dataLayer.source.originalSourceSite = "TU";
      break;
    case "CT":
      HDN.dataLayer.source.authorTitle = "Connecticut Digital Staff";
      HDN.dataLayer.source.originalSourceSite = "CT";
      break;
  }

  // HDN.dataLayer object for sharing information
  HDN.dataLayer.sharing.openGraphUrl = `${siteDomain}/${SUBFOLDER}${slash}${SLUG}/${URL_ADD}`;
  HDN.dataLayer.sharing.openGraphType = "article";

  // More page settings
  HDN.dataLayer.href.pageUrl = `${siteDomain}/${SUBFOLDER}${slash}${SLUG}/${URL_ADD}`;
  HDN.dataLayer.href.canonicalUrl = `${CANONICAL_URL}/${URL_ADD}`;

  // HDN.dataLayer object for presentation information
  HDN.dataLayer.presentation.hasSlideshow = "";
  HDN.dataLayer.presentation.hasSlideshowListView = "";
  HDN.dataLayer.presentation.hasVideo = "";
  HDN.dataLayer.presentation.hasInteractive = "";

  // HDN.dataLayer object for paywall information
  HDN.dataLayer.paywall.premiumStatus = "isPremium";
  HDN.dataLayer.paywall.premiumEndDate = "";
  HDN.dataLayer.paywall.policy = PAYWALL_SETTING;

  // Special site var
  HDN.dataLayer.site = {
    domain: siteDomain.replace("https://www.", ""),
    domainRoot: siteDomain.replace("https://www.", "").replace(".com", ""),
    subDomain: "www",
    name: HDN.dataLayer.source.publishingSite,
    property: HDN.dataLayer.source.originalSourceSite,
    siteId: "35",
    siteUrl: siteDomain,
    timeZone: "Pacific",
    sailthruId: sailthru,
    platform: "devhub",
  };

  // Create author for analytics here
  let authorString = "";
  if (ANALYTICS_CREDIT !== "") {
    authorString = ANALYTICS_CREDIT;
  } else if (AUTHORS) {
    // If one wasn't specified, use the one in the config
    AUTHORS.forEach((author, index) => {
      // Add author to string
      authorString += author.AUTHOR_NAME;
      // Add comma if we're not done
      if (index < AUTHORS.length - 1) {
        authorString += ", ";
      }
    });
  }
  // If we didn't get any author, sub in default
  if (authorString === "") {
    authorString = HDN.dataLayer.source.authorTitle;
  }
  HDN.dataLayer.source.authorName = authorString;

  let appVer = appCheck();
  if (appVer) {
    HDN.dataLayer.paywall.mode = "edbDisabled";
  }

  let stringHDN = `
		var HDN = HDN || {};
		HDN.dataLayer = HDN.dataLayer || {};
		HDN.dataLayer.content = Object.assign(HDN.dataLayer.content || {}, ${JSON.stringify(
      HDN.dataLayer.content
    )});
		HDN.dataLayer.source = Object.assign(HDN.dataLayer.source || {}, ${JSON.stringify(
      HDN.dataLayer.source
    )});
		HDN.dataLayer.sharing = Object.assign(HDN.dataLayer.sharing || {}, ${JSON.stringify(
      HDN.dataLayer.sharing
    )});
		HDN.dataLayer.href = Object.assign(HDN.dataLayer.href || {}, ${JSON.stringify(
      HDN.dataLayer.href
    )});
		HDN.dataLayer.paywall = Object.assign(HDN.dataLayer.paywall || {}, ${JSON.stringify(
      HDN.dataLayer.paywall
    )});
		HDN.dataLayer.site = Object.assign(HDN.dataLayer.site || {}, ${JSON.stringify(
      HDN.dataLayer.site
    )});
	`;

  return {
    stringHDN: stringHDN,
  };
};

// Grab neighbor files
let { getBrands } = require("./brands");
let { getBrands2 } = require("./brands2");
let { getBrands3 } = require("./brands3");
let { getSettings } = require("./settings");
let { getNav } = require("./nav");
let { getNav2 } = require("./nav2");
let { getSpecialNav } = require("./specialnav");
let { getFooter } = require("./footer");
let { getTopper } = require("./topper");
let { getBlueconic } = require("./blueconic");
let { pollForAccount } = require("./accountswap");

module.exports = {
  appCheck,
  blendHDN,
  getSettings,
  getBrands,
  getBrands2,
  getBrands3,
  getNav,
  getNav2,
  getSpecialNav,
  getFooter,
  getTopper,
  getBlueconic,
  pollForAccount,
};
