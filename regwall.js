// NOTE: Script meant to be called when the regwall is requested
// This script will listen for a successful registration, then run a function passed to it
const listenForRegSuccess = () => {
  return new Promise((resolve, reject) => {
    if (window) {
      let attempts = 0;
      const checkForTarget = (innerResolve) => {
        // Select the target element
        const targetElement = document.querySelector(".bc_regwall_box");
        if (targetElement) {
          // Set up intersection observer
          // Define the callback function
          const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                // Disconnect the observer
                observer.disconnect();
                // Check the dataLayer for a successful registration (the regwall sends the event to GA)
                const dataLayer = window.dataLayer;
                let foundRegSuccess = false;
                if (dataLayer && dataLayer.length) {
                  for (let i = 0; i < dataLayer.length; i++) {
                    // Make sure this item is not an array
                    if (Array.isArray(dataLayer[i])) {
                      continue;
                    }
                    if (
                      dataLayer[i].label &&
                      dataLayer[i].label.indexOf("Successfull Submission") > -1
                    ) {
                      foundRegSuccess = true;
                      break;
                    }
                  }
                }
                if (foundRegSuccess) {
                  // Perform your action here
                  console.log("Registration successful!");
                  innerResolve(true);
                } else {
                  console.log("User did not register");
                  innerResolve(false);
                }
              }
            });
          };

          // Create a new IntersectionObserver
          const observerOptions = {
            root: null, // Use the viewport as the root
            threshold: 0, // 0 means trigger when the element is out of view
          };
          const observer = new IntersectionObserver(
            observerCallback,
            observerOptions
          );

          // Start observing the target element
          observer.observe(targetElement);
        } else {
          // If the target element isn't found, try again
          attempts++;
          if (attempts < 20) {
            // Check for target every second
            setTimeout(() => {
              checkForTarget(innerResolve);
            }, 200);
          } else {
            console.log("Regwall: Target element not found after attempts");
            innerResolve(false);
          }
        }
      };
      // Kick off check after a short delay
      setTimeout(() => {
        checkForTarget(resolve);
      }, 200);
    } else {
      console.log("Regwall: No window found");
      resolve(false);
    }
  });
};

module.exports = {
  listenForRegSuccess,
};
