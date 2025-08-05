let { getBrands } = require("./brands");

// Handle nav for various markets and include nav options for other links
let getFooter = function (meta, forceColor) {
  // If we aren't passing meta in, we have to call getSettings here
  if (!meta) {
    let { getSettings } = require("./settings");
    meta = getSettings();
  }

  let year = new Date().getFullYear();

  let {
    attributes: { marketPrefix, invert },
  } = getBrands(meta.PROJECT.MARKET_KEY);

  // Handle various CT domains
  let eedition = "";
  if (typeof window !== "undefined") {
    switch (window.location.origin) {
      case "https://www.ctpost.com":
        marketPrefix = "ct";
        eedition = "CT_PO";
        break;
      case "https://www.nhregister.com":
        marketPrefix = "nh";
        eedition = "CT_NHR";
        break;
      case "https://www.greenwichtime.com":
        marketPrefix = "gt";
        eedition = "CT_GT";
        break;
      case "https://www.stamfordadvocate.com":
        marketPrefix = "st";
        eedition = "CT_AD";
        break;
      case "https://www.thehour.com":
        marketPrefix = "th";
        eedition = "CT_HR";
        break;
      case "https://www.newstimes.com":
        marketPrefix = "nt";
        eedition = "CT_NT";
        break;
      case "https://www.middletownpress.com":
        marketPrefix = "mp";
        eedition = "CT_MP";
        break;
      case "https://www.ctinsider.com":
        marketPrefix = "in";
        break;

      case "https://www.beaumontenterprise.com":
        marketPrefix = "texcom/beau";
        break;
      case "https://www.lmtonline.com":
        marketPrefix = "texcom/laredo";
        break;
      case "https://www.mrt.com":
        marketPrefix = "texcom/mrt";
        break;
      case "https://www.myplainview.com":
        marketPrefix = "texcom/plain";
        break;

      case "https://www.bigrapidsnews.com":
        marketPrefix = "midcom/big";
        break;
      case "https://www.manisteenews.com":
        marketPrefix = "midcom/mani";
        break;
      case "https://www.ourmidland.com":
        marketPrefix = "midcom/mid";
        break;
      case "https://www.michigansthumb.com":
        marketPrefix = "midcom/huron";
        break;
      case "https://www.recordpatriot.com":
        marketPrefix = "midcom/benzie";
        break;
      case "https://www.theheraldreview.com":
        marketPrefix = "midcom/hr";
        break;
      case "https://www.lakecountystar.com":
        marketPrefix = "midcom/lc";
        break;
      case "https://www.thetelegraph.com":
        marketPrefix = "midcom/alton";
        break;
      case "https://www.theintelligencer.com":
        marketPrefix = "midcom/ed";
        break;
      case "https://www.myjournalcourier.com":
        marketPrefix = "midcom/jv";
        break;
    }
  }
  // If inverted, do black on white nav
  let invertClass = "";
  let color = "white";
  if (invert || forceColor === "white") {
    invertClass = "invert";
    color = "black";
  }

  const footerLinks = {
    SFC: {
      About: [
        {
          text: "Our Company",
          link: "http://www.hearst.com/newspapers/san-francisco-chronicle",
        },
        {
          text: "Terms of Use",
          link: "https://www.sfchronicle.com/terms_of_use/",
        },
        {
          text: "Privacy Notice",
          link: "https://www.sfchronicle.com/privacy_policy",
        },
        {
          text: "CA Notice at Collection",
          link: "https://www.sfchronicle.com/privacy_policy/#caprivacyrights",
        },
        {
          text: "Your CA Privacy Rights (Shine the Light)",
          link: "https://www.sfchronicle.com/privacy_policy/#shinethelight",
        },
        {
          text: "DAA Industry Opt Out",
          link: "https://www.sfchronicle.com/privacy_policy/#daaoptout",
        },
        {
          text: "Careers",
          link:
            "https://eevd.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_11007",
        },
        {
          text: "Advertising",
          link: "https://marketing.sfgate.com/advertise-with-us-today",
        },
      ],
      Newsroom: [
        {
          text: "Ethics Policy",
          link:
            "https://www.sfchronicle.com/file/759/0/7590-7528-Hearst_Newspaper_Group_Standards_and_Ethics_Policy.pdf",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Endorsement Process",
          link:
            "https://www.sfchronicle.com/opinion/article/How-The-Chronicle-s-endorsement-process-works-14499467.php",
        },
        { text: "News Tips", link: "https://newstips.sfchronicle.com/" },
        {
          text: "Newsroom News",
          link: "https://www.sfchronicle.com/about/newsroomnews/",
        },
      ],
      Contact: [
        {
          text: "Customer Service",
          link: "https://www.sfchronicle.com/customer_service",
        },
        { text: "FAQ", link: "https://www.sfchronicle.com/faq" },
        {
          text: "Newsroom Contacts",
          link: "https://www.sfchronicle.com/newsroom_contacts",
        },
      ],
      // "CCPA": [
      // 	{text:"Do Not Sell My Personal Information",link:"https://www.sfchronicle.com/mydata/"}
      // ],
      Services: [
        {
          text: "Subscriber Services",
          link: "https://subscription.sfchronicle.com/",
        },
        { text: "e-Edition", link: "https://www.sfchronicle.com/e-edition" },
        {
          text: "Reprints & Permissions",
          link: "https://www.parsintl.com/publication/sfchronicle/",
        },
        {
          text: "Corporate Subscriptions",
          link: "https://www.sfchronicle.com/corporatesubscriptions/",
        },
        { text: "App", link: "https://www.sfchronicle.com/mobile-apps/" },
        {
          text: "Archives",
          link: "https://www.sfchronicle.com/archive/search/subscriber/",
        },
        { text: "Membership", link: "https://www.sfchronicle.com/membership" },
        {
          text: "Place an Obituary",
          link: "https://ezads.sfchron.com/sf-adportal/obits/",
        },
        {
          text: "Store",
          link:
            "https://sfchronicle.myshopify.com/?_ga=2.258575178.196771473.1682963726-25953531.1665430234",
        },
        {
          text: "Subscription Offers",
          link:
            "https://subscription.sfchronicle.com/checkout/1223/2586?siteID=SFC&origin=footer",
        },
        { text: "sfgate.com", link: "https://www.sfgate.com/" },
      ],
    },
    Houston: {
      About: [
        {
          text: "Our Company",
          link: "https://www.hearst.com/newspapers/houston-chronicle",
        },
        {
          text: "Newspaper Delivery Safety Procedures",
          link:
            "https://www.houstonchronicle.com/customer_service/article/How-Hearst-Newspapers-is-delivering-information-15151944.php",
        },
        {
          text: "Privacy Notice",
          link: "https://www.houstonchronicle.com/privacy_policy",
        },
        {
          text: "Your California Privacy Rights",
          link:
            "https://www.houstonchronicle.com/privacy_policy/#caprivacyrights",
        },
        {
          text: "Interest Based Ads",
          link:
            "https://www.houstonchronicle.com/privacy_policy/#interestbasedads",
        },
        {
          text: "Terms of Use",
          link: "https://www.houstonchronicle.com/terms_of_use/",
        },
        {
          text: "Advertising",
          link: "http://marketing.chron.com/",
        },
        {
          text: "Careers",
          link: "http://www.chron.com/careers/",
        },
      ],
      Contact: [
        {
          text: "Subscribe",
          link:
            "https://offers.houstonchronicle.com/?origin=footer&variant=wcm.88837",
        },
        {
          text: "e-Edition",
          link: "https://subscription.houstonchronicle.com/eedition",
        },
        {
          text: "Archives",
          link: "https://www.houstonchronicle.com/archive/",
        },
        {
          text: "Customer Service",
          link: "https://www.houstonchronicle.com/customer_service",
        },
        {
          text: "Frequently Asked Questions",
          link: "https://www.houstonchronicle.com/faq",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Newsroom Contacts",
          link: "https://www.houstonchronicle.com/newsroom_contacts",
        },
      ],
    },
    SanAntonio: {
      About: [
        {
          text: "Our Company",
          link: "https://www.hearst.com/newspapers/san-antonio-express-news",
        },
        {
          text: "Newspaper Delivery Safety Procedures",
          link:
            "https://www.expressnews.com/customer_service/article/How-Hearst-Newspapers-is-delivering-information-15152120.php",
        },
        {
          text: "Privacy Notice",
          link: "https://www.expressnews.com/privacy_policy/",
        },
        {
          text: "Your California Privacy Rights",
          link: "https://www.expressnews.com/privacy_policy/#caprivacyrights",
        },
        {
          text: "Interest Based Ads",
          link: "https://www.expressnews.com/privacy_policy/#interestbasedads",
        },
        {
          text: "Terms of Use",
          link: "https://www.expressnews.com/terms_of_use/",
        },
        {
          text: "Advertising",
          link: "http://www.hearstmediasa.com/",
        },
        {
          text: "Careers",
          link: "http://www.mysanantonio.com/careers/",
        },
        {
          text: "e-edition",
          link:
            "http://digital.olivesoftware.com/Olive/ODN/SanAntonioExpressNews/Default.aspx",
        },
      ],
      Contact: [
        {
          text: "Archives",
          link: "https://www.expressnews.com/archive",
        },
        {
          text: "Customer Service",
          link: "https://www.expressnews.com/customer_service",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Frequently Asked Questions",
          link: "https://www.expressnews.com/subscriberfaqs/",
        },
        {
          text: "Newsroom Contacts",
          link: "https://www.expressnews.com/newsroom_contacts",
        },
      ],
    },
    Conroe: {
      About: [
        {
          text: "Terms of Use",
          link: "https://www.yourconroenews.com/tos/",
        },
        {
          text: "Privacy Notice",
          link: "https://www.yourconroenews.com/privacy/",
        },
        {
          text: "Your California Privacy Rights",
          link:
            "https://www.yourconroenews.com/privacy/#additionalinformationforcaliforniaresidents",
        },
        {
          text: "Interest Based Ads",
          link: "https://www.yourconroenews.com/privacy/#interestbasedads",
        },
        {
          text: "Careers",
          link:
            "https://eevd.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1",
        },
        {
          text: "Our Company",
          link: "https://www.hearst.com/newspapers/houston-chronicle",
        },
        {
          text: "Subscribe",
          link: "https://www.yourconroenews.com/subproject",
        },
        {
          text: "e-Edition",
          link: "https://www.yourconroenews.com/e-edition",
        },
      ],
      Contact: [
        {
          text: "Advertising",
          link: "https://marketing.chron.com/",
        },
        {
          text: "Contact",
          link: "https://www.yourconroenews.com/contact/",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
      ],
      Connect: [
        {
          text: "Facebook",
          link: "https://www.facebook.com/TheCourierofMontgomeryCounty/",
        },
        {
          text: "Twitter",
          link: "https://twitter.com/conroecourier",
        },
      ],
    },
    Albany: {
      About: [
        {
          text: "Our Company",
          link: "http://www.hearst.com/newspapers/albany-times-union",
        },
        {
          text: "General Standards and Practices",
          link:
            "https://www.timesunion.com/home/article/General-Standards-and-Practices-for-Hearst-15647242.php/",
        },
        {
          text: "Newspaper Delivery Safety Procedures",
          link:
            "https://www.timesunion.com/home/article/How-Hearst-Newspapers-is-delivering-information-15152131.php",
        },
        {
          text: "Advertising",
          link: "https://timesunionmediagroup.com/",
        },
        {
          text: "Interest Based Ads",
          link:
            "https://www.timesunion.com/help/article/Privacy-notice-highlights-16480619.php#interestbasedads",
        },
        {
          text: "Terms of Use",
          link:
            "https://www.timesunion.com/help/article/Terms-of-use-16468248.php ",
        },
        {
          text: "Privacy Notice",
          link:
            "https://www.timesunion.com/help/article/Privacy-notice-highlights-16480619.php ",
        },
        {
          text: "Your California Privacy Rights",
          link:
            "https://www.timesunion.com/help/article/Privacy-notice-highlights-16480619.php#additionalinformationforcaliforniaresidents ",
        },
        {
          text: "Jobs at the TU",
          link:
            "https://eevd.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_15/pages/28003 ",
        },
      ],
      Contact: [
        {
          text: "Contact Us",
          link: "https://www.timesunion.com/help/",
        },
        {
          text: "Weather",
          link: "https://www.timesunion.com/weather/",
        },
        {
          text: "School Closings",
          link: "https://www.timesunion.com/closings/",
        },
        {
          text: "Events Calendar",
          link: "https://events.timesunion.com",
        },
        {
          text: "Celebrations",
          link: "https://www.timesunion.com/celebrations/",
        },
        {
          text: "Obituaries",
          link: "https://www.legacy.com/obituaries/timesunion-albany/",
        },
        {
          text: "Online Store",
          link: "https://timesunionplus-store.myshopify.com/",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Puzzles Palace",
          link: "https://www.timesunion.com/puzzles/",
        },
      ],
      Services: [
        {
          text: "Subscriber Services",
          link: "https://subscription.timesunion.com/",
        },
        {
          text: "Home Delivery",
          link:
            "https://subscription.timesunion.com/checkout/337/730/?origin=footer",
        },
        {
          text: "Become a Carrier",
          link: "https://www.timesunion.com/carriers",
        },
        {
          text: "e-Edition",
          link: "https://subscription.timesunion.com/eedition/",
        },
        {
          text: "Corporate Subscriptions",
          link: "https://www.timesunion.com/corporatesubscriptions/",
        },
        {
          text: "Mobile App",
          link: "https://www.timesunion.com/mobile-apps/",
        },
        {
          text: "Copyright and Reprint",
          link:
            "https://www.timesunion.com/help/article/Times-Union-copyright-and-reprint-policy-16417547.php",
        },
        {
          text: "Archives",
          link: "https://www.timesunion.com/archive",
        },
      ],
    },
    CT: {
      About: [
        {
          text: "Newspaper Delivery Safety Procedures",
          link:
            "/article/How-Hearst-Newspapers-is-delivering-information-15152129.php",
        },
        {
          text: "Privacy Notice",
          link: "/privacy/",
        },
        {
          text: "Your California Privacy Rights",
          link: "/privacy/#additionalinformationforcaliforniaresidents",
        },
        {
          text: "Interest Based Ads",
          link: "/privacy/#interestbasedads",
        },
        {
          text: "Terms of Use",
          link: "/tos/",
        },
        {
          text: "Advertising",
          link: "https://hearstmediact.com/",
        },
        {
          text: "Careers",
          link: "http://www.hearst.com/careers",
        },
      ],
      Contact: [
        {
          text: "FAQ",
          link: "/faq/",
        },
        {
          text: "Customer Service",
          link: "/feedback/",
        },
        {
          text: "Today's e-Edition",
          link:
            "https://subscription.hearstmediact.com/eEdition?siteID=" +
            eedition,
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Contact Us",
          link: "/contact/",
        },
      ],
      Connect: [
        {
          text: "RSS",
          link: "/rss/",
        },
        {
          text: "Newsletter Sign-Up",
          link: "/newsletters/",
        },
      ],
    },
    Midcom: {
      About: [
        {
          text: "Privacy Notice",
          link: "/privacy/",
        },
        {
          text: "Your California Privacy Rights",
          link: "/privacy/#additionalinformationforcaliforniaresidents",
        },
        {
          text: "Interest Based Ads",
          link: "/privacy/#interestbasedads",
        },
        {
          text: "Terms of Use",
          link: "/tos/",
        },
        {
          text: "Careers",
          link: "http://www.hearst.com/careers",
        },
      ],
      Contact: [
        {
          text: "Subscribe",
          link: "/subproject/",
        },
        {
          text: "Newsroom Contacts",
          link: "/contact/",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Advertise",
          link: "https://hearstmediamidwest.com/",
        },
      ],
    },
    Texcom: {
      About: [
        {
          text: "Privacy Notice",
          link: "/privacy/",
        },
        {
          text: "Your California Privacy Rights",
          link: "/privacy/#additionalinformationforcaliforniaresidents",
        },
        {
          text: "Interest Based Ads",
          link: "/privacy/#interestbasedads",
        },
        {
          text: "Terms of Use",
          link: "/tos/",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Careers",
          link: "http://www.hearst.com/careers",
        },
      ],
      Contact: [
        {
          text: "Subscribe",
          link: "/subproject/",
        },
        {
          text: "Newsroom Contacts",
          link: "/contact/",
        },
      ],
    },
    Seattle: {
      About: [
        {
          text: "Privacy Notice",
          link: "/privacy/",
        },
        {
          text: "Your California Privacy Rights",
          link: "/privacy/#additionalinformationforcaliforniaresidents",
        },
        {
          text: "Interest Based Ads",
          link: "/privacy/#interestbasedads",
        },
        {
          text: "Terms of Use",
          link: "/terms/",
        },
        {
          text: "Our Company",
          link: "/facts/",
        },
        {
          text: "Careers",
          link: "/pijobs/",
        },
        {
          text: "Advertising",
          link: "https://www.hearstseattlepi.com/",
        },
        {
          text: "Standards and Practices",
          link:
            "https://www.sfchronicle.com/file/759/0/7590-7528-Hearst_Newspaper_Group_Standards_and_Ethics_Policy.pdf",
        },
        {
          text: "Anonymous Sources Policy",
          link:
            "https://documentcloud.adobe.com/link/track?uri=urn%3Aaaid%3Ascds%3AUS%3Acaa61dc6-4e58-4e37-a089-89df2181b945",
        },
        {
          text: "Correction Policy",
          link:
            "https://documentcloud.adobe.com/link/track?uri=urn%3Aaaid%3Ascds%3AUS%3A857e94d2-250e-4bfc-9bd2-50095a3d3e29",
        },
      ],
      Contact: [
        {
          text: "Newsroom Contacts",
          link: "/pistaff/",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
        {
          text: "Ethics Policy",
          link: "/standards/",
        },
      ],
      Connect: [
        {
          text: "Archive",
          link: "https://seattlepi.newsbank.com/",
        },
        {
          text: "Newsletters",
          link: "https://www.seattlepi.com/newsletters/",
        },
        {
          text: "Facebook",
          link: "https://www.facebook.com/seattlepionline",
        },
        {
          text: "Twitter",
          link: "https://twitter.com/seattlepi",
        },
        {
          text: "Instagram",
          link: "https://www.instagram.com/seattlepi/",
        },
      ],
    },
    Austin: {
      About: [
        {
          text: "Our Company",
          link: "https://www.hearst.com/austin-american-statesman",
        },
        {
          text: "Privacy",
          link: "/privacy/",
        },
        {
          text: "DAA Industry Opt-Out",
          link: "/privacy/#daaindustryoptout",
        },
        {
          text: "Terms of Use",
          link: "/terms/",
        },
        {
          text: "Advertising",
          link: "https://www.hearstaustinmedia.com/",
        },
        {
          text: "Careers",
          link: "/careers",
        },
      ],
      Contact: [
        {
          text: "Archives",
          link: "/archive/search/subscriber/",
        },
        {
          text: "Customer Service",
          link: "/help/",
        },
        {
          text: "Frequently Asked Questions",
          link: "/subscriberfaqs/",
        },
        {
          text: "Newsroom Contacts",
          link: "/contact/staff/",
        },
        {
          text: "Our Use of AI",
          link: "/ai_use/",
        },
        {
          text: "Ethics Policy",
          link: "/standards/",
        },
      ],
    },
    TK: {
      About: [
        {
          text: "Advertising",
          link: "https://hearstmediact.com/",
        },
        {
          text: "Careers",
          link: "http://www.hearst.com/careers",
        },
      ],
    },
  };

  let marketLinks = footerLinks[meta.PROJECT.MARKET_KEY];
  // Special case for ctinsider, which doesn't fit the normal CT mold
  if (marketPrefix === "in") {
    marketLinks = {
      About: [
        {
          text: "Our Company",
          link:
            "https://www.hearst.com/newspapers/hearst-connecticut-media-group",
        },
        {
          text: "Ad Choices",
          link: "https://optout.aboutads.info/?c=2&lang=EN",
        },
        {
          text: "Careers",
          link:
            "https://eevd.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1",
        },
        {
          text: "Terms of Use",
          link: "https://www.ctinsider.com/tos/",
        },
        {
          text: "Advertising",
          link:
            "https://hearstmediact.com/?_ga=2.121588744.1440353062.1624467793-1527008254.1622131828",
        },
        {
          text: "Privacy Notice / Notice of Collection",
          link: "https://www.ctinsider.com/privacy/",
        },
        {
          text: "Your Privacy Rights",
          link: "https://www.ctinsider.com/privacy/#your_rights",
        },
        {
          text: "Your California Privacy Rights",
          link:
            "https://www.ctinsider.com/privacy/#additionalinformationforcaliforniaresidents",
        },
      ],
      Contact: [
        {
          text: "Contact Us",
          link: "https://www.ctinsider.com/contact/",
        },
        {
          text: "FAQ",
          link: "https://www.ctinsider.com/faq/",
        },
        { text: "Our Use of AI", link: "/ai_use/" },
      ],
    };
  }

  let linkHTML = "";
  Object.keys(marketLinks).forEach(function (key, index) {
    // Open the new section
    linkHTML +=
      '<li><div class="footer-title">' + key + '</div><ul class="section">';

    // Create the link items
    for (link in marketLinks[key]) {
      let thisLink = marketLinks[key][link];
      linkHTML +=
        '<li><a href="' +
        thisLink.link +
        '" target="_blank" rel="noopener noreferrer">' +
        thisLink.text +
        "</a></li>";
    }

    // Close the new section
    linkHTML += "</ul></li>";
  });
  let blockHTML = ``;
  if (meta.PROJECT.MARKET_KEY === "SFC") {
    blockHTML += `
		<style>
		.pageFooter--right-links .large-footer-link{
			margin: 7px 0 23px 0;
			clear: both;
			float: none;
			text-align: left;
		}
		.pageFooter--right-links .large-footer-link a{
			color: #fff;
			font-size: 14px;
			font-family: "National Medium", system-ui;
			white-space: nowrap;
			border: 1px solid;
			padding: 8px 10px;
		}
		.pageFooter--right-links .large-footer-link a:hover{
			color: #C7C7C7;
		}
		.pageFooter--right-links .large-footer-link a:visited{
			color: #909090;
		}
		@media (min-width: 768px){
			.pageFooter--right-links .large-footer-link{
			margin: 7px 0 7px;}
		}
		</style>
		<div class="large-footer-link">
		<a href="https://www.sfchronicle.com/mydata/" target="_blank" role="listitem">Your Privacy Choices (Opt Out of Sale/Targeted Ads)</a>
		</div>
		`;
  }
  let footerHTML = `<footer class="pageFooter ${invertClass}">
    <div class="lock">
      <div class="pageFooter--wrapper">
        <div class="pageFooter--left">
          <a
            href="/"
            class="pageFooter--left-logo"
            aria-label="Click to go to the homepage"
            style="background-image: url(https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-${color}.png)"
          >
            Homepage
          </a>
          <a
            href="/"
            class="pageFooter--left-logo mobile"
            aria-label="Click to go to the homepage"
            style="background-image: url(https://files.sfchronicle.com/static-assets/logos/${marketPrefix}-square-${color}.png)"
          >
            Homepage
          </a>
        </div>
        <div class="pageFooter--right">
          <div class="pageFooter--right-topLine">
            <button id="scrollTop" class="return">
              To Top
            </button>
          </div>
          <div class="pageFooter--right-links">
            <div class="hdnce-e hdnce-item-87230">
              <ul class="wrapper">
                ${linkHTML}
              </ul>
			  ${blockHTML}
            </div>
          </div>
        </div>
      </div>
      <div class="pageFooter--branding">
        <img
          class="pageFooter--branding-logo"
          src="https://sfchronicle.com/img/hearst_newspapers_logo.svg"
          alt="San Francisco Chronicle logo"
        />
        <span class="pageFooter--branding-copyright">
          ©${year}
          Hearst
        </span>
      </div>
    </div>
  </footer>`;

  return footerHTML;
};

module.exports = { getFooter };
