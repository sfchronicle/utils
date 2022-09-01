function scrollToTarget(target) {
  // might need to adjust this offset
  let targetOffset = document.querySelector(target).offsetTop - 45
  window.scroll({
    left: 0,
    top: targetOffset,
    behavior: 'smooth',
  })
}

export { scrollToTarget }