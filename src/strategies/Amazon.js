const webdriver = require("selenium-webdriver");
const {ScrapingStrategy} = require("./Scraping");
let {driver} = require('./configs/selenium')


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