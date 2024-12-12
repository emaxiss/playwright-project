# Plawright Project

## About

This project demonstrates a Playwright-driven test suite for testing a Kanban board web application. The Framework designed using page object model, utilizing Playwright fixtures to enable modular and reusable setups (dynamic injection of page objects and browser context during test execution). Test suite employs a data-driven approach to minimize code duplication and maximize scalability, making it easy to add or update test cases dynamically. To optimize the test execution time, authentication state is stored and reused across multiple tests.

## Setup

If you only want to see the run results - you can download playwright-report file from the last workflow summary page on "Actions" tab

Otherwise proceed with local run

### Prerequisites

- Install Node.js (v20 or higher recommended)

```sh
# clone the repository
git clone git@github.com:emaxiss/playwright-project.git && cd playwright-project

# install dependencies
npm install

# install playwright browsers
npx playwright install
```
## Test run

#### To run tests

    npm run test

#### To run tests in ui mode

    npm run test:ui

#### To generate test report

    npm run test:report
