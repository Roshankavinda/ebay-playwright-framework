const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;

    // Home page
    this.searchBox = page.locator('#gh-ac');
    this.searchButton = page.locator('#gh-search-btn');

    // Search results
    this.searchResultLinks = page.locator('a.s-item__link');
    this.productGrid = page.locator('a.s-item__link').first();

    // Product page
    this.productTitle = page.locator('h1');

    // Related section
    this.relatedSectionHeading = page.locator(
      'text=/Similar items|Shop similar products|People who viewed this item also viewed|You may also like/i'
    ).first();

    this.relatedProductLinks = page.locator(
      'a:has(img)'
    );
  }

  async goHome() {
    await this.page.goto('https://www.ebay.com/', {
      waitUntil: 'domcontentloaded'
    });
  }

  async closePopupIfVisible() {
    const closeButton = this.page.locator(
      'button[aria-label="Close"], button:has-text("Close"), button:has-text("✕")'
    ).first();

    try {
      if (await closeButton.isVisible({ timeout: 2000 })) {
        await closeButton.click();
      }
    } catch (e) {
      // ignore
    }
  }

  async searchProduct(keyword) {
    await this.goHome();

    await expect(this.searchBox).toBeVisible({ timeout: 15000 });
    await this.searchBox.fill(keyword);
    await this.searchButton.click();

    await this.page.waitForLoadState('domcontentloaded');
    await this.closePopupIfVisible();

    await expect(this.searchResultLinks.first()).toBeVisible({ timeout: 30000 });
  }

  async openFirstProduct() {
    const count = await this.searchResultLinks.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = this.searchResultLinks.nth(i);
      const href = await link.getAttribute('href');

      if (!href || !href.includes('/itm/')) {
        continue;
      }

      await link.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.closePopupIfVisible();

      try {
        await expect(this.productTitle.first()).toBeVisible({ timeout: 15000 });
        return;
      } catch (e) {
        await this.page.goBack();
        await this.page.waitForLoadState('domcontentloaded');
      }
    }

    throw new Error('No valid product page could be opened from search results.');
  }

  async searchAndOpenProduct(keyword) {
    await this.searchProduct(keyword);
    await this.openFirstProduct();
  }

  async getProductTitle() {
    await expect(this.productTitle.first()).toBeVisible({ timeout: 15000 });
    return ((await this.productTitle.first().textContent()) || '').trim();
  }

  async scrollToRelatedSection() {
    await this.closePopupIfVisible();

    await this.page.mouse.wheel(0, 1200);
    await this.page.waitForTimeout(2000);
    await this.page.mouse.wheel(0, 1200);
    await this.page.waitForTimeout(2000);
  }

  async isRelatedSectionVisible() {
    await this.scrollToRelatedSection();
    return await this.relatedSectionHeading.isVisible();
  }

  async getRelatedCount() {
    await this.scrollToRelatedSection();

    const heading = this.relatedSectionHeading;
    await expect(heading).toBeVisible({ timeout: 15000 });

    const section = heading.locator('xpath=ancestor::*[self::section or self::div][1]');
    const relatedLinks = section.locator('a:has(img)');

    return await relatedLinks.count();
  }

  async getRelatedCardTexts(limit = 6) {
    await this.scrollToRelatedSection();

    const heading = this.relatedSectionHeading;
    await expect(heading).toBeVisible({ timeout: 15000 });

    const section = heading.locator('xpath=ancestor::*[self::section or self::div][1]');
    const relatedLinks = section.locator('a:has(img)');

    const count = await relatedLinks.count();
    const texts = [];

    for (let i = 0; i < Math.min(count, limit); i++) {
      const text = await relatedLinks.nth(i).textContent();
      texts.push((text || '').trim());
    }

    return texts;
  }

  async clickFirstRelatedProduct() {
    await this.scrollToRelatedSection();

    const heading = this.relatedSectionHeading;
    await expect(heading).toBeVisible({ timeout: 15000 });

    const section = heading.locator('xpath=ancestor::*[self::section or self::div][1]');
    const relatedLinks = section.locator('a:has(img)');

    await expect(relatedLinks.first()).toBeVisible({ timeout: 15000 });
    await relatedLinks.first().click();

    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.productTitle.first()).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { ProductPage };