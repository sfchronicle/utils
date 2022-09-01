/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

 var {requestImage} = require("./tasks/node-helpers");

// Import all the WCM photos you'd like to use in this project
// NOTE: Leave this as an empty array if you aren't importing any WCM photos, but you won't be able to use the WCMImage component
const wcmPhotos = [20374215]

// Create nodes so GraphQL can access
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions

  // Request and push photo data into an array
  const photoData = [];
  wcmPhotos.forEach((url) => {
    photoData.push(requestImage(url))
  })

  // Take the ratios/ids turn them into graphql nodes
  await Promise.all(photoData).then((values) => {
    values.forEach((photo) => {
      const type = "wcmPhotos";
      createNode({
        photo,
        id: createNodeId(`${type}${photo.wcmid}`),
        parent: null,
        children: [],
        internal: {
          contentDigest: createContentDigest(photo),
          type,
        },
      })
    })
    return
  })
  return
}
