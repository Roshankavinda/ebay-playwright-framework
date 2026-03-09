const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;
    this.productTitle = page.locator('h1').first();
  }

  async openProduct(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyProductPageLoaded() {
    await expect(this.productTitle).toBeVisible({ timeout: 15000 });
  }

  async getRelatedSection() {
    const selectors = [
      'section:has-text("Similar items")',
      'section:has-text("Related items")',
      'section:has-text("You may also like")',
      'section:has-text("People who viewed this item also viewed")',
      'section:has-text("Sponsored items customers also viewed")',
      'section:has-text("Customers also viewed")',
      'div:has-text("Similar items")',
      'div:has-text("Related items")',
      'div:has-text("You may also like")',
      'div:has-text("People who viewed this item also viewed")',
      'div:has-text("Sponsored items customers also viewed")',
      'div:has-text("Customers also viewed")'
    ];

    for (const selector of selectors) {
      const section = this.page.locator(selector).first();

      if (await section.count()) {
        try {
          if (await section.isVisible({ timeout: 2000 })) {
            return section;
          }
        } catch (error) {
          // try next selector
        }
      }
    }

    return null;
  }

  async hasRelatedSection() {
    const section = await this.getRelatedSection();
    return section !== null;
  }

  async verifyRelatedSectionVisible() {
    const section = await this.getRelatedSection();

    if (!section) {
      throw new Error('Related products section not found on product page.');
    }

    await expect(section).toBeVisible();
  }

  async getRelatedProductLinks() {
    const section = await this.getRelatedSection();

    if (!section) {
      throw new Error('Related products section not found on product page.');
    }

    const links = section.locator('a[href*="/itm/"]');
    const count = await links.count();

    if (count === 0) {
      throw new Error('No related product links found inside related section.');
    }

    return links;
  }

  async verifyAtLeastOneRelatedProductVisible() {
    const links = await this.getRelatedProductLinks();
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyRelatedItemsHaveBasicDetails() {
    const links = await this.getRelatedProductLinks();
    const count = await links.count();

    expect(count).toBeGreaterThan(0);

    const itemsToCheck = Math.min(count, 3);

    for (let i = 0; i < itemsToCheck; i++) {
      const item = links.nth(i);

      await expect(item).toBeVisible();

      const href = await item.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('/itm/');
    }
  }

  async getCurrentProductTitle() {
    return ((await this.productTitle.textContent()) || '').trim();
  }

  async clickFirstRelatedProduct() {
    const links = await this.getRelatedProductLinks();
    const href = await links.first().getAttribute('href');

    if (!href) {
      throw new Error('First related product href is empty.');
    }

    await this.page.goto(href, { waitUntil: 'domcontentloaded' });
  }

  async verifyNavigationAfterRelatedProductClick(oldUrl, oldTitle) {
    await expect(this.page).not.toHaveURL(oldUrl);
    await expect(this.productTitle).toBeVisible();

    const newTitle = ((await this.productTitle.textContent()) || '').trim();
    expect(newTitle.length).toBeGreaterThan(0);
    expect(newTitle).not.toBe(oldTitle);
  }
}

module.exports = ProductPage;