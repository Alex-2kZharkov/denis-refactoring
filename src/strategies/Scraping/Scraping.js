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

module.exports = {
    ScrapingStrategy,
}