
/* A MODIFIED VERSION OF UTILS SETTINGS (BECAUSE THE PATHS ARE WRONG OTHERWISE) */
let projectConfig;
try {
	projectConfig = require("./project-config.json")
} catch (err){
  // It's ok
}
let projectSettings = projectConfig.PROJECT

// Get settings off story_settings if it exists, otherwise fall back to projectConfig
let getSettings = function(){
	let settings = projectConfig
	// This needs to be set even if the "try" below fails
	settings.PROJECT['ANALYTICS_CREDIT'] = ''

	// Check if we need a slash
  let slash = "";
  if (settings.PROJECT.SUBFOLDER){
		slash = "/"
  }
	settings.PROJECT['OPT_SLASH'] = slash
	// Set the canonical (either from the sheet override or constructed)
	settings.PROJECT['CANONICAL_URL'] = projectConfig.MAIN_DOMAIN + "/" + settings.PROJECT.SUBFOLDER + slash + settings.PROJECT.SLUG
	return settings
}

module.exports = { getSettings }
