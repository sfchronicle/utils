// NOTE: This will only work on a deployed URL!
// To get the stored value back, get it from "existingValue"
const getProfileProperty = (property) => {
  return new Promise((resolve, reject) => {
    if (window) {
      let attempts = 0;
      const checkForBlueConic = (innerResolve) => {
        if (window.blueConicClient) {
          const profile = window.blueConicClient.profile.getProfile();
          // Check if property is an array
          let properties = [];
          if (Array.isArray(property)) {
            properties = property;
          } else {
            properties = [property];
          }
          profile.loadValues(properties, this, function () {
            var value = profile.getValue(property);
            // Return a valid result or null
            value = value || null;
            console.log("getProfileProperty VAL", value);
            innerResolve({ existingValue: value, profile: profile });
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
        // Prepare merging (note: this only handles objects, not arrays or other types)
        const thisPromise = getProfileProperty(property);

        thisPromise.then(({ existingValue, profile }) => {
          console.log(
            "Output data",
            existingValue,
            "New value coming in",
            value
          );
          // Finish merging
          if (merge && typeof value === "object") {
            value = JSON.stringify(
              Object.assign({}, JSON.parse(existingValue), value)
            );
            console.log("Merged value", value);
          }
          // Make sure property to save is a string
          // If object, stringify it
          if (typeof value === "object") {
            value = JSON.stringify(value);
          } else if (typeof value === "boolean" || typeof value === "number") {
            value = value.toString();
          }
          // Profile is already loaded from the getProfileProperty call
          profile.setValue(property, value);
          window.blueConicClient.profile.updateProfile();
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

const clearProfileProperty = (property) => {
  return new Promise((resolve, reject) => {
    if (window) {
      if (window.blueConicClient) {
        const profile = window.blueConicClient.profile.getProfile();
        const properties = [property];
        profile.loadValues(properties, this, function () {
          profile.setValue(property, ""); // Empty string to clear
          window.blueConicClient.profile.updateProfile();
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

module.exports = {
  getProfileProperty,
  setProfileProperty,
  clearProfileProperty,
};
