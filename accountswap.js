
// Detect if there's a valid signin -- if so, swap Subscribe button to Account button
// Any domain + /realm/ should work for an account link
const accountURL = "/realm/"

const pollForAccount = function(i){
  // Start the iterator
  if (!i){
    i = 0
  }
  // Safecheck for treg since it might not be global yet
  if (window && window.treg && window.treg.identity && window.treg.identity.id){
    // We got a valid entitlement! Let's see if the button exists and swap our new one in
    const subButton = document.querySelector('#nav2-sub-box')
    const subButtonText = document.querySelector('#nav2-sub-box div')
    if (subButton && subButtonText){
      subButton.setAttribute("href", accountURL)
      subButtonText.innerText = "Account"
    }
  } else {
    if (i > 10){
      // If we've waited 10 seconds and there's still no entitlement, assume we aren't getting one
      return false
    }
    // Check again after 1 sec
    setTimeout(() => {pollForAccount(i+1)}, 1000)
  }
}

module.exports = { pollForAccount }
