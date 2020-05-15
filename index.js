
/* Handle the data/processing for the Hearst analytics and paywall configuration */
let projectConfig = require("../../project-config.json")
let projectSettings = projectConfig.PROJECT

// Get settings off story_settings if it exists, otherwise fall back to projectConfig
let getSettings = function(){
	let settings = projectConfig
	// This needs to be set even if the "try" below fails
	settings.PROJECT['ANALYTICS_CREDIT'] = ''

	try {
    // Populate with storySettings if they exist
    let [storySettings] = require("../../src/data/story_settings.sheet.json")
    // Populate with sheet settings
    settings = {
			"PAYWALL_SETTING": storySettings.Paywall,
			"EMBEDDED": projectConfig.EMBEDDED,
			"GOOGLE_SHEETS": projectConfig.GOOGLE_SHEETS,
			"GOOGLE_DOCS": projectConfig.GOOGLE_DOCS,
			"PROJECT": {
				"SUBFOLDER": storySettings.Year,
				"SLUG": storySettings.Slug,
				"TITLE": storySettings.SEO_Title,
				"SOCIAL_TITLE": storySettings.Social_Title,
				"URL": "https://projects.sfchronicle.com",
				"IMAGE": "https://s.hdnux.com/photos/0/0/0/0/"+storySettings.Social_ImageID+"/0/1600x0.jpg",
				"DESCRIPTION": storySettings.SEO_Description,
				"TWITTER_TEXT": storySettings.Twitter_Text,
				"DATE": storySettings.Publish_Date,
				"MOD_DATE": storySettings.Mod_Date || storySettings.LastModDate_C2P,
				"AUTHORS": projectSettings.AUTHORS,
				"ANALYTICS_CREDIT": storySettings.Analytics_Credit,
				"HEARST_CATEGORY": storySettings.Category || "news",
				"MARKET_KEY": storySettings.Market_Key,
				// Surveys have slightly different naming, so catch that below for backwards compat
				"NEWSLETTER_ID": storySettings.NewsletterID || storySettings.Custom_Sailthru_ID,
				"NEWSLETTER_PROMO": storySettings.NewsletterPromo || storySettings.Custom_Signup_Text,
				"NEWSLETTER_LEGAL": storySettings.NewsletterLegal || storySettings.TOS_Text,
			}
		}

	} catch (err){
	   // It's ok, we'll use project data	    
	}

	// Check if we need a slash
  let slash = "";
  if (settings.PROJECT.SUBFOLDER){
  	slash = "/"
  }
  settings.PROJECT['OPT_SLASH'] = slash

	return settings
}


// Check to see if this should serve the app version of the project
let appCheck = function(){
	// Save current env
	const env = process.env.GATSBY_DEPLOY_ENV

	let appVersion = false
	// If env reports app, then it's app by default
	if (env === 'app'){
		appVersion = true
	}
	
	// If we can access window, check to see if we're dealing with app version
	if (typeof window !== "undefined"){
		// Any link with ?fromRichie=1 will have paywall disabled
		// Native in-app webviews will have a custom user agent, so check that too
		if (window.location.href.indexOf('fromRichie=1') > -1 || navigator.userAgent.indexOf(' Richie/') > -1) {
		    appVersion = true
		}
	}

	return appVersion
}

