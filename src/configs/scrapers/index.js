const { EBAY_WEB_DRIVER_ID } = require("../../utils/constant");
const { EBAY_URL } = require("../../utils/constant");
const { AMAZON_WEB_DRIVER_ID } = require("../../utils/constant");
const { LOCALHOST_ADDRESS } = require("../../utils/constant");
const { AMAZON_URL } = require("../../utils/constant");

const eBayScraperConfigs = {
  searchString: "Hp laptop",
  matchCase: "pavilion",
  localhostUrl: LOCALHOST_ADDRESS,
  siteUrl: EBAY_URL,
  driverId: EBAY_WEB_DRIVER_ID,
  cssClasses: {
    divClass: "s-item__wrapper clearfix",
    linkClass: "s-item__link",
  },
  storeName: "eBay",
};
const amazonScraperConfigs = {
  searchString: "Hp laptop",
  matchCase: "pavilion",
  localhostUrl: LOCALHOST_ADDRESS,
  siteUrl: AMAZON_URL,
  driverId: AMAZON_WEB_DRIVER_ID,
  cssClasses: {
    divClass: "div[data-asin]",
    linkClass: "a-link-normal a-text-normal",
  },
  storeName: "Amazon",
};

module.exports = {
  eBayScraperConfigs,
  amazonScraperConfigs,
};
