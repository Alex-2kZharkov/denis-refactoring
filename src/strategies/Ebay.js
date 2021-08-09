const webdriver = require("selenium-webdriver");
const {pushToFireBase} = require("../utils/helpers");
const {ScrapingStrategy} = require("./Scraping");

let {driver} = require('./configs/selenium')

const EBayScrapStrategy = function (searchString, matchCase, capabilities) {};
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