import { getBlueconic } from "../../blueconic"
import { getBrands2 } from "../../brands2"
import { appCheck, blendHDN } from "../../index"

/** Used for resizing the WCM Image */
function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

function appendLayoutScripts(isEmbedded, isAdRemoved) {
  const isApp = appCheck();

  // React Helmet is actually terrible and runs these scripts twice, so we are including them async ourselves
  // Run analytics and resizing scripts right away so we take care of that
  if (!isEmbedded) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://nexus.ensighten.com/hearst/news/Bootstrap.js';
    document.body.appendChild(script);
  } else {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://projects.sfchronicle.com/shared/js/responsive-child.js';
    document.body.appendChild(script);
  }

  if (!isEmbedded && !isAdRemoved) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'adPositionManagerScriptTag';
    script.src = 'https://aps.hearstnp.com/Scripts/loadAds.js';
    document.body.appendChild(script);
  }

  // Wait a beat, then add to body so it doesn't mess with the head (which Helmet seems to want to manage)
  setTimeout(() => {
    if (!isEmbedded && !isApp) {
      let blueconicURL = getBlueconic(window.location.origin)
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.defer = true
      script.src = blueconicURL
      document.body.appendChild(script)

      // Init sailthru
      // if (window && window.Sailthru){
      //   window.Sailthru.init({ customerId: thisBrand.attributes.sailCustomer })
      // }
    }
  }, 5000)
}

function formatHDN(isEmbedded, url_add, meta) {
  const isApp = appCheck();

  // Combine our settings with what Hearst puts on page
  let stringHDN = ''
  if (!isEmbedded) {
    // Put url_add into a new meta object to pass in
    const metaHDN = Object.assign({}, meta)
    metaHDN.URL_ADD = url_add
    // Add sailthru var
    // metaHDN.SAIL_CUST = thisBrand.attributes.sailCustomer
    // Make sure this is free on app
    if (isApp) {
      metaHDN.PAYWALL_SETTING = "free"
    }
    // Allow gift button to appear next to sharebuttons
    metaHDN.GIFT_ENABLED = true
    let blended = blendHDN(metaHDN)
    stringHDN = blended.stringHDN
  }
  return stringHDN;
}

export { debounce, appendLayoutScripts, formatHDN }