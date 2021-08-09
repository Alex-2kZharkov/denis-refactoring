//#region Init
const {NO_CONCURRENT_BROWSERS} = require("./utils/constant");
const {
  capabilitiesChrome,
  capabilitiesFirefox, // moving configs to their own folders
} = require("./configs/capabilities");
const {AmazonScrapStrategy} = require("./strategies/Amazon");
const {EBayScrapStrategy} = require("./strategies/Ebay");
const eBayScraper = new Scraper(new EBayScrapStrategy());
const amazonScraper = new Scraper(new AmazonScrapStrategy());

for (let i = 0; i < NO_CONCURRENT_BROWSERS; i++) {
  const caps = i < 5 ? capabilitiesChrome : capabilitiesFirefox; // condition ? true : false
  await eBayScraper.start("Hp laptop", "pavilion", caps);
  await amazonScraper.start("Hp laptop", "pavilion", caps);
}




