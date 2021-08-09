const {scrape} = require("./scrapers");
const { eBayScraperConfigs } = require("./configs/scrapers");
const { amazonScraperConfigs } = require("./configs/scrapers");
const { NO_CONCURRENT_BROWSERS } = require("./utils/constant");
const {
  capabilitiesChrome,
  capabilitiesFirefox, // moving configs to their own folders
} = require("./configs/capabilities");


for (let i = 0; i < NO_CONCURRENT_BROWSERS; i++) {
  const caps =
    i < NO_CONCURRENT_BROWSERS / 2 ? capabilitiesChrome : capabilitiesFirefox; // short version of condition ? true : false
  await scrape({ ...amazonScraperConfigs, capabilities: caps }); // {...} - creates new object, last property "capabilities" will rewrite already existed property "capabilities"
  await scrape({ ...eBayScraperConfigs, capabilities: caps });
}
