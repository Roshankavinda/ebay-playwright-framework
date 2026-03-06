# eBay Related Products - Playwright Automation Framework

This project covers the **automation section** of the QA skills assignment for the eBay related-products / best-seller widget.

The assignment explicitly requires:
- Playwright
- an automation framework
- deriving automated test cases from the manual test cases
- a README file

## Scope covered

Automated from the uploaded test suite:
- **RP-01** Related products section is displayed
- **RP-02** Maximum of 6 related products are displayed
- **RP-03** Related products stay in the same category family as the main product
- **RP-04** Related products stay within the expected price band (+/-20%)
- **RP-05** Clicking a related product opens the correct product page
- **RP-07** Mandatory fields are displayed on the related product card
- **RP-09** Mobile viewport smoke coverage

## Suggested framework structure

```text
.
├── pages/
│   └── productPage.js
├── tests/
│   ├── related-products.spec.js
│   └── related-products.mobile.spec.js
├── utils/
│   └── testData.js
├── playwright.config.js
└── README.md
```

## Important note

Because the assignment targets a **live eBay UI**, selectors and page content can change over time. This framework is written to be flexible, but you may still need to fine-tune locators after inspecting the current DOM in your browser.

Examples of things that may vary on the live site:
- section title: `Best Sellers`, `Related Products`, or `Similar sponsored items`
- DOM hierarchy of each card
- sponsor labels, regional variations, and item availability
- price rendering and currency format

## Preconditions / assumptions used for automation

1. Search term used: **wallet**
2. The first valid `/itm/` item from search results is treated as the main product
3. Related section is available on the chosen product page
4. Category validation is done using breadcrumb text containing **wallet**
5. Price band validation follows the manual test case assumption of **+/-20%**
6. Best-seller ranking order itself is **not automated here**, because that normally requires a trusted data source or API for comparison

## Installation

Use your existing project and install Playwright dependencies:

```bash
npm install
npx playwright install
```

## Run tests

Run all tests:

```bash
npx playwright test
```

Run desktop tests only:

```bash
npx playwright test tests/related-products.spec.js --project=chromium
```

Run mobile smoke test only:

```bash
npx playwright test tests/related-products.mobile.spec.js --project=mobile-chrome
```

Open HTML report:

```bash
npx playwright show-report
```

## Good points to mention in your submission

### Why these test cases were automated
These are stable, UI-verifiable, business-critical checks directly connected to the requirement:
- section visibility
- max item count
- category consistency
- price range consistency
- correct navigation
- responsive/mobile behavior

### What should remain manual or require a deeper test environment
- true best-seller ranking validation
- backend data rule validation
- experimentation / recommendation engine quality
- analytics tracking validation unless network contracts are defined
- cross-region catalog differences

## GitHub submission checklist

Before uploading to GitHub:
1. Add these files to your existing Playwright project
2. Run the tests locally
3. Fix any selector mismatch against the current eBay DOM
4. Commit the framework
5. Push to GitHub
6. Share the repository URL

## Recommended extra files

You can also add:
- `.gitignore`
- `package-lock.json`
- `test-results/` ignored in git
- screenshots in a `docs/` folder if you want to show evidence

## Sample `.gitignore`

```gitignore
node_modules/
playwright-report/
test-results/
*.log
.env
```
