
/* Handle the data/processing for the Hearst analytics and paywall configuration */

let projectConfig = require("../../project-config.json")
let projectSettings = projectConfig.PROJECT

// Get settings off story_settings if it exists, otherwise fall back to projectConfig
let getSettings = function(){
	let storySettings
	let settings = {}
	try {
	    // Populate with storySettings if they exist
	    storySettings = require("../../src/data/story_settings.sheet.json")
	    storySettings = storySettings[0] // Only need first row
	    // Populate with sheet settings
	    settings.title = storySettings.SEO_Title
	    settings.description = storySettings.SEO_Description
	    settings.social_imageid = storySettings.Social_ImageID
	    settings.social_title = storySettings.Social_Title
	    settings.subfolder = storySettings.Year
	    settings.slug = storySettings.Slug
	    settings.date = storySettings.Publish_Date
	    settings.mod_date = storySettings.Mod_Date || storySettings.LastModDate_C2P
	    settings.paywall = storySettings.Paywall
	    settings.analytics_author = storySettings.Analytics_Credit
	} catch (err){
	    // If there are no story settings, populate with project data
	    settings.title = projectSettings.TITLE
	    settings.description = projectSettings.DESCRIPTION
	    settings.social_imageid = projectSettings.IMAGE
	    settings.social_title = projectSettings.SOCIAL_TITLE
	    settings.subfolder = projectSettings.SUBFOLDER
	    settings.slug = projectSettings.SLUG
	    settings.date = projectSettings.DATE
	    settings.mod_date = projectSettings.MOD_DATE
	    settings.paywall = projectConfig.PAYWALL_SETTING
	    settings.analytics_author = ""
	}

	// These only show up in the config or are general settings
	settings.category = "news"
	settings.URL = "https://projects.sfchronicle.com"
	settings.author_array = projectSettings.AUTHORS
	settings.embed = projectConfig.EMBEDDED

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
let blendHDN = function(props){
	// Get settings for project
	const settings = getSettings()

	// Convert date to computer-readable time
	const { DateTime } = require('luxon')
	const dt = DateTime.fromFormat(settings.date, "MMMM d, y h:mm a")
    const computerPubDate = dt.toISO()

    // Check if we need a slash
    let slash = "";
    if (settings.subfolder){
    	slash = "/"
    }

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
	HDN.dataLayer.content.title = settings.title
	HDN.dataLayer.content.subtitle = ''
	HDN.dataLayer.content.objectId = `${settings.subfolder}/${settings.slug}`
	HDN.dataLayer.content.objectType = 'project'
	HDN.dataLayer.content.sectionPath = [
	  `${settings.category}`,
	  'special projects',
	]
	HDN.dataLayer.content.pubDate = computerPubDate
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
	HDN.dataLayer.sharing.openGraphUrl = `${settings.URL}${slash}${settings.subfolder}/${settings.slug}/`
	HDN.dataLayer.sharing.openGraphType = 'article'

	// More page settings
	HDN.dataLayer.href.pageUrl = `${settings.URL}${slash}${settings.subfolder}/${settings.slug}/`
	HDN.dataLayer.href.canonicalUrl = `${settings.URL}${slash}${settings.subfolder}/${settings.slug}/`

	// HDN.dataLayer object for presentation information
	HDN.dataLayer.presentation.hasSlideshow = ''
	HDN.dataLayer.presentation.hasSlideshowListView = ''
	HDN.dataLayer.presentation.hasVideo = ''
	HDN.dataLayer.presentation.hasInteractive = ''

	// HDN.dataLayer object for paywall information
	HDN.dataLayer.paywall.premiumStatus = 'isPremium'
	HDN.dataLayer.paywall.premiumEndDate = ''
	HDN.dataLayer.paywall.policy = settings.paywall

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
    if (props.analytics_author){
      authorString = props.analytics_author
    } else if (projectConfig.PROJECT.AUTHORS){
      // If one wasn't specified, use the one in the config
      for (var i = 0; i < projectConfig.PROJECT.AUTHORS.length; i++){
        // Add author to string
        authorString += projectConfig.PROJECT.AUTHORS[i].AUTHOR_NAME
        // Add comma if we're not done
        if (i < projectConfig.PROJECT.AUTHORS.length-1){
          authorString += ", "
        }
      }
    }
    // If we didn't get any author, sub in default
    if (authorString === ""){
      authorString = "San Francisco Chronicle Staff"
    }

	blendedHDN = HDN
	// Custom config for multiple pages
	blendedHDN.dataLayer.content.title = props.title
	blendedHDN.dataLayer.sharing.openGraphUrl = props.url + props.url_add
	blendedHDN.dataLayer.href.pageUrl = props.url + props.url_add
	blendedHDN.dataLayer.href.canonicalUrl = props.url + props.url_add
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

export { appCheck, blendHDN, getSettings }