import React from 'react'
import Credits from './credits'
import CreditLine from './creditline'
import * as creditssectionStyles from '../../styles/modules/creditssection.module.less'
let rawCredits;
try {
	rawCredits = require('../../data/credits.sheet.json')
} catch (err){
    // It's fine
    rawCredits = null;
}
const CreditsSection = () => {
  //get rid of instructions
  let credits = rawCredits

  // Put credits into structured array
  let creditObj = {}
  if(credits){
  credits.forEach((credit) => {
    if (typeof creditObj[credit.role] === 'undefined') {
      // Create an empty array with key of role
      creditObj[credit.role] = []
    }
    // Push into role array regardless
    creditObj[credit.role].push(credit)
  })
}
  return (
    <section aria-label="Credits" className={creditssectionStyles.section}>
      <h4 className={creditssectionStyles.hed}>Credits</h4>
      {Object.keys(creditObj).map((key) => (
        <Credits type={key} key={key}>
          {creditObj[key].map((credit) => (
            <CreditLine
              key={credit.name}
              name={credit.name}
              email={credit.email}
              twitter={credit.twitter}
            />
          ))}
        </Credits>
      ))}
    </section>
  )
}

export default CreditsSection
