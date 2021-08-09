const webdriver = require("selenium-webdriver");
const {EBAY_WEB_DRIVER_ID} = require("../utils/constant");
const {EBAY_URL} = require("../utils/constant");
const {LOCALHOST_ADDRESS} = require("../utils/constant");
const {pushToFireBase} = require("../utils/helpers");
const {ScrapingStrategy} = require("./Scraping");
let {driver} = require('./configs/selenium')

const EBayScrapStrategy = function (searchString, matchCase, capabilities) {}; // every strategy should have it's own place
EBayScrapStrategy.prototype = Object.create(ScrapingStrategy.prototype);
EBayScrapStrategy.prototype.scrap = async function (
    searchString,
    matchCase,
    capabilities
) {
    driver = new webdriver.Builder()
        .usingServer(LOCALHOST_ADDRESS)
        .withCapabilities(capabilities)
        .build();
    await driver.get(EBAY_URL);
    const searchBox = await driver.findElement(webdriver.By.id(EBAY_WEB_DRIVER_ID));
    await searchBox.sendKeys(searchString, webdriver.Key.ENTER);
    const searchResults = await driver.findElements(
        webdriver.By.className("s-item__wrapper clearfix")
    );

    let matches = 0;
    const eBayArray = [];
    for (const searchResult of searchResults) {
        try {
            const element = await searchResult.findElement(
                webdriver.By.className(`s-item__link`)
            );

            const productName = (await element.getText()).toString();
            const productLink = await element.getAttribute("href");
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
    }
    await driver.quit();
    console.log(`Pavilions count on eBay: ${matches}`);
    await pushToFireBase(eBayArray);
};