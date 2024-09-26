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
  if (
    window &&
    window.treg &&
    window.treg.identity &&
    window.treg.identity.id
  ) {
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
        // subButton.setAttribute("href", accountURL);
        // Instead of having a true link, set click event to run treg.realm.iframeProfile.NavigateToIndex()
        subButton.onclick = function () {
          window.treg.realm.iframeProfile.NavigateToIndex();
        };
      }
    }
    return true;
  } else {
    if (i > 10) {
      // If we've waited 10 seconds and there's still no entitlement, assume we aren't getting one
      return false;
    }
    // Check again after 1 sec
    // Check again after 1 sec using a Promise with async/await
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await pollForAccount(i + 1, isNav);
  }
};

module.exports = { pollForAccount };
