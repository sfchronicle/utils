import React, { useRef, useState, useEffect } from "react";
import { trackEvent } from "./helpers/utilfunctions.mjs";
import * as geocoderStyles from "../styles/modules/geocoder.module.less";

// This is a singleton event listener that we can use to add/remove event listeners
// Don't call it during SSR
var setSingletonEventListener = (function (element) {
  var handlers = {};
  return function (evtName, func) {
    handlers.hasOwnProperty(evtName) &&
      element.removeEventListener(evtName, handlers[evtName]);
    if (func) {
      handlers[evtName] = func;
      element.addEventListener(evtName, func);
    } else {
      delete handlers[evtName];
    }
  };
})(typeof document !== "undefined" && document);

// Our new and improved geocoder! Hits PositionStack first and then falls back to classic geocoder
// Accepts a region to filter results by -- this can be custom but if it's not passed in, it will default to the state where the market resides
const Geocoder = ({
  filterRegion, // You need to test results, but could also pass in a neighbourhood, district, city, county, state or administrative area
  market, // Will filter by the market's state if no filterRegion provided
  resultFunc,
  placeholder,
  inputValueOverride, // Used to clear/change the input value from the parent component
  buttonTrackingId = "SelectAnAddress", // A string sent as part of the onClick tracking event - can be used as an 'id' of sorts (e.g. "ScriptTool")
}) => {
  // Show a loader when we're requesting
  const [loading, setLoading] = useState(false);
  const [locData, setLocData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [activeKeyboardIndex, setActiveKeyboardIndex] = useState(null);
  const resultsRef = useRef(null);
  const geocoderInputRef = useRef(null);
  const latestFetchRef = useRef(null);

  if (!filterRegion) {
    switch (market) {
      case "SFC":
        filterRegion = "California";
        break;
      case "Houston":
      case "SanAntonio":
      case "Austin":
        filterRegion = "Texas";
        break;
      case "Albany":
        filterRegion = "New York";
        break;
      case "CT":
        filterRegion = "Connecticut";
        break;
      default:
        filterRegion = "United States";
    }
  }

  // We don't want this CONSTANTLY firing, so we debounce it
  const search = async (query) => {
    // Save value of query so we can check if it's the last one
    latestFetchRef.current = query;
    // If we're already loading, don't fire another request, the request will be re-requested after the first one finishes
    if (loading) {
      return false;
    }
    // POST as form url encoded data
    let formData = new FormData();
    formData.append("query", query);
    if (filterRegion != "United States") {
      formData.append("region", filterRegion);
    }
    // Remove any existing event listeners
    setSingletonEventListener("keydown");
    // Wait for a sec to check if we're still typing
    await new Promise((resolve) => setTimeout(resolve, 500)); // We can increase this timeout to ease up on requests too
    // If query doesn't match, we're still typing -- reset
    if (latestFetchRef.current !== query) {
      search(latestFetchRef.current);
      return;
    }
    // We've settled, make the req
    const resp = await fetch(
      "https://projects.sfchronicle.com/feeds/geocode/v2.php",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!resp || !resp.ok) {
      return null;
    }
    const output = await resp.json();
    // If this is not the latest fetch after we finished getting results, bail and fetch latest
    if (latestFetchRef.current !== query) {
      search(latestFetchRef.current);
      return;
    }
    // Unset loading
    setLoading(false);
    // Remove any existing event listeners
    setSingletonEventListener("keydown");
    // Show results
    setLocData(output.data);
    // Bail early if there's no data
    if (!output) {
      return false;
    }
    if (output.data.length === 0) {
      // We could show something saying "No results" ... or we could not
      if (output.fallback) {
        // If we're using the fallback, we need to encourage the user to enter city
        setLocData([{ name: "No results, make sure to include city name" }]);
      }
    } else {
      // Create a keydown event listener
      setSingletonEventListener("keydown", function resultsKeyHandler(e) {
        setActiveKeyboardIndex((prevIndex) => {
          let newIndex = prevIndex;
          switch (e.key) {
            case "ArrowDown":
              // Handle the index
              if (prevIndex === null) {
                newIndex = 0;
              } else if (prevIndex < output.data.length - 1) {
                newIndex = prevIndex + 1;
              } else {
                newIndex = 0;
              }
              break;
            case "ArrowUp":
              // Handle the index
              if (prevIndex === null) {
                newIndex = output.data.length - 1;
              } else if (prevIndex > 0) {
                newIndex = prevIndex - 1;
              } else {
                newIndex = output.data.length - 1;
              }
              break;
            case "Enter":
              // Do something with the data
              const selectedLocation = output.data[prevIndex];
              // Update the input value with the choice
              if (selectedLocation) {
                setInputValue(selectedLocation.name);
                // Call function if it exists
                if (resultFunc) {
                  resultFunc(selectedLocation);
                }
                trackEvent("Click", "Dropdown", "Geocoder", buttonTrackingId);
              }
              // Hide the list now
              setLocData(null);
          }
          return newIndex;
        });
      });

      // Start listening for a click outside the div
      document.addEventListener("click", function resultsClickHandler(e) {
        // Whether we clicked inside or outside, we hide the list
        setLocData(null);
        // Also cancel the keydown listener
        setSingletonEventListener("keydown");
        // Received click, cancel this listener
        this.removeEventListener("click", resultsClickHandler);
      });
    }
  };

  // Handle the change event
  const handleChange = (event) => {
    // Set the input value
    const inputValue = event.target.value;
    setInputValue(inputValue);
    setActiveKeyboardIndex(null);
    // Only query if the value is not empty
    if (inputValue) {
      setLoading(true);
      search(inputValue);
    }
  };

  // If the parent component passes in a string for inputValueOverride, use it
  useEffect(() => {
    if (
      typeof inputValueOverride === "string" ||
      inputValueOverride instanceof String
    ) {
      setInputValue(inputValueOverride);
    }
  }, [inputValueOverride]);

  return (
    <div className={geocoderStyles.wrapper}>
      <div className={geocoderStyles.icon} />
      <input
        ref={geocoderInputRef}
        className={geocoderStyles.input}
        placeholder={placeholder ? placeholder : "Enter an address"}
        name="address"
        onChange={handleChange}
        value={inputValue}
      />
      {loading && (
        <img src="https://projects.sfchronicle.com/shared/logos/loading.gif" />
      )}
      {locData && (
        <ul className={geocoderStyles.resultsWrapper} ref={resultsRef}>
          {locData.map((loc, i) => {
            let thisClass = geocoderStyles.result;
            if (activeKeyboardIndex === i) {
              thisClass += " " + geocoderStyles.active;
            }
            return (
              <li
                className={thisClass}
                key={i}
                onClick={() => {
                  if (
                    locData[i].name.toLowerCase().indexOf("no results") > -1
                  ) {
                    return false;
                  }
                  setInputValue(locData[i].name);
                  // Call function if it exists
                  if (resultFunc) {
                    resultFunc(locData[i]);
                  }
                  trackEvent("Click", "Dropdown", "Geocoder", buttonTrackingId);
                }}
              >
                <button
                  className={geocoderStyles.button}
                  onFocus={(e) => {
                    // Set index
                    setActiveKeyboardIndex(i);
                  }}
                >
                  <div className={geocoderStyles.name}>{loc.name}</div>
                  {(loc.locality || loc.region) && (
                    <div className={geocoderStyles.details}>
                      {loc.locality}
                      {loc.locality && loc.region && ", "}
                      {loc.region}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Geocoder;
