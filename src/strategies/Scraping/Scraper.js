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