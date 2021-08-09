//#region Init
const {
  capabilitiesChrome,
  capabilitiesFirefox,
  capabilitiesEdge, // moving configs to their own folders
} = require("./configs/capabilities");
const uuid = require("uuid");
const webdriver = require("selenium-webdriver");
const {pushToFireBase} = require("./utils/helpers");
const {db} = require('./configs/firebase');
let {driver} = require('./configs/selenium')

const Scraper = function (strategy) {
  this.strategy = strategy;
};
Scraper.prototype.start = async function (
  searchString,
  matchCase,
  capabilities
) {
  return await this.strategy.execute(searchString, matchCase, capabilities);
};


//#endregion

const eBayScraper = new Scraper(new EBayScrapStrategy());
const amazonScraper = new Scraper(new AmazonScrapStrategy());
let caps;
for (let i = 0; i < 10; i++) {
  if (i < 5) {
    caps = capabilitiesChrome;
  } else if (i >= 5 && i < 10) {
    caps = capabilitiesFirefox;
  }
  await eBayScraper.start("Hp laptop", "pavilion", caps);
  await amazonScraper.start("Hp laptop", "pavilion", caps);
}




