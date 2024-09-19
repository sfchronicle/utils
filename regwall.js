// NOTE: Script meant to be called when the regwall is requested
// This script will listen for a successful registration, then run a function passed to it
const listenForRegSuccess = (resultFunc, resultParams) => {
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
                // Wait for element to leave view, run the provided function
                console.log("Element is out of view!");
                // Perform your action here
                resultFunc(resultParams);
                observer.disconnect();
                innerResolve(true);
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
            innerResolve("Regwall: No target found after many attempts");
          }
        }
      };
      // Kick off check
      checkForTarget(resolve);
    } else {
      resolve("Regwall: No window found");
    }
  });
};

module.exports = {
  listenForRegSuccess,
};
