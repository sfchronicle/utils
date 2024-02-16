// NOTE: This will only work on a deployed URL!
const getProfileProperty = (property) => {
  return new Promise((resolve, reject) => {
    if (window) {
      let attempts = 0;
      const checkForBlueConic = (innerResolve) => {
        if (window.blueConicClient) {
          const profile = window.blueConicClient.profile.getProfile();
          const properties = [property];
          profile.loadValues(properties, this, function () {
            var value = profile.getValue(property);
            // Return a valid result or null
            value = value || null;
            console.log("getProfileProperty VAL", value);
            innerResolve(value);
          });
        } else {
          attempts++;
          if (attempts < 20) {
            // Check for BlueConic every second
            setTimeout(() => {
              checkForBlueConic(innerResolve);
            }, 1000);
          } else {
            innerResolve(
              "Personalize: No BlueConic client found after many attempts"
            );
          }
        }
      };
      // Kick off check
      checkForBlueConic(resolve);
    } else {
      resolve("Personalize: No window found");
    }
  });
};

const setProfileProperty = (property, value, merge = false) => {
  return new Promise((resolve, reject) => {
    if (window) {
      if (window.blueConicClient) {
        // Prepare merging
        let conditionalPromise = Promise.resolve();
        if (merge && typeof value === "object") {
          conditionalPromise = getProfileProperty(property);
        }

        conditionalPromise.then((existingValue) => {
          // Finish merging
          if (merge && typeof value === "object") {
            console.log("Merging values...", existingValue, value);
            value = JSON.stringify({ ...existingValue, ...value });
            console.log("Merged value", value);
          }
          // Make sure property to save is a string
          // If object, stringify it
          if (typeof value === "object") {
            value = JSON.stringify(value);
          } else if (typeof value === "boolean" || typeof value === "number") {
            value = value.toString();
          }

          const profile = window.blueConicClient.profile.getProfile();
          const properties = [property];
          profile.loadValues(properties, this, function () {
            profile.setValue(property, value);
            resolve(true);
          });
        });
      } else {
        resolve("Personalize: No BlueConic client found");
      }
    } else {
      resolve("Personalize: No window found");
    }
  });
};

module.exports = { getProfileProperty, setProfileProperty };
