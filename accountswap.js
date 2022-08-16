
// Detect if there's a valid signin -- if so, swap Subscribe button to Account button
// Any domain + /realm/ should work for an account link
const accountURL = "/realm/"

const pollForAccount = function(i){
  // Start the iterator
  if (!i){
    i = 0
  }
  // Safecheck for treg since it might not be global yet
  if (window && window.treg && window.treg.identity && window.treg.identity.isEntitled){
    // We got a valid entitlement! Let's see if the button exists and swap our new one in
    const subButton = documment.querySelector('.sub-box')
    console.log("found and swapped")
    if (subButton){
      subButton.setAttribute("href", accountURL)
      subButton.innerText = "Account"
    }
  } else {
    if (i > 10){
      // If we've waited 10 seconds and there's still no entitlement, assume we aren't getting one
      return false
    }
    console.log("not found, polling " + i)
    // Check again after 1 sec
    setTimeout(() => {pollForAccount(i+1)}, 1000)
  }
}

module.exports = { pollForAccount }