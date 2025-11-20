/* Handle the data/processing for the Hearst analytics and paywall configuration */
let projectConfig;
try {
  projectConfig = require("../../project-config.json");
} catch (err) {
  try {
    projectConfig = require("../../project.json");
  } catch (err) {
    // It's ok
  }
}

// Get settings off story_settings if it exists, otherwise fall back to projectConfig
let getSettings = function () {
  if (!projectConfig) {
    let settings = {
      PROJECT: {
        DATE: "January 1, 1900 9:00 AM",
        MOD_DATE: "January 1, 1901 9:00 AM",
      },
    }; // Making this demo date SUPER wrong so we can catch it
    return settings;
  }
  let projectSettings = projectConfig.PROJECT;
  let settings = projectConfig;
  // This needs to be set even if the "try" below fails
  settings.PROJECT["ANALYTICS_CREDIT"] = "";
  settings.PROJECT["KEY_SUBJECTS"] = "";
  // Populate with storySettings if they exist
  let storySettings;
  let fullAuthors = [];
  try {
    try {
      [storySettings] = require("../../src/data/story_settings.sheet.json");
      // Uncomment line below and comment out line above if testing from example folder in utils
      // [storySettings] = require("./example/src/data/story_settings.sheet.json")

      // If we got story_settings, try structuring the AUTHORS object
      let authorNames = [];
      let authorLinks = [];
      try {
        if (storySettings.Byline) {
          authorNames = storySettings.Byline.split(",");
        }
        if (storySettings.Byline_Link) {
          authorLinks = storySettings.Byline_Link.split(",");
        }
        for (let i in authorNames) {
          fullAuthors.push({
            AUTHOR_NAME: authorNames[i],
            AUTHOR_PAGE: authorLinks[i] || "",
          });
        }
      } catch (err) {
        // It's ok, we'll fall back
      }
    } catch (err) {
      try {
        // May be an Archie doc, try grabbing from there
        storySettings = require("../../data/project_data.json").story_settings;
      } catch (err) {
        // hacking this to bypass??
        // Evan: This hack has my approval
      }
    }
    // Empty array is triggering truthy test, so let's nullify
    if (fullAuthors.length === 0) {
      fullAuthors = null;
    }

    // Default newsletter based by market
    let defaultNewsletter, defaultNewsletterPromo, defaultNewsletterLegal;
    switch (storySettings.Market_Key) {
      case "SFC":
        defaultNewsletter = "SFC_TheMustRead";
        defaultNewsletterPromo = `The Chronicle’s most popular stories and best reads of the moment.`;
        defaultNewsletterLegal = `By subscribing, you agree to our <a href="https://www.sfchronicle.com/terms_of_use/">Terms of Use</a> and acknowledge that your information will be used as described in our <a href="https://www.sfchronicle.com/privacy_policy/"> Privacy Notice</a>.`;
        break;
      case "Houston":
        defaultNewsletter = "HC_The713";
        defaultNewsletterPromo = `A morning newsletter that keeps you connected to Houston in 5 minutes or less.`;
        defaultNewsletterLegal = `By subscribing, you agree to our <a href="https://www.houstonchronicle.com/terms_of_use/">Terms of Use</a> and acknowledge that your information will be used as described in our <a href="https://www.houstonchronicle.com/privacy_policy/"> Privacy Notice</a>.`;
        break;
      case "SanAntonio":
        defaultNewsletter = "SAEN_OnOurRadar";
        defaultNewsletterPromo = `Get the mid-morning scoop on developing news in San Antonio.`;
        defaultNewsletterLegal = `By subscribing, you agree to our <a href="https://www.expressnews.com/terms_of_use/">Terms of Use</a> and acknowledge that your information will be used as described in our <a href="https://www.expressnews.com/privacy_policy/"> Privacy Notice</a>.`;
        break;
      case "Albany":
        defaultNewsletter = "ALB_SundayRead";
        defaultNewsletterPromo = `Answering the week’s biggest questions and delivering them to your inbox.`;
        defaultNewsletterLegal = `By subscribing, you agree to our <a href="https://www.timesunion.com/termsofservice/">Terms of Use</a> and acknowledge that your information will be used as described in our <a href="https://www.timesunion.com/privacypolicy/"> Privacy Notice</a>.`;
        break;
      case "CT":
        defaultNewsletter = "ct_ins_morning_briefing";
        defaultNewsletterPromo = `Stay connected to Connecticut’s stories with a daily digest of top headlines.`;
        defaultNewsletterLegal = `By subscribing, you agree to our <a href="https://www.ctinsider.com/tos/">Terms of Use</a> and acknowledge that your information will be used as described in our <a href="https://www.ctinsider.com/privacy/"> Privacy Notice</a>.`;
        break;
    }

    // Populate with sheet settings
    settings = {
      PAYWALL_SETTING: storySettings.Paywall,
      EMBEDDED: projectConfig.EMBEDDED,
      GOOGLE_SHEETS: projectConfig.GOOGLE_SHEETS,
      GOOGLE_DOCS: projectConfig.GOOGLE_DOCS,
      MAIN_DOMAIN: projectConfig.MAIN_DOMAIN,
      PROJECT: {
        SUBFOLDER: storySettings.Year,
        SLUG: storySettings.Slug,
        TITLE: storySettings.SEO_Title,
        DISPLAY_TITLE: storySettings.Title,
        SOCIAL_TITLE: storySettings.Social_Title,
        DECK: storySettings.Deck,
        URL: "https://projects.sfchronicle.com",
        IMAGE:
          "https://s.hdnux.com/photos/0/0/0/0/" +
          storySettings.Social_ImageID +
          "/1/rawImage.jpg",
        DESCRIPTION: storySettings.SEO_Description,
        TWITTER_TEXT: storySettings.Twitter_Text,
        DATE: storySettings.Publish_Date,
        MOD_DATE: storySettings.Mod_Date || storySettings.LastModDate_C2P,
        AUTHORS: fullAuthors || projectSettings.AUTHORS,
        ANALYTICS_CREDIT: storySettings.Analytics_Credit,
        HEARST_CATEGORY:
          storySettings.Category || storySettings.Analytics_Section || "News",
        KEY_SUBJECTS: storySettings.Key_Subjects || "",
        MARKET_KEY: storySettings.Market_Key,
        // Surveys have slightly different naming, so catch that below for backwards compat
        NEWSLETTER_ID:
          storySettings.NewsletterID ||
          storySettings.Custom_Sailthru_ID ||
          defaultNewsletter ||
          projectSettings.NEWSLETTER_ID,
        NEWSLETTER_PROMO:
          storySettings.NewsletterPromo ||
          storySettings.Custom_Signup_Text ||
          defaultNewsletterPromo ||
          projectSettings.NEWSLETTER_PROMO,
        NEWSLETTER_LEGAL:
          storySettings.NewsletterLegal ||
          storySettings.TOS_Text ||
          defaultNewsletterLegal ||
          projectSettings.NEWSLETTER_LEGAL,
        // Newer things
        RELATED_LINKS_HED: storySettings.Related_Links_Hed,
        SECTION:
          storySettings.Section ||
          storySettings.Category ||
          storySettings.Analytics_Section,
      },
    };
  } catch (err) {
    // It's ok, we'll use project data
  }

  // Check if we need a slash
  let slash = "";
  if (settings.PROJECT.SUBFOLDER) {
    slash = "/";
  }
  settings.PROJECT["OPT_SLASH"] = slash;
  // Set the canonical (either from the sheet override or constructed)
  settings.PROJECT["CANONICAL_URL"] =
    projectConfig.MAIN_DOMAIN +
    "/" +
    settings.PROJECT.SUBFOLDER +
    slash +
    settings.PROJECT.SLUG;
  if (typeof storySettings !== "undefined" && storySettings.Canonical_URL) {
    settings.PROJECT["CANONICAL_URL"] = storySettings.Canonical_URL;
  }
  return settings;
};

module.exports = { getSettings };
