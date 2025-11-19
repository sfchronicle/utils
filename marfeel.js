// Handle returning the right Marfeel market given the MARKET_KEY
let getMarfeelMarket = function (MARKET_KEY) {
  let marfeelMarket = ""; // Default

  // Set market based on MARKET_KEY
  switch (MARKET_KEY) {
    case "SFC":
    case "SFGate":
      marfeelMarket = "San Francisco";
      break;
    case "Chron":
    case "Houston":
      marfeelMarket = "Houston";
      break;
    case "SanAntonio":
    case "MySA":
      marfeelMarket = "San Antonio";
      break;
    case "Austin":
      marfeelMarket = "Austin";
      break;
    case "Dallas":
      marfeelMarket = "Dallas";
      break;
    case "Texcom":
    case "Conroe":
      marfeelMarket = "Communities";
      break;
    case "CT":
      marfeelMarket = "Connecticut";
      break;
    case "Albany":
      marfeelMarket = "Albany";
      break;
  }

  return marfeelMarket;
};

module.exports = { getMarfeelMarket };

