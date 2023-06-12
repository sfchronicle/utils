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
		// Also hdnEmployeeAccess is the new free param
		// Native in-app webviews will have a custom user agent, so check that too
		if (
			window.location.href.indexOf('fromRichie=1') > -1 ||
			window.location.href.indexOf('hdnEmployeeAccess=true') > -1 ||
			navigator.userAgent.indexOf(' Richie/') > -1) {
		    appVersion = true
		}
	}

	return appVersion
}

module.exports = { appCheck }