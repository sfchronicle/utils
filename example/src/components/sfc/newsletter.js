import React, { useEffect, useState } from 'react'
// Grab font awesome
import { useStaticQuery, graphql } from "gatsby"
import {
  newsletterPromo,
  handleSubmit,
} from './component-helpers/newsletterhelpers'
import * as newsletterStyles from '../../styles/modules/newsletter.module.less'
import { getBrands } from '../../../../index'

/* 

If you want to overwrite these in a C2P project, you'll need 3 columns with these names exactly:

NewsletterID
NewsletterPromo
NewsletterLegal

*/

const NewsletterSignup = () => {
  const {
    site: {
      siteMetadata: {
        PROJECT: {
          NEWSLETTER_ID, NEWSLETTER_LEGAL, NEWSLETTER_PROMO, MARKET_KEY, SUBFOLDER, SLUG
        }
      }
    }
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          PROJECT {
            SLUG
            SUBFOLDER
            NEWSLETTER_ID
            NEWSLETTER_LEGAL
            NEWSLETTER_PROMO
            MARKET_KEY
          }
        }
      }
    }
  `)

  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorSubmitted, setErrorSubmitted] = useState(false)
  const [signedUp, setSignedUp] = useState(false)
  const [signupError, setSignupError] = useState(false)
  const thisBrand = getBrands(MARKET_KEY);

  useEffect(() => {
    // Append script after load
    const script = document.createElement('script')
    script.src =
      'https://www.google.com/recaptcha/api.js?render=6LeBOJAUAAAAAPH7JcaZoQpNcXoHz8T6bFjqlxRg'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className={newsletterStyles.container}>
      <div className={newsletterStyles.wrapper}>
        <div className={newsletterStyles.contentWrapper}>
          <div className={newsletterStyles.content}>
            <div className={newsletterStyles.headshot}>
              <img
                alt="logo"
                src={"https://files.sfchronicle.com/static-assets/logos/"+thisBrand.attributes.marketPrefix+"-square-black.png"}
              />
            </div>
            <p
              className={newsletterStyles.newsletterHeadline}
              dangerouslySetInnerHTML={{ __html: NEWSLETTER_PROMO }}
            />
          </div>

          <div className={newsletterStyles.formWrapper}>
            <div>
              <div className={newsletterStyles.inputWrapper}>
                <input
                  className={newsletterStyles.userSignUp}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value)
                    setErrorSubmitted(false)
                  }}
                  placeholder="Enter your email address here."
                  type="email"
                />

                <button
                  className={newsletterStyles.submitButton}
                  type="submit"
                  onClick={() =>
                    handleSubmit({
                      email,
                      setEmailValid,
                      emailValid,
                      setSubmitting,
                      setSignedUp,
                      setSignupError,
                      setErrorSubmitted,
                      MARKET_KEY,
                      NEWSLETTER_ID
                    }, 
                      `${SUBFOLDER}|${SLUG}` //Unique ID for this signup
                    )
                  }
                >
                  {submitting ? (
                    <img src="https://projects.sfchronicle.com/shared/logos/loading.gif" />
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={newsletterStyles.outputText}>
          {errorSubmitted && (
            <p className={newsletterStyles.red}>
              This email is invalid. Please update and submit again.
            </p>
          )}
          {signupError && (
            <p className={newsletterStyles.red}>
              There was a problem with the server, please try again later.
            </p>
          )}
          {signedUp && <p>Thank you for signing up for our newsletter!</p>}
        </div>

        <p className={newsletterStyles.disclaimer}>
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="https://policies.google.com/privacy" target="_blank">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/terms" target="_blank">
            Terms of Service
          </a>{' '}
          {NEWSLETTER_LEGAL &&
            <span dangerouslySetInnerHTML={{__html: NEWSLETTER_LEGAL}} />
          }
        </p>
      </div>
    </div>
  )
}

export default NewsletterSignup
