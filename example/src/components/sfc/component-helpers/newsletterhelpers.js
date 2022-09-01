import axios from 'axios'

// Check the vars to make sure the form is in a state to be sent
function checkSubmitStatus({ email, setEmailValid, emailValid }) {
  // Check if email is formatted like an email
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    // Valid email
    setEmailValid(true)
  } else {
    // Invalid email
    setEmailValid(false)
    return false
  }

  // Check all values
  if (email) {
    // Tests passed! Return true
    return true
  }
  // If tests were not passed, return false
  return false
}

// Run our submission through reCAPTCHA logic
function handleSubmit({
  email,
  setEmailValid,
  emailValid,
  setSubmitting,
  setSignedUp,
  setSignupError,
  setErrorSubmitted,
  MARKET_KEY,
  NEWSLETTER_ID
}, uniqueID) {
  // See if we're able to submit
  if (checkSubmitStatus({ email, setEmailValid, emailValid })) {
    // Change the button graphic to show we're doing something
    setSubmitting(true)
    // Go ahead with the submit
    if (typeof window !== 'undefined') {
      window.grecaptcha.ready(() => {
        // This will fail on mobile because reCAPTCHA does not work on dev domains
        window.grecaptcha
          .execute('6LeBOJAUAAAAAPH7JcaZoQpNcXoHz8T6bFjqlxRg', {
            action: 'newslettersignup',
          })
          .then((token) => {
            // Append write-in prefix if this is a write-in answer
            axios
              .post(
                'https://projects.sfchronicle.com/feeds/voting/index.php',
                {
                  token: token,
                  formData: {
                    // Sending data that jives with what PHP expects
                    email: email,
                    pageChoices: [],
                    newsletterSignup: true,
                    customSailID: NEWSLETTER_ID,
                    uniqueID: uniqueID,
                    logSource: '*EMBEDDED SIGNUP*',
                    marketKey: MARKET_KEY
                  },
                },
                { headers: { 'Content-Type': 'application/json' } }
              )
              .then((response) => {
                // If successful, show end of form
                if (response.status === 200) {
                  setSignedUp(true)
                  setSubmitting(false)
                } else {
                  // Show error if our server fails
                  setSignupError(true)
                  setSubmitting(false)
                }
              })
            return true
          })
      })
    }
  } else {
    // Submit error! Change state to expose error help text
    setErrorSubmitted(true)
  }
}

export { handleSubmit }
