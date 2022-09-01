import React from 'react'
import PropTypes from 'prop-types'
import * as relatedlinkStyles from '../../styles/modules/relatedlink.module.less'
import WCMImage from './wcmimage'

const RelatedLink = ({ url, wcmid, title }) => (
  <div className={relatedlinkStyles.container}>
    <a href={url}>
    	{wcmid &&
    		<WCMImage wcm={wcmid} alt="Thumbnail image for a related story" ratio={"55%"} />
    	}
      <p className={relatedlinkStyles.text}>{title}</p>
    </a>
  </div>
)

RelatedLink.propTypes = {
  url: PropTypes.string,
  wcmid: PropTypes.number,
  title: PropTypes.string,
}

export default RelatedLink
