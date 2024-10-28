import { getBlueconic } from "../../blueconic";
import { getBrands3 } from "../../brands3";
import { appCheck, blendHDN } from "../../index";

const currentEnv = process.env.GATSBY_DEPLOY_ENV;

/** Used for resizing the WCM Image */
function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

function appendLayoutScripts(isEmbedded, isAdRemoved, marketKey, category) {
  const isApp = appCheck();

  // React Helmet is actually terrible and runs these scripts twice, so we are including them async ourselves
  // Run analytics and resizing scripts right away so we take care of that
  if (!isEmbedded) {
    // Google Tag Manager
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "GTM-P38VLD8M");
    // Add new md5 script
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://projects.sfchronicle.com/shared/js/md5.js";
    document.body.appendChild(script);
    let script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "https://nexus.ensighten.com/hearst/news/Bootstrap.js";
    document.body.appendChild(script2);
  } else {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://projects.sfchronicle.com/shared/js/responsive-child.js";
    document.body.appendChild(script);
  }

  if (!isEmbedded && !isAdRemoved) {
    // If category is passed, that means we're supporting HTL
    if (category) {
      // Set ad params
      if (typeof window.HDN !== "undefined") {
        window.HDN.dataLayer.visit = window.HDN.dataLayer.visit || {};
        window.HDN.dataLayer.visit.urlHash = window.location.hash;
      }
      // Get the domain off the URL
      const domain = window.location.origin;
      const fullURL = window.location.href;
      const shortDomain = domain.replace("https://www.", "");
      const script = document.createElement("script");
      // Try to get the htlbid URL to see if it's enabled
      script.type = "text/javascript";
      script.src = `https://htlbid.com/v3/${shortDomain}/hnpbid.js`;
      document.body.appendChild(script);
      // Add stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://htlbid.com/v3/${shortDomain}/hnpbid.css`;
      document.head.appendChild(link);
      setTimeout(() => {
        // Add vars after timeout
        if (window.hnpbid) {
          console.log("hnpbid exists");
          window.hnpbid = window.hnpbid || {};
          window.hnpbid.cmd = window.hnpbid.cmd || [];
          window.hnpbid.cmd.push(() => {
            window.hnpbid.setTargeting(
              "is_testing",
              currentEnv === "production" ? "no" : "yes"
            ); // Set to "no" for production
            window.hnpbid.setTargeting("is_home", "no"); // Set to "yes" on the homepage
            window.hnpbid.setTargeting("post_id", `${fullURL}`);
            window.hnpbid.setTargeting("category", category || "news");
            // init
            window.hnpbid.layout();
          });
        } else {
          console.log("hnpbid does not exist");
          // If global var was not defined, start Juice
          let script = document.createElement("script");
          script.type = "text/javascript";
          script.id = "adPositionManagerScriptTag";
          script.src = "https://aps.hearstnp.com/Scripts/loadAds.js";
          document.body.appendChild(script);
        }
      }, 1000);
    } else {
      console.log("juice fallback");
      // If no category, this is the old version and we're supporting Juice (expires in Nov 2024)
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "adPositionManagerScriptTag";
      script.src = "https://aps.hearstnp.com/Scripts/loadAds.js";
      document.body.appendChild(script);
    }
  }

  // Wait a beat, then add to body so it doesn't mess with the head (which Helmet seems to want to manage)
  setTimeout(() => {
    if (!isEmbedded && !isApp) {
      let blueconicURL = getBlueconic(window.location.origin);
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.defer = true;
      script.src = blueconicURL;
      document.body.appendChild(script);

      // Init sailthru
      if (window && window.Sailthru && marketKey) {
        window.Sailthru.init({
          customerId: getBrands3(marketKey).attributes.sailCustomer,
        });
      }
    }
  }, 1000);
}

function formatHDN(isEmbedded, url_add, meta) {
  const isApp = appCheck();
  const thisBrand = getBrands3(meta.PROJECT.MARKET_KEY);

  // Combine our settings with what Hearst puts on page
  let stringHDN = "";
  if (!isEmbedded) {
    // Put url_add into a new meta object to pass in
    const metaHDN = Object.assign({}, meta);
    metaHDN.URL_ADD = url_add;
    // Add sailthru var
    metaHDN.SAIL_CUST = thisBrand.attributes.sailCustomer;
    // Make sure this is free on app
    if (isApp) {
      metaHDN.PAYWALL_SETTING = "free";
    }
    // Allow gift button to appear next to sharebuttons
    metaHDN.GIFT_ENABLED = true;
    let blended = blendHDN(metaHDN);
    stringHDN = blended.stringHDN;
  }
  return stringHDN;
}

function getFigureWidth(maxWidth) {
  switch (maxWidth) {
    case "text-width":
      return "text-width";
    case "large":
      return "large mw-lg mt-md mb-md ml-auto mr-auto";
    case "wide":
      return "wide mw-xl mt-md mb-md ml-auto mr-auto";
    case "full":
      return "full mw-100 mt-md mb-md ml-auto mr-auto";
    case "embed":
      return "mw-xl ml-auto mr-auto";
    case "float-right":
      return "float-right";
    case "float-left":
      return "float-left";
    default:
      return "text-width";
  }
}

export { debounce, appendLayoutScripts, formatHDN, getFigureWidth };
