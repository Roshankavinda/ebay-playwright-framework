eBay Playwright Framework – QA Skills Assessment
Overview

This project contains a Playwright automation framework developed for the QA Skills Assessment.

The automation validates the Related Products functionality on the eBay product page. The tests focus on core smoke scenarios to verify that related items are displayed correctly and that users can navigate to another product through the related products section.

The framework follows the Page Object Model (POM) design pattern to improve maintainability, readability, and scalability.

Automated Test Scope

The following test cases were automated:

Test Case ID	Description
RP-01	Verify the Related Products section is displayed on the product page
RP-07	Verify related product cards display basic product information
RP-05	Verify clicking a related product navigates to another product page

Additional validations such as:

Category matching

Price band validation

Ranking logic validation

Responsive layout validation

were identified in the manual test suite but were not included in the initial automation scope.

Tech Stack

Playwright

JavaScript

Node.js

Page Object Model (POM)

Project Structure
ebay-playwright-framework/
├── package.json
├── package-lock.json
├── playwright.config.js
├── README.md
├── pages/
│   ├── HomePage.js
│   └── ProductPage.js
├── tests/
│   └── relatedProducts.spec.js
└── utils/
    └── testData.js
pages

Contains Page Object classes responsible for UI interaction logic.

tests

Contains Playwright test cases that validate the functionality.

utils

Contains reusable test data used across tests.

Setup Instructions
1. Install Node.js

Ensure Node.js v18 or higher is installed.

Check installation:

node -v
2. Clone the repository
git clone <https://github.com/Roshankavinda/ebay-playwright-framework>
cd ebay-playwright-framework
3. Install project dependencies
npm install
4. Install Playwright browsers
npx playwright install
Run Tests

Run all tests:

npm test

Run tests in headed mode (browser visible):

npx playwright test --headed

Run tests in Playwright UI mode:

npx playwright test --ui
View Test Report

After test execution, open the Playwright HTML report:

npx playwright show-report

The report includes:

Test results

Screenshots for failures

Execution trace

Video recordings

Framework Design

This framework uses the Page Object Model (POM) pattern to separate test logic from UI interaction logic.

HomePage.js

Responsible for:

Opening eBay search results

Handling consent banners

Collecting candidate product URLs

ProductPage.js

Responsible for:

Verifying product page load

Detecting related product sections

Validating related product items

Handling navigation between related products

relatedProducts.spec.js

Contains the automated test scenarios and orchestrates interactions between page objects.

Test Strategy

Because eBay pages are dynamic and vary between products, the framework:

Searches for products using the keyword wallet

Retrieves multiple candidate product URLs

Selects the first product that contains a valid related products section

Executes the automation scenarios on that product page

This approach improves test stability.

Notes

eBay product pages can render different layouts depending on the product and seller.

The automation dynamically selects a valid product page containing related items.

Tests are written as smoke validations to demonstrate automation framework design.

Author

Roshan Wickramasooriya
Software Quality Assurance Engineer
Sri Lanka