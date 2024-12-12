# Plawright Project

## About

This project demonstrates a Playwright-driven test suite for testing a Kanban board web application. The Framework designed using page object model, utilizing Playwright fixtures to enable modular and reusable setups (dynamic injection of page objects and browser context during test execution). Test suite employs a data-driven approach to minimize code duplication and maximize scalability, making it easy to add or update test cases dynamically. To optimize the test execution time, authentication state is stored and reused across multiple tests.

## Setup

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

To execute tests - set up environment variables. Create .env in the root folder and save admin username and password

Example .env:

```
ADMIN_USER=admin_username
ADMIN_USER_PASSWORD=admin_username
```

#### To run tests

    npm run test

#### To run tests in ui mode

    npm run test:ui

#### To generate test report

    npm run test:report
