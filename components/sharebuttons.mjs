import React, { useEffect, useState } from "react";
import * as shareStyles from "../styles/modules/share.module.less";
import { appCheck } from "../appcheck.js";
import { trackEvent } from "../components/helpers/utilfunctions.mjs";

const ShareButtons = ({ meta, urlAdd, location = "Byline" }) => {
  // We need to run appCheck in useEffect because we need to wait for the DOM to be ready
  let [hideSocial, setHideSocial] = useState(false);
  useEffect(() => {
    if (appCheck()) {
      setHideSocial(true);
    }
  }, []);

  // Extension to URL if passed in
  if (!urlAdd) {
    urlAdd = "";
  }

  let facebookClick = (e) => {
    const link = e.currentTarget.getAttribute("href");
    e.preventDefault();
    if (link) {
      window.open(link, "facebook-share-dialog", "width=626,height=436");
    }
  };

  let subfolder = "";
  if (meta.PROJECT.SUBFOLDER) {
    subfolder = meta.PROJECT.SUBFOLDER + "/";
  }

  return (
    <div className={shareStyles.wrapper} id="sharebutton-box">
      {!hideSocial && (
        <>
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}`}
            className={shareStyles.link}
            onClick={(e) => {
              facebookClick(e);
              trackEvent("Click", "Button", "Share", `Facebook|${location}`);
            }}
          >
            <svg
              className={shareStyles.svg}
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="facebook"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
              ></path>
            </svg>
          </a>
          {/* Twitter */}
          <a
            href={`https://x.com/intent/post?url=${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}&text=${meta.PROJECT.TWITTER_TEXT}`}
            className={shareStyles.link}
            onClick={() => {
              trackEvent("Click", "Button", "Share", `X|${location}`);
            }}
          >
            {/* <svg
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
            </svg> */}
            <svg
              className={shareStyles.svg}
              data-icon="twitter"
              role="img"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                data-name="Twitter Logo"
                fill="currentColor"
                d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
              />
            </svg>
          </a>
          {/* Bluesky */}
          <a
            href={`https://bsky.app/intent/compose?text=${meta.PROJECT.TWITTER_TEXT}&url=${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%${urlAdd}`}
            className={shareStyles.link}
            onClick={() => {
              trackEvent("Click", "Button", "Share", `Bluesky|${location}`);
            }}
          >
            <svg
              className={shareStyles.svg}
              data-icon="bluesky"
              role="img"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                data-name="Bluesky Logo"
                fill="currentColor"
                d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"
              />
            </svg>
          </a>
        </>
      )}
      {/* Email */}
      <a
        href={`mailto:?subject=${meta.PROJECT.TITLE}&body=${meta.PROJECT.DESCRIPTION}%0A%0A${meta.MAIN_DOMAIN}%2F${subfolder}${meta.PROJECT.SLUG}%2F${urlAdd}`}
        className={shareStyles.link}
        onClick={() => {
          trackEvent("Click", "Button", "Share", `Email|${location}`);
        }}
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
  );
};

export default ShareButtons;
