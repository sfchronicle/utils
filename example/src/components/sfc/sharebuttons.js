import React from 'react'
import * as shareStyles from '../../styles/modules/share.module.less'

const ShareButtons = ({ meta, urlAdd }) => {
  // Extension to URL if passed in
  if (!urlAdd) {
    urlAdd = ''
  }

  let facebookClick = (e) => {
    const link = e.currentTarget.getAttribute('href')
    e.preventDefault()
    if (link) {
      window.open(link, 'facebook-share-dialog', 'width=626,height=436')
    }
  }

  let subfolder = ''
  if (meta.PROJECT.SUBFOLDER) {
    subfolder = meta.PROJECT.SUBFOLDER + '/'
  }

  return (
    <div className={shareStyles.wrapper}>
      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}&text=${meta.PROJECT.TWITTER_TEXT}`}
        className={shareStyles.link}
      >
        <svg
          className={shareStyles.svg}
          data-icon="twitter"
          role="img"
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 248 204"
        >
          <path
            data-name="Twitter Logo"
            fill="currentColor"
            d="M222 51.29c.15 2.16.15 4.34.15 6.52 0 66.74-50.8 143.69-143.69 143.69A142.91 142.91 0 0 1 1 178.82a102.72 102.72 0 0 0 12 .72 101.29 101.29 0 0 0 62.72-21.66 50.53 50.53 0 0 1-47.18-35.07 50.35 50.35 0 0 0 22.8-.86 50.53 50.53 0 0 1-40.52-49.5v-.64a50.25 50.25 0 0 0 22.92 6.32 50.55 50.55 0 0 1-15.6-67.42 143.38 143.38 0 0 0 104.08 52.77 50.55 50.55 0 0 1 86.06-46.06 101.19 101.19 0 0 0 32.06-12.26 50.66 50.66 0 0 1-22.2 27.93 100.89 100.89 0 0 0 29-7.94A102.84 102.84 0 0 1 222 51.29z"
          />
        </svg>
      </a>
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}`}
        className={shareStyles.link}
        onClick={facebookClick}
      >
        <svg
          className={shareStyles.svg}
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="facebook"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
          ></path>
        </svg>
      </a>
      {/* Email */}
      <a
        href={`mailto:?subject=${meta.PROJECT.TITLE}&body=${meta.PROJECT.DESCRIPTION}%0A%0A${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}`}
        className={shareStyles.link}
      >
        <svg
          className={shareStyles.svg}
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="envelope"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"
          ></path>
        </svg>
      </a>
    </div>
  )
}

export default ShareButtons
