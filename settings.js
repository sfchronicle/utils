
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
let projectSettings = projectConfig.PROJECT

// Get settings off story_settings if it exists, otherwise fall back to projectConfig
let getSettings = function(){
	let settings = projectConfig
	// This needs to be set even if the "try" below fails
	settings.PROJECT['ANALYTICS_CREDIT'] = ''
	// Populate with storySettings if they exist
	let storySettings
	try {

    try {
    	// Check for classic story_settings sheet
    	[storySettings] = require("../../src/data/story_settings.sheet.json")
    } catch(err){
			try {
				// May be an Archie doc, try grabbing from there
				storySettings = require("../../data/project_data.json").story_settings
			} catch(err) {
				// hacking this to bypass??
				// Evan: This hack has my approval
			}
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
				"SOCIAL_TITLE": storySettings.Social_Title,
				"URL": "https://projects.sfchronicle.com",
				"IMAGE": "https://s.hdnux.com/photos/0/0/0/0/"+storySettings.Social_ImageID+"/0/1600x0.jpg",
				"DESCRIPTION": storySettings.SEO_Description,
				"TWITTER_TEXT": storySettings.Twitter_Text,
				"DATE": storySettings.Publish_Date,
				"MOD_DATE": storySettings.Mod_Date || storySettings.LastModDate_C2P,
				"AUTHORS": projectSettings.AUTHORS,
				"ANALYTICS_CREDIT": storySettings.Analytics_Credit,
				"HEARST_CATEGORY": storySettings.Category || storySettings.Analytics_Section || "Bay Area",
				"KEY_SUBJECTS": storySettings.Key_Subjects || "",
				"MARKET_KEY": storySettings.Market_Key,
				// Surveys have slightly different naming, so catch that below for backwards compat
				"NEWSLETTER_ID": storySettings.NewsletterID || storySettings.Custom_Sailthru_ID || projectSettings.NEWSLETTER_ID,
				"NEWSLETTER_PROMO": storySettings.NewsletterPromo || storySettings.Custom_Signup_Text || projectSettings.NEWSLETTER_PROMO,
				"NEWSLETTER_LEGAL": storySettings.NewsletterLegal || storySettings.TOS_Text || projectSettings.NEWSLETTER_LEGAL,
				"RELATED_LINKS_HED": storySettings.Related_Links_Hed,
				"CANONICAL_URL": storySettings.Canonical_URL

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
