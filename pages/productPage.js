const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;

    // Home/search
    this.searchBox = page.locator('#gh-ac');
    this.searchButton = page.locator('#gh-search-btn');

    // Search results
    this.searchResults = page.locator('.srp-results .s-item');

    // Product page
    this.productTitle = page.locator('h1');
    this.productPrice = page.locator('.x-price-primary, .notranslate');

    // Related products / similar section
    this.relatedSection = page.locator(
      'section, div'
    ).filter({
      has: page.locator('text=/Related|similar|best seller|You may also like/i')
    }).first();

    this.relatedCards = this.relatedSection.locator('a, li, div').filter({
      has: page.locator('img')
    });
  }

  async goHome() {
    await this.page.goto('https://www.ebay.com/', { waitUntil: 'domcontentloaded' });
  }

  async searchProduct(searchKeyword) {
    await this.goHome();
    await expect(this.searchBox).toBeVisible();
    await this.searchBox.fill(searchKeyword);
    await this.searchButton.click();
    await expect(this.searchResults.first()).toBeVisible();
  }

  async openFirstResult() {
    const firstItem = this.searchResults.first().locator('a').first();
    await firstItem.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchAndOpenProduct(searchKeyword) {
    await this.searchProduct(searchKeyword);
    await this.openFirstResult();
    await expect(this.productTitle.first()).toBeVisible();
  }

  async getRelatedCount() {
    await expect(this.relatedSection).toBeVisible();
    return await this.relatedCards.count();
  }
}

module.exports = { ProductPage };