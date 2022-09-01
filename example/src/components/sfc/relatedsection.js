import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import RelatedRow from './relatedrow'
import * as relatedsectionStyles from '../../styles/modules/relatedsection.module.less'
import { setRichieParam } from './component-helpers/utilfunctions'

const RelatedSection = ({ links }) => {
	let [relLinks, setRelLinks] = useState(links)

	// Reset in case they need URL params for app
	useEffect(() => {
		setRelLinks(setRichieParam(relLinks))
	}, [])

  return <section aria-label="Related links" className={relatedsectionStyles.section}>
  	<div className={relatedsectionStyles.hed}>Read more</div>
    <RelatedRow links={relLinks} />
  </section>
}

RelatedSection.propTypes = {
  links: PropTypes.array.isRequired,
}

export default RelatedSection


