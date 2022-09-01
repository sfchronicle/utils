// use as callback function with useSWR to grab data from apis

function getData(url) {
  return fetch(url).then((response) => response.json())
}

export { getData }
