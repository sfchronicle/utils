// NOTE: This will only work on a deployed URL!
const getProfileProperty = (property) => {
  return new Promise((resolve, reject) => {
    if (window) {
      if (window.blueConicClient) {
        const profile = window.blueConicClient.profile.getProfile();
        const properties = [property];
        profile.loadValues(properties, this, function () {
          var value = profile.getValue(property);
          // Return a valid result or null
          value = value || null;
          console.log("getProfileProperty VAL", value);
          resolve(value);
        });
      } else {
        resolve("Personalize: No BlueConic client found");
      }
      resolve("Personalize: No window found");
    }
  });
};

const setProfileProperty = (property, value) => {
  if (window) {
    if (window.blueConicClient) {
      const profile = window.blueConicClient.profile.getProfile();
      const properties = [property];
      profile.loadValues(properties, this, function () {
        profile.setValue(property, value);
        return true;
      });
    } else {
      return "Personalize: No BlueConic client found";
    }
  }
};

module.exports = { getProfileProperty, setProfileProperty };
