//#region Init
const {
  capabilitiesChrome,
  capabilitiesFirefox,
  capabilitiesEdge, // moving configs to their own folders
} = require("./configs/capabilities");
const uuid = require("uuid");
const webdriver = require("selenium-webdriver");
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


const Strategy = function () {};
const ScrapingStrategy = async function (
  searchString,
  matchCase,
  capabilities
) {};


ScrapingStrategy.prototype = Object.create(Strategy.prototype);
ScrapingStrategy.prototype.execute = async function (
  searchString,
  matchCase,
  capabilities
) {
  return await this.scrap(searchString, matchCase, capabilities);
};


const AmazonScrapStrategy = function (searchString, matchCase, capabilities) {};
AmazonScrapStrategy.prototype = Object.create(ScrapingStrategy.prototype);
AmazonScrapStrategy.prototype.scrap = async function (
  searchString,
  matchCase,
  capabilities
) {
  driver = new webdriver.Builder()
    .usingServer("http://192.168.1.108:4000/wd/hub")
    .withCapabilities(capabilities)
    .build();
  await driver.get("https://www.amazon.com");
  const searchBox = await driver.findElement(
    webdriver.By.id("twotabsearchtextbox")
  );
  await searchBox.sendKeys(searchString, webdriver.Key.ENTER);
  const searchResults = await driver.findElements(
    webdriver.By.css("div[data-asin]")
  );

  let matches = 0;
  const amazonArray = [];
  for (const searchResult of searchResults) {
    try {
      const result = await searchResult.findElement(
        webdriver.By.className(`a-link-normal a-text-normal`)
      );

      const productName = (await result.getText()).toString();
      const productLink = await result.getAttribute("href");
      if (productName.toLowerCase().includes(matchCase)) {
        amazonArray.push({
          store: "Amazon",
          productName: productName,
          productLink: productLink,
        });
        console.log("Amazon: " + productName + " Link:" + productLink);
        matches++;
      }
    } catch (e) {
      console.log(e);
    }
  }
  await driver.quit();
  console.log(`Pavilions count on Amazon: ${matches}`);
  await pushToFireBase(amazonArray);
};

var EBayScrapStrategy = function (searchString, matchCase, capabilities) {};
EBayScrapStrategy.prototype = Object.create(ScrapingStrategy.prototype);
EBayScrapStrategy.prototype.scrap = async function (
  searchString,
  matchCase,
  capabilities
) {
  driver = new webdriver.Builder()
    .usingServer("http://192.168.1.108:4000/wd/hub")
    .withCapabilities(capabilities)
    .build();
  await driver.get("https://www.ebay.com");
  const searchBox = await driver.findElement(webdriver.By.id("gh-ac"));
  await searchBox.sendKeys(searchString, webdriver.Key.ENTER);
  const searchResults = await driver.findElements(
    webdriver.By.className("s-item__wrapper clearfix")
  );

  let matches = 0;
  let counter = 1;
  const eBayArray = [];
  for (const searchResult of searchResults) {
    try {
      const element = await searchResult.findElement(
        webdriver.By.className(`s-item__link`)
      );
      const productLink = await element.getAttribute("href");
      const productName = (await element.getText()).toString();
      if (productName.toLowerCase().includes(matchCase)) {
        eBayArray.push({
          store: "eBay",
          productName: productName,
          productLink: productLink,
        });
        console.log("eBay: " + productName + " Link:" + productLink);
        matches++;
      }
    } catch (e) {
      console.log(e);
    }
    counter++;
  }
  await driver.quit();
  console.log(`Pavilions count on eBay: ${matches}`);
  await pushToFireBase(eBayArray);
};
//#endregion

var eBayScraper = new Scraper(new EBayScrapStrategy());
var amazonScraper = new Scraper(new AmazonScrapStrategy());




let caps;
for (let i = 0; i < 10; i++) {
  if (i < 5) {
    caps = capabilitiesChrome;
  } else if (i >= 5 && i < 10) {
    caps = capabilitiesFirefox;
  }
  eBayScraper.start("Hp laptop", "pavilion", caps);
  amazonScraper.start("Hp laptop", "pavilion", caps);
}



async function pushToFireBase(productsArray) {
  const productsDb = db.collection("StoresToLaptops");
  var coll;
  for (const product of productsArray) {
    coll = productsDb.doc(uuid.v1());
    await coll.set({
      Store: product.store,
      Product: product.productName,
      Link: product.productLink,
    });
  }
}
