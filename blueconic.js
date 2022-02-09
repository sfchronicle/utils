
// Handle returning the right blueconic URL given the domain
let getBlueconic = function(domain){
  let blueconicURL = "https://cdn.blueconic.net/hearst.js" // Default, but it's not what we want
  let subdomain = ""

  // Set subdomain based on URL
  let apex = domain.replace('www.', '')
  console.log("ADDED APEX", apex)
  switch(apex){
    case "sfchronicle.com": subdomain = "q777"; break;
    case "beaumontenterprise.com": subdomain = "z680"; break;
    case "chron.com": subdomain = "u566"; break;
    case "ctinsider.com": subdomain = "z492"; break;
    case "ctpost.com": subdomain = "t810"; break;
    case "darientimes.com": subdomain = "y820"; break;
    case "expressnews.com": subdomain = "l936"; break;
    case "fairfieldcitizenonline.com": subdomain = "z590"; break;
    case "fuelfix.com": subdomain = "z929"; break;
    case "greenwichtime.com": subdomain = "y900"; break;
    case "hearstmediact.com": subdomain = "j158"; break;
    case "hearstmediatx.com": subdomain = "f857"; break;
    case "houstonchronicle.com": subdomain = "r541"; break;
    case "lmtonline.com": subdomain = "l997"; break;
    case "middletownpress.com": subdomain = "w982"; break;
    case "milfordmirror.com": subdomain = "y752"; break;
    case "mrt.com": subdomain = "x822"; break;
    case "myplainview.com": subdomain = "u652"; break;
    case "mysanantonio.com": subdomain = "d810"; break;
    case "ncadvertiser.com": subdomain = "h353"; break;
    case "newmilfordspectrum.com": subdomain = "w020"; break;
    case "newstimes.com": subdomain = "w740"; break;
    case "ourmidland.com": subdomain = "d276"; break;
    case "registercitizen.com": subdomain = "j198"; break;
    case "seattlepi.com": subdomain = "p593"; break;
    case "sfgate.com": subdomain = "u927"; break;
    case "sheltonherald.com": subdomain = "f164"; break;
    case "stamfordadvocate.com": subdomain = "h559"; break;
    case "thehour.com": subdomain = "f775"; break;
    case "theintelligencer.com": subdomain = "s232"; break;
    case "theridgefieldpress.com": subdomain = "y653"; break;
    case "timesunion.com": subdomain = "n730"; break;
    case "trumbulltimes.com": subdomain = "o398"; break;
    case "westport-news.com": subdomain = "c993"; break;
    case "wiltonbulletin.com": subdomain = "t570"; break;
    case "yourconroenews.com": subdomain = "z211"; break;
    case "nhregister.com": subdomain = "y738"; break;
  }
	
  // If we found a subdomain, swap in the new script
  if (subdomain){
    blueconicURL = `https://${subdomain}.${domain}/script.js`
  }

  console.log("ADDED URL", blueconicURL)

  return blueconicURL
}

module.exports = { getBlueconic }