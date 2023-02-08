import {getBlueconic} from "../../blueconic"
import {appCheck} from "../../index"

/** TODO */
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

function appendLayoutScripts(isEmbedded) {
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

  if (!isEmbedded) {
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
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.defer = true;
      script.src = blueconicURL;
      document.body.appendChild(script);
    }
  }, 5000)
}

export { debounce, appendLayoutScripts }