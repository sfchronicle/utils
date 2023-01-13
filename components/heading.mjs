import React from 'react'

const Heading =(props) => {
  let {level, className, text} = props
  if (!level) {
    level = 3
  }
  if (!className) {
    className = ""
  }
  const object = {...props}
  delete object["text"]
  delete object["level"]

  level = level.toString()

  switch (level) {
    case '1':
    return <h1 {...object} className={`hed ${className}`} dangerouslySetInnerHTML={{__html:text}}></h1>
    case '2':
    return <h2 {...object} className={`${className}`} dangerouslySetInnerHTML={{__html:text}}></h2>
    case '3':
    return <h3 {...object} className={`subhead ${className}`} dangerouslySetInnerHTML={{__html:text}}></h3>
    case '4':
    return <h4 {...object} className={`subhead-sans ${className}`} dangerouslySetInnerHTML={{__html:text}}></h4>
    case '5':
    return <h5 {...object} className={`lead-in ${className}`} dangerouslySetInnerHTML={{__html:text}}></h5>
    case '6':
    return <h6 {...object} className={`label ${className}`} dangerouslySetInnerHTML={{__html:text}}></h6>
  }
}

export default Heading