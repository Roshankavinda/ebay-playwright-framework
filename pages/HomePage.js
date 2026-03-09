const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    this.productLinks = page.locator('a[href*="/itm/"]');
  }

  async openSearchResults(keyword) {
    await this.page.goto(`https://www.ebay.com/sch/i.html?_nkw=${keyword}`, {
      waitUntil: 'domcontentloaded'
    });

    await this.handleConsentIfPresent();
    await this.page.waitForLoadState('domcontentloaded');

    await expect(this.page).toHaveURL(/_nkw=/);

    await this.productLinks.first().waitFor({
      state: 'attached',
      timeout: 20000
    });
  }

  async handleConsentIfPresent() {
    const acceptButton = this.page.locator(
      'button:has-text("Accept"), button:has-text("I agree"), #gdpr-banner-accept'
    ).first();

    try {
      if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
      }
    } catch (error) {
    }
  }

  async getCandidateProductUrls(limit = 8) {
    const urls = [];
    const count = await this.productLinks.count();

    for (let i = 0; i < count && urls.length < limit; i++) {
      const href = await this.productLinks.nth(i).getAttribute('href');

      if (
        href &&
        href.includes('/itm/') &&
        !href.includes('var=') &&
        !href.includes('p2349624') &&
        !urls.includes(href)
      ) {
        urls.push(href);
      }
    }

    if (urls.length === 0) {
      throw new Error('No valid product URLs found on search results page.');
    }

    return urls;
  }
}

module.exports = HomePage;