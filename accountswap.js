// Detect if there's a valid signin -- if so, swap Subscribe button to Account button
// Any domain + /realm/ should work for an account link
const accountURL = "/realm/";
const REALM_STORAGE_KEY = "oidc.hdn.user:https://realm.hearstnp.com/:hdn.js";

const getRealmAccessToken = () => {
  if (typeof window === "undefined") return null;
  const tregToken = window.treg?.realm?.Oidc?.getUser?.()?.access_token;
  if (tregToken) return tregToken;
  try {
    return JSON.parse(window.localStorage.getItem(REALM_STORAGE_KEY))
      ?.access_token;
  } catch (error) {
    return null;
  }
};

const hasValidRealmAccessToken = () => {
  try {
    const payload = getRealmAccessToken()?.split(".")[1];
    const base64 = payload?.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(
      atob(base64?.padEnd(Math.ceil(base64.length / 4) * 4, "="))
    );
    return Number.isFinite(exp) && exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Attach the sign-in handler to the .hnp-signin button if not already attached
const attachSigninHandler = async function () {
  let attachedRealm = false;
  let tries = 0;
  const maxTries = 20; // 20 * 500ms = 10 seconds
  while (!attachedRealm && tries < maxTries) {
    tries++;
    const signinButton = document.querySelector(".hnp-signin");
    if (signinButton && !signinButton.dataset.realmAttached) {
      signinButton.dataset.realmAttached = "true";
      signinButton.onclick = function (e) {
        if (
          window &&
          window.treg &&
          window.treg.realm &&
          window.treg.realm.core
        ) {
          window.treg.realm.core.login();
        }
        e.preventDefault();
        e.stopPropagation();
      };
      attachedRealm = true;
    } else {
      // Wait and try again
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
};

// Pass { strict: true } to require an unexpired Realm access token.
// Other projects retain the existing TREG-ID-only behavior.
// Swap the Subscribe button for the Account button if logged in
const swapSubscribeForAccount = async function ({ strict = false } = {}) {
  let swapped = false;
  let tries = 0;
  const maxTries = 20; // 20 * 500ms = 10 seconds
  while (!swapped && tries < maxTries) {
    tries++;
    const isLoggedIn = strict
      ? hasValidRealmAccessToken()
      : window &&
        window.treg &&
        window.treg.identity &&
        window.treg.identity.id;
    if (isLoggedIn) {
      const rightBlock = document.querySelector(".nav2-right");
      if (rightBlock && rightBlock.innerText) {
        rightBlock.innerHTML = `<a id="nav2-sub-box" href="${accountURL}"><div>Account</div></a>`;
        if (
          window &&
          window.treg &&
          window.treg.realm &&
          window.treg.realm.iframeProfile
        ) {
          const subButton = document.querySelector("#nav2-sub-box");
          if (subButton) {
            subButton.onclick = function (e) {
              window.treg.realm.iframeProfile.NavigateToIndex();
              e.preventDefault();
              e.stopPropagation();
            };
            swapped = true;
          }
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};

// Launch both processes
const pollForAccount = async function (options) {
  // Launch both async processes, but don't wait for them to finish (they are self-terminating)
  attachSigninHandler();
  swapSubscribeForAccount(options);
};

module.exports = { pollForAccount, hasValidRealmAccessToken };
