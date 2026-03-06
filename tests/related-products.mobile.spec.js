const { test, expect } = require('@playwright/test');
const { ProductPage } = require('../pages/productPage');
const data = require('../utils/testData');

test('RP-09: related products section is usable in mobile viewport', async ({ page }) => {
  const productPage = new ProductPage(page);

  await productPage.searchProduct(data.searchKeyword);
  await productPage.openFirstRelevantProduct();
  await productPage.waitForProductPage();
  await productPage.scrollToRelatedSection();

  const cards = await productPage.getDistinctRelatedCards(3);
  expect(cards.length).toBeGreaterThan(0);

  for (const card of cards) {
    await expect(productPage.relatedCards.nth(card.index)).toBeVisible();
  }
});
