const webdriver = require("selenium-webdriver");
const { pushToFireBase } = require("../utils/helpers");
let { driver } = require("./configs/selenium");

const scrape = async ({
  // it's called object destructuring, you extract properties from passed object
  searchString,
  matchCase,
  capabilities,
  localhostUrl,
  siteUrl,
  driverId,
  cssClasses,
  storeName,
}) => {
  driver = new webdriver.Builder()
    .usingServer(localhostUrl)
    .withCapabilities(capabilities)
    .build();
  await driver.get(siteUrl);
  const searchBox = await driver.findElement(webdriver.By.id(driverId));
  await searchBox.sendKeys(searchString, webdriver.Key.ENTER);
  const searchResults = await driver.findElements(
    webdriver.By.css(cssClasses.divClass)
  );

  const amazonArray = [];
  for (const searchResult of searchResults) {
    try {
      const element = await searchResult.findElement(
        webdriver.By.className(cssClasses.linkClass)
      );
      const productName = await element.getText(); // getText should return text itself
      const productLink = await element.getAttribute("href");
      if (productName.toLowerCase().includes(matchCase)) {
        amazonArray.push({
          store: storeName,
          productName: productName,
          productLink: productLink,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  await driver.quit();
  await pushToFireBase(amazonArray);
};

module.exports = {
  scrape,
};
