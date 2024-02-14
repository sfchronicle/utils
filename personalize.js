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

const setProfileProperty = (property, value) => {
  return new Promise((resolve, reject) => {
    if (window) {
      if (window.blueConicClient) {
        const profile = window.blueConicClient.profile.getProfile();
        const properties = [property];
        profile.loadValues(properties, this, function () {
          profile.setValue(property, value);
          resolve(true);
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
