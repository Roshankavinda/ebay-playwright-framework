const { test, expect } = require('@playwright/test');
const { ProductPage } = require('../pages/productPage');
const data = require('../utils/testData');

test.describe('eBay Related Products - Wallet Scenario', () => {
  test.beforeEach(async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.searchAndOpenProduct(data.searchKeyword);
  });

  test('TC01 - Related products section should be visible', async ({ page }) => {
    const productPage = new ProductPage(page);
    await expect(await productPage.isRelatedSectionVisible()).toBeTruthy();
  });

  test('TC02 - Related products should display items', async ({ page }) => {
    const productPage = new ProductPage(page);
    const count = await productPage.getRelatedCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC03 - Maximum related products should not exceed 6', async ({ page }) => {
    const productPage = new ProductPage(page);
    const count = await productPage.getRelatedCount();
    expect(count).toBeLessThanOrEqual(6);
  });

  test('TC04 - Related products should contain wallet related text', async ({ page }) => {
    const productPage = new ProductPage(page);
    const texts = await productPage.getRelatedCardTexts(6);

    const hasWalletText = texts.some(text =>
      text.toLowerCase().includes('wallet')
    );

    expect(hasWalletText).toBeTruthy();
  });

  test('TC05 - Clicking related product should open product page', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.clickFirstRelatedProduct();

    const title = await productPage.getProductTitle();
    expect(title.length).toBeGreaterThan(0);
  });
});