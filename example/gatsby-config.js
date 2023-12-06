// Add SFC utils
const { getBrands3 } = require('../index')
const { getSettings } = require('./tempsettings')
const { DateTime } = require('luxon');

let settings = getSettings()

let marketKeyArray = [
  {"markets": ["SFC"], "zone": "America/Los_Angeles"},
  {"markets": ["Houston","SanAntonio","Texcom"], "zone": "America/Chicago"},
  {"markets": ["Albany","CT","Midcom"], "zone": "America/New_York"},
]

let currentZone
// Find the current market in the array
for (let region in marketKeyArray){
  let thisRegion = marketKeyArray[region]
  if (thisRegion.markets.includes(settings.PROJECT.MARKET_KEY)){
    currentZone = thisRegion.zone
  }
}
// If we don't have a match, that means we have an invalid market key
if (!currentZone){
  console.error("Invalid or undefined MARKET_KEY! See the _key_explainer in project-config to see valid values.")
  process.exit(1)
}

// Create computer pub and mod dates
const dt = DateTime.fromFormat(
  settings.PROJECT.DATE,
  'MMMM d, y h:mm a',
  {zone: currentZone}
)
// Convert date to computer-readable time
const computerPubDate = dt.toISO()
settings.PROJECT.ISO_PUBDATE = computerPubDate

// If MOD_DATE does not exist, set var to pubdate
let computerModDate = ""
if (typeof settings.PROJECT.MOD_DATE !== 'undefined' && settings.PROJECT.MOD_DATE) {
  const dt2 = DateTime.fromFormat(
    settings.PROJECT.MOD_DATE,
    'MMMM d, y h:mm a',
    {zone: currentZone}
  )
    computerModDate = dt2.toISO()
} else {
  // Fallback to creation date
  computerModDate = computerPubDate
}
settings.PROJECT.ISO_MODDATE = computerModDate

//Set get the current env var
const currentEnv = process.env.GATSBY_DEPLOY_ENV
console.log('Current environment: ' + currentEnv)

// Handle test prefix
// TODO: Once we embrace the new URL, we can delete this check and hardcode /projects
let projectsPrefix = ""
if (settings.PROJECT.SUBFOLDER.toString().indexOf("projects/") === 0){
  projectsPrefix = "/projects"
}
// Set the path prefix for the given deploy (ignored for dev)
let pathPrefix = '/projects/test-proj/' + settings.PROJECT.SLUG
if (currentEnv === 'development') {
  pathPrefix = '/'
}
if (currentEnv === 'app') {
  pathPrefix = projectsPrefix + '/app/' + settings.PROJECT.SLUG
}
if (currentEnv === 'production') {
  pathPrefix =
    '/' +
    settings.PROJECT.SUBFOLDER +
    settings.PROJECT.OPT_SLASH +
    settings.PROJECT.SLUG
}

let plugins = [
  'gatsby-plugin-react-helmet',
  'gatsby-transformer-json',
  {
    resolve: 'gatsby-plugin-less',
    options: {
      lessOptions: {
        modifyVars: getBrands3(settings.PROJECT.MARKET_KEY).styles,
      },
    },
  },
  {
    resolve: 'gatsby-plugin-html-attributes',
    options: {
      lang: 'en',
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `projectData`,
      path: `${__dirname}/src/data/`,
    },
  },
  {
    resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
    options: {
      production: true,
      disable: !process.env.ANALYZE_BUNDLE_SIZE,
      generateStatsFile: true,
      analyzerMode: 'static',
    },
  },
  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.app/offline
  // 'gatsby-plugin-offline',
]

// Enable preact for the prod build
if (currentEnv !== "development"){
  plugins.push("gatsby-plugin-preact")
}

// TK builds get weird redirect loops with htaccess plugin, so don't use it
if (settings.PROJECT.MARKET_KEY !== "TK"){
  plugins.push("gatsby-plugin-htaccess")
}

module.exports = {
  siteMetadata: settings,
  pathPrefix: pathPrefix,
  plugins: plugins
}
