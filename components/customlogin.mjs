import React, { useEffect, useState } from 'react'

const getTregState = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  return {
    id: window.treg?.identity?.id,
    core: window.treg?.realm?.core,
    iframeProfile: window.treg?.realm?.iframeProfile,
  }
}

const CustomLogin = () => {
  const [treg, setTreg] = useState({})

  useEffect(() => {
    const updateTreg = () => {
      const nextState = getTregState()
      setTreg((currentState) =>
        currentState.id === nextState.id &&
        currentState.core === nextState.core &&
        currentState.iframeProfile === nextState.iframeProfile
          ? currentState
          : nextState,
      )
    }

    updateTreg()
    const interval = window.setInterval(updateTreg, 500)
    const timeout = window.setTimeout(() => window.clearInterval(interval), 10000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [])

  const handleSignIn = (event) => {
    if (!treg.core) {
      return
    }

    treg.core.login()
    event.preventDefault()
    event.stopPropagation()
  }

  const handleAccount = (event) => {
    if (!treg.iframeProfile) {
      return
    }

    treg.iframeProfile.NavigateToIndex()
    event.preventDefault()
    event.stopPropagation()
  }

  if (treg.id !== undefined && treg.id !== null) {
    return (
      <a href='#account' onClick={handleAccount}>
        Account
      </a>
    )
  }

  return (
    <>
      <a href='#sign-in' onClick={handleSignIn}>
        Sign in
      </a>{' '}
      or{' '}
      <a href='/subscribe' rel='noopener noreferrer' target='_blank'>
        Subscribe
      </a>
    </>
  )
}

export default CustomLogin