// Blend the HDN var with whatever is already present on the page
// Returns a string for injection into the head of the page
let blendHDN = function(meta){
	
	if (!meta.PROJECT){
		// If we don't have a properly formatted meta var coming in, this is a legacy template and needs settings pulled
		let url_add = meta.url_add || ""
		meta = getSettings()
		meta.URL_ADD = url_add
	}

	// Set vars with the new object
	const {
		PAYWALL_SETTING,
		URL_ADD,
		PROJECT: {
			AUTHORS,
			ANALYTICS_CREDIT,
			TITLE,
			HEARST_CATEGORY,
			URL,
			SUBFOLDER,
			OPT_SLASH,
			SLUG,
			ISO_PUBDATE,
		},
  } = meta
	
	// Get dates from env
	let pubdate = ISO_PUBDATE

  // Check if we need a slash
  let slash = OPT_SLASH

	// Setting up vars
	let HDN = {}
	HDN.dataLayer = {}
	HDN.dataLayer.content = {}
	HDN.dataLayer.href = {}
	HDN.dataLayer.source = {}
	HDN.dataLayer.sharing = {}
	HDN.dataLayer.presentation = {}
	HDN.dataLayer.paywall = {}

	// HDN.dataLayer object for content and href data
	HDN.dataLayer.content.title = TITLE
	HDN.dataLayer.content.subtitle = ''
	HDN.dataLayer.content.objectId = `${SUBFOLDER}${slash}${SLUG}`
	HDN.dataLayer.content.objectType = 'project'
	HDN.dataLayer.content.sectionPath = [
	  HEARST_CATEGORY,
	  'special projects',
	]
	HDN.dataLayer.content.pubDate = pubdate
	HDN.dataLayer.content.wordCount = ''
	HDN.dataLayer.content.keywords = []
	HDN.dataLayer.content.keySubjects = []
	HDN.dataLayer.content.keyPersons = []
	HDN.dataLayer.content.keyOrganizations = []
	HDN.dataLayer.content.keyConcepts = []
	HDN.dataLayer.content.keyCategories = []
	HDN.dataLayer.content.keyPlaces = []
	HDN.dataLayer.content.keyNlpPerson = []
	HDN.dataLayer.content.keyNlpLocation = []
	HDN.dataLayer.content.keyNlpOrganization = []
	HDN.dataLayer.content.keyNlpEvent = []
	HDN.dataLayer.content.keyNlpWorkOfArt = []
	HDN.dataLayer.content.keyNlpConsumerGood = []
	HDN.dataLayer.content.keyNlpOther = []
	HDN.dataLayer.content.keyNlpUnknown = []

	// HDN.dataLayer object for source information
	HDN.dataLayer.source.authorName = ''
	HDN.dataLayer.source.authorTitle = 'San Francisco Chronicle Staff'
	HDN.dataLayer.source.originalSourceSite = 'SF'
	HDN.dataLayer.source.publishingSite = 'premiumsfgate'
	HDN.dataLayer.source.sourceSite = 'sfgate'

	// HDN.dataLayer object for sharing information
	HDN.dataLayer.sharing.openGraphUrl = `${URL}/${SUBFOLDER}${slash}${SLUG}/`
	HDN.dataLayer.sharing.openGraphType = 'article'

	// More page settings
	HDN.dataLayer.href.pageUrl = `${URL}/${SUBFOLDER}${slash}${SLUG}/`
	HDN.dataLayer.href.canonicalUrl = `${URL}/${SUBFOLDER}${slash}${SLUG}/`

	// HDN.dataLayer object for presentation information
	HDN.dataLayer.presentation.hasSlideshow = ''
	HDN.dataLayer.presentation.hasSlideshowListView = ''
	HDN.dataLayer.presentation.hasVideo = ''
	HDN.dataLayer.presentation.hasInteractive = ''

	// HDN.dataLayer object for paywall information
	HDN.dataLayer.paywall.premiumStatus = 'isPremium'
	HDN.dataLayer.paywall.premiumEndDate = ''
	HDN.dataLayer.paywall.policy = PAYWALL_SETTING

	// Special site var
	HDN.dataLayer.site = {
	  domain: 'projects.sfchronicle.com',
	  domainRoot: 'sfchronicle',
	  subDomain: 'www',
	  name: 'premiumsfgate',
	  property: 'HC',
	  siteId: '35',
	  siteUrl: 'https://www.projects.sfchronicle.com/',
	  timeZone: 'Pacific',
	}


	let blendedHDN = {}
    let stringHDN = ""

	// Create author for analytics here
  let authorString = ""
  if (ANALYTICS_CREDIT !== ''){
    authorString = ANALYTICS_CREDIT
  } else if (AUTHORS){
		// If one wasn't specified, use the one in the config
		AUTHORS.forEach((author, index) => {
			// Add author to string
      authorString += author.AUTHOR_NAME
      // Add comma if we're not done
      if (index < (AUTHORS.length - 1)){
        authorString += ", "
      }
		})
  }
  // If we didn't get any author, sub in default
  if (authorString === ""){
    authorString = "San Francisco Chronicle Staff"
  }

	blendedHDN = HDN
	// Custom config for multiple pages
	blendedHDN.dataLayer.content.title = TITLE
	blendedHDN.dataLayer.sharing.openGraphUrl = `${URL}/${SUBFOLDER}${slash}${SLUG}/${URL_ADD}`
	blendedHDN.dataLayer.href.pageUrl = `${URL}/${SUBFOLDER}${slash}${SLUG}/${URL_ADD}`
	blendedHDN.dataLayer.href.canonicalUrl = `${URL}/${SUBFOLDER}${slash}${SLUG}/${URL_ADD}`
	blendedHDN.dataLayer.source.authorName = authorString

	let appVer = appCheck()
	if (appVer){
		blendedHDN.dataLayer.paywall.mode = "edbDisabled"
	}

	stringHDN = `
		var HDN = HDN || {};
		HDN.dataLayer = HDN.dataLayer || {};
		HDN.dataLayer.content = Object.assign(HDN.dataLayer.content || {}, ${JSON.stringify(blendedHDN.dataLayer.content)});
		HDN.dataLayer.source = Object.assign(HDN.dataLayer.source || {}, ${JSON.stringify(blendedHDN.dataLayer.source)});
		HDN.dataLayer.sharing = Object.assign(HDN.dataLayer.sharing || {}, ${JSON.stringify(blendedHDN.dataLayer.sharing)});
		HDN.dataLayer.href = Object.assign(HDN.dataLayer.href || {}, ${JSON.stringify(blendedHDN.dataLayer.href)});
		HDN.dataLayer.paywall = Object.assign(HDN.dataLayer.paywall || {}, ${JSON.stringify(blendedHDN.dataLayer.paywall)});
		HDN.dataLayer.site = Object.assign(HDN.dataLayer.site || {}, ${JSON.stringify(blendedHDN.dataLayer.site)});
	`

	return {
		stringHDN: stringHDN
	}
}

module.exports = { appCheck, blendHDN, getSettings }
