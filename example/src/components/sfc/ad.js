import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as adStyles from '../../styles/modules/ad.module.less'

// Hearst ad -- make sure Juice is fully loaded before running the script logic
const Ad = ({ adLetter }) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let attemptLoad = () => {
      if (typeof hearstPlaceAd === "undefined"){
        // The function isn't ready yet, so wait
        setTimeout(() => {
          attemptLoad()
        }, 1000)
      } else {
        // We have the function, so set loaded
        setLoaded(true)
      }
    }

    // Kick off loop
    attemptLoad()
  }, [])

  return (
    <div className={adStyles.ad}>
      <p className={adStyles.adhed}>Advertisement</p>
      <div id={`${adLetter}Pflex`}>
        {loaded &&
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `/*<![CDATA[*/hearstPlaceAd("${adLetter}Pflex");/*]]>*/`,
            }}
          ></script>
        }
      </div>
    </div>
  )
}

Ad.propTypes = {
  adLetter: PropTypes.string
}

export default Ad
