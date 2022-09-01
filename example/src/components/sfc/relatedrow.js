import React from 'react'
import PropTypes from 'prop-types'
import RelatedLink from './relatedlink'
import * as relatedrowStyles from '../../styles/modules/relatedrow.module.less'

const RelatedRow = ({ links }) => (
  <div className={relatedrowStyles.links}>
    {links.map((link) => (
      <RelatedLink
        key={link.title}
        url={link.url}
        wcmid={link.wcmid}
        title={link.title}
      />
    ))}
  </div>
)

RelatedRow.propTypes = {
  links: PropTypes.array,
}

export default RelatedRow
