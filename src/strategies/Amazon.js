const webdriver = require("selenium-webdriver");
const { AMAZON_WEB_DRIVER_ID } = require("../utils/constant");
const { AMAZON_URL } = require("../utils/constant");
const { pushToFireBase } = require("../utils/helpers");
const { ScrapingStrategy } = require("./Scraping/Scraping");
const { LOCALHOST_ADDRESS } = require("../utils/constant");
let { driver } = require("./configs/selenium");

const AmazonScrapStrategy = function (searchString, matchCase, capabilities) {}; // every strategy should have it's own place
AmazonScrapStrategy.prototype = Object.create(ScrapingStrategy.prototype);
AmazonScrapStrategy.prototype.scrap = async function (
  searchString,
  matchCase,
  capabilities
) {
  driver = new webdriver.Builder()
    .usingServer(LOCALHOST_ADDRESS)
    .withCapabilities(capabilities)
    .build();
  await driver.get(AMAZON_URL);
  const searchBox = await driver.findElement(
    webdriver.By.id(AMAZON_WEB_DRIVER_ID)
  );
  await searchBox.sendKeys(searchString, webdriver.Key.ENTER);
  const searchResults = await driver.findElements(
    webdriver.By.css("div[data-asin]")
  );

  let matches = 0;
  const amazonArray = [];
  for (const searchResult of searchResults) {
    try {
      const element = await searchResult.findElement(
        webdriver.By.className(`a-link-normal a-text-normal`)
      );

      const productName = (await element.getText()).toString();
      const productLink = await element.getAttribute("href");
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

module.exports = {
    AmazonScrapStrategy,
};