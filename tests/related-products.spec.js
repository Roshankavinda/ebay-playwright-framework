const { test, expect } = require('@playwright/test');
const { ProductPage } = require('../pages/productPage');
const data = require('../utils/testData');

test.describe('eBay related products / best seller section', () => {
  test.beforeEach(async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.searchProduct(data.searchKeyword);
    await productPage.openFirstRelevantProduct();
    await productPage.waitForProductPage();
  });

  test('RP-01: related products section is displayed on wallet product page', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.scrollToRelatedSection();
    await expect(productPage.relatedSection).toBeVisible();
  });

  test('RP-02: no more than 6 related products are displayed', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cards = await productPage.getDistinctRelatedCards(data.maxRelatedItems + 2);
    expect(cards.length).toBeLessThanOrEqual(data.maxRelatedItems);
  });

  test('RP-03: related products remain in the same category family as wallet', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cards = await productPage.getDistinctRelatedCards(3);
    expect(cards.length).toBeGreaterThan(0);

    for (const card of cards) {
      await page.goto(card.href);
      await productPage.waitForProductPage();
      const breadcrumbText = await productPage.getBreadcrumbText();
      expect(breadcrumbText).toContain(data.allowedCategoryKeyword);
    }
  });

  test('RP-04: related product price stays within +/-20% of main product price', async ({ page }) => {
    const productPage = new ProductPage(page);
    const basePrice = await productPage.getMainPriceNumber();
    const cards = await productPage.getDistinctRelatedCards(3);
    expect(cards.length).toBeGreaterThan(0);

    for (const card of cards) {
      await page.goto(card.href);
      await productPage.waitForProductPage();
      const relatedPrice = await productPage.getMainPriceNumber();
      expect(
        productPage.isWithinPriceRange(basePrice, relatedPrice, data.priceVariancePercent),
        `Expected ${relatedPrice} to be within +/-${data.priceVariancePercent}% of ${basePrice}`
      ).toBeTruthy();
    }
  });

  test('RP-05: clicking a related product opens the correct product page', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.scrollToRelatedSection();

    const target = await productPage.getDistinctRelatedCards(1);
    expect(target.length).toBe(1);

    const firstCard = target[0];
    const context = await productPage.openRelatedCardAndReturnContext(firstCard.index);

    expect(page.url()).toContain('/itm/');
    expect(page.url()).toContain(context.href.split('/itm/')[1].split('?')[0]);
  });

  test('RP-07: each related card shows the mandatory fields', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.scrollToRelatedSection();
    const cards = await productPage.getDistinctRelatedCards(3);
    expect(cards.length).toBeGreaterThan(0);

    for (const card of cards) {
      const item = productPage.relatedCards.nth(card.index);
      await expect(item.locator('img').first()).toBeVisible();
      await expect(item).toContainText(/.+/);
    }
  });
});
