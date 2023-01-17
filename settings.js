
/* Handle the data/processing for the Hearst analytics and paywall configuration */
let projectConfig;
try {
	projectConfig = require("../../project-config.json")
} catch (err){
	try {
		projectConfig = require("../../project.json")
	} catch(err){
		// It's ok
	}
}

// Get settings off story_settings if it exists, otherwise fall back to projectConfig
let getSettings = function(){
	if (!projectConfig) {
		let settings = {PROJECT : {DATE: "September 20, 2022 9:00 AM", MOD_DATE: "September 21, 2022 9:00 AM"}}
		return (
			settings
		)
	}
	let projectSettings = projectConfig.PROJECT
	let settings = projectConfig
	// This needs to be set even if the "try" below fails
	settings.PROJECT['ANALYTICS_CREDIT'] = ''
	// Populate with storySettings if they exist
	let storySettings
	let fullAuthors = []
	try {
    try {
    	// Check for classic story_settings sheet
    	[storySettings] = require("../../src/data/story_settings.sheet.json")
			// If we got story_settings, try structuring the AUTHORS object
			let authorNames = []
			let authorLinks = []
			try {
				if (storySettings.Byline) {
					authorNames = storySettings.Byline.split(',')
				}
				if (storySettings.Byline_Link) {
					authorLinks = storySettings.Byline_Link.split(',')
				}
				for (let i in authorNames){
					fullAuthors.push({
						AUTHOR_NAME: authorNames[i],
						AUTHOR_PAGE: authorLinks[i] || ""
					})
				}
			} catch(err){
				// It's ok, we'll fall back
			}
    } catch(err){
			try {
				// May be an Archie doc, try grabbing from there
				storySettings = require("../../data/project_data.json").story_settings
			} catch(err) {
				// hacking this to bypass??
				// Evan: This hack has my approval
			}
    }
		// Empty array is triggering truthy test, so let's nullify
		if (fullAuthors.length === 0){
			fullAuthors = null
		}
    // Populate with sheet settings
    settings = {
			"PAYWALL_SETTING": storySettings.Paywall,
			"EMBEDDED": projectConfig.EMBEDDED,
			"GOOGLE_SHEETS": projectConfig.GOOGLE_SHEETS,
			"GOOGLE_DOCS": projectConfig.GOOGLE_DOCS,
			"MAIN_DOMAIN": projectConfig.MAIN_DOMAIN,
			"PROJECT": {
				"SUBFOLDER": storySettings.Year,
				"SLUG": storySettings.Slug,
				"TITLE": storySettings.SEO_Title,
				"DISPLAY_TITLE": storySettings.Title,
				"SOCIAL_TITLE": storySettings.Social_Title,
				"DECK": storySettings.Deck,
				"URL": "https://projects.sfchronicle.com",
				"IMAGE": "https://s.hdnux.com/photos/0/0/0/0/"+storySettings.Social_ImageID+"/1/rawImage.jpg",
				"DESCRIPTION": storySettings.SEO_Description,
				"TWITTER_TEXT": storySettings.Twitter_Text,
				"DATE": storySettings.Publish_Date,
				"MOD_DATE": storySettings.Mod_Date || storySettings.LastModDate_C2P,
				"AUTHORS": fullAuthors || projectSettings.AUTHORS,
				"ANALYTICS_CREDIT": storySettings.Analytics_Credit,
				"HEARST_CATEGORY": storySettings.Category || storySettings.Analytics_Section || "News",
				"KEY_SUBJECTS": storySettings.Key_Subjects || "",
				"MARKET_KEY": storySettings.Market_Key,
				// Surveys have slightly different naming, so catch that below for backwards compat
				"NEWSLETTER_ID": storySettings.NewsletterID || storySettings.Custom_Sailthru_ID || projectSettings.NEWSLETTER_ID,
				"NEWSLETTER_PROMO": storySettings.NewsletterPromo || storySettings.Custom_Signup_Text || projectSettings.NEWSLETTER_PROMO,
				"NEWSLETTER_LEGAL": storySettings.NewsletterLegal || storySettings.TOS_Text || projectSettings.NEWSLETTER_LEGAL,
				"RELATED_LINKS_HED": storySettings.Related_Links_Hed
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
	// Set the canonical (either from the sheet override or constructed)
	settings.PROJECT['CANONICAL_URL'] = projectConfig.MAIN_DOMAIN + "/" + settings.PROJECT.SUBFOLDER + slash + settings.PROJECT.SLUG
	if (typeof storySettings !== "undefined" && storySettings.Canonical_URL){
		settings.PROJECT['CANONICAL_URL'] = storySettings.Canonical_URL
	}
	return settings
}

module.exports = { getSettings }
