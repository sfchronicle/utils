// Detect if there's a valid signin -- if so, swap Subscribe button to Account button
// Any domain + /realm/ should work for an account link
const accountURL = "/realm/";

const pollForAccount = async function (i, isNav) {
  // Assume it's nav
  if (isNav === undefined) {
    isNav = true;
  }
  // Start the iterator
  if (!i) {
    i = 0;
  }
  // Safecheck for treg since it might not be global yet
  if (window && window.treg && window.treg.identity) {
    // Now we have all the vars to know if we're logged in
    if (!window.treg.identity.id) {
      // If we don't have an identity, we're not logged in
      return false;
    }
    if (isNav) {
      // We got a valid entitlement! Let's see if the button exists and swap our new one in
      const subButton = document.querySelector("#nav2-sub-box");
      const subButtonText = document.querySelector("#nav2-sub-box div");
      if (subButton && subButtonText) {
        if (!subButtonText.innerText) {
          // If there's no innerText, keep waiting
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return await pollForAccount(i + 1, isNav);
        }
        subButtonText.innerText = "Account";
        subButton.setAttribute("href", accountURL);
        // Instead of having a true link, set click event to run treg.realm.iframeProfile.NavigateToIndex()
        if (window.treg.realm.iframeProfile) {
          subButton.onclick = function (e) {
            window.treg.realm.iframeProfile.NavigateToIndex();
            e.preventDefault();
            e.stopPropagation();
          };
        }
      }
    }
    return true;
  } else {
    if (i > 10) {
      // If we've waited 5 seconds and there's still no entitlement, assume we aren't getting one
      return false;
    }
    // Check again after 0.5 sec using a Promise with async/await
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await pollForAccount(i + 1, isNav);
  }
};

module.exports = { pollForAccount };
