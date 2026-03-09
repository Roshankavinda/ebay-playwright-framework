const { test } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ProductPage = require('../pages/ProductPage');
const testData = require('../utils/testData');

test.describe('eBay Related Products - Simple Assignment Coverage', () => {
  let homePage;
  let productPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);

    await homePage.openSearchResults(testData.searchKeyword);
    await homePage.openFirstValidProduct();
    await productPage.verifyProductPageLoaded();
  });

  test('RP-01 Verify related products section is displayed', async () => {
    await productPage.verifyRelatedSectionVisible();
    await productPage.verifyAtLeastOneRelatedProductVisible();
  });

  test('RP-07 Verify related product cards have basic details', async () => {
    await productPage.verifyRelatedSectionVisible();
    await productPage.verifyRelatedItemsHaveBasicDetails();
  });

  test('RP-05 Verify clicking a related product navigates to another product page', async ({ page }) => {
    await productPage.verifyRelatedSectionVisible();

    const oldUrl = page.url();
    const oldTitle = await productPage.getCurrentProductTitle();

    await productPage.clickFirstRelatedProduct();
    await productPage.verifyNavigationAfterRelatedProductClick(oldUrl, oldTitle);
  });
});