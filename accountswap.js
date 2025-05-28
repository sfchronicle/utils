// Detect if there's a valid signin -- if so, swap Subscribe button to Account button
// Any domain + /realm/ should work for an account link
const accountURL = "/realm/";

// Attach the sign-in handler to the .hnp-signin button if not already attached
const attachSigninHandler = async function () {
  let attachedRealm = false;
  let tries = 0;
  const maxTries = 20; // 20 * 500ms = 10 seconds
  while (!attachedRealm && tries < maxTries) {
    const signinButton = document.querySelector(".hnp-signin");
    if (signinButton && !signinButton.dataset.realmAttached) {
      signinButton.dataset.realmAttached = "true";
      console.log("Attaching signin handler");
      signinButton.onclick = function (e) {
        if (window.treg?.realm?.core) {
          console.log("Logging in!");
          window.treg.realm.core.login();
        }
        e.preventDefault();
        e.stopPropagation();
      };
      attachedRealm = true;
    } else {
      // Wait and try again
      await new Promise((resolve) => setTimeout(resolve, 500));
      tries++;
    }
  }
};

// Swap the Subscribe button for the Account button if logged in
const swapSubscribeForAccount = async function () {
  let swapped = false;
  let tries = 0;
  const maxTries = 20; // 20 * 500ms = 10 seconds
  while (!swapped && tries < maxTries) {
    if (window?.treg?.identity?.id) {
      const rightBlock = document.querySelector(".nav2-right");
      if (rightBlock) {
        if (!rightBlock.innerText) {
          // If there's no innerText, keep waiting
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        rightBlock.innerHTML = `<a id="nav2-sub-box" href="${accountURL}"><div>Account</div></a>`;
        if (window.treg?.realm?.iframeProfile) {
          const subButton = document.querySelector("#nav2-sub-box");
          if (subButton) {
            subButton.onclick = function (e) {
              window.treg.realm.iframeProfile.NavigateToIndex();
              e.preventDefault();
              e.stopPropagation();
            };
          }
        }
        swapped = true;
      }
    } else {
      // Wait and try again
      await new Promise((resolve) => setTimeout(resolve, 500));
      tries++;
    }
  }
};

// Launch both processes
const pollForAccount = async function () {
  // Launch both async processes, but don't wait for them to finish (they are self-terminating)
  attachSigninHandler();
  swapSubscribeForAccount();
};

module.exports = { pollForAccount };
