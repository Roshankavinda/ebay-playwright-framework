# eBay Playwright Framework - QA Skills Assessment

## Overview
This project contains a simple Playwright automation framework created for the QA Skills Assessment.

The automation is based on the eBay wallet product scenario and focuses on simple smoke-level validation of the related products feature.

## Automated Test Scope
The following simple test cases were selected for automation:

- RP-01 - Verify related products section is displayed
- RP-05 - Verify clicking a related product navigates to another product page
- RP-07 - Verify related product cards show basic details

## Intentionally Not Automated
The below test case was intentionally skipped to keep the solution simple and stable for assignment purposes:

- RP-02 / TC 02 - Maximum related products count validation

Other advanced validations such as category match, same price range, ranking logic, and responsive behavior were also not included in this initial automation scope.

## Tech Stack
- Playwright
- JavaScript
- Page Object Model (POM)

## Project Structure
```text
ebay-playwright-framework/
├── package.json
├── playwright.config.js
├── README.md
├── pages/
│   ├── HomePage.js
│   └── ProductPage.js
├── tests/
│   └── relatedProducts.spec.js
└── utils/
    └── testData.js