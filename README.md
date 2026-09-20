# Playwright Project

## About

A Playwright test suite for a Kanban board web application.

The framework uses the page object model, with Playwright fixtures injecting page
objects into each test so setup stays modular and reusable. Page objects are
composed from smaller component classes (header, nav menu, task card), each scoped
to its own container locator. Board tests are data-driven to keep new cases cheap
to add. Authentication runs once in a setup project and the resulting storage state
is reused across the suite to cut execution time.

## Setup

To see results without running anything locally, download the `playwright-report`
artifact from the latest run on the "Actions" tab.

### Prerequisites

- Node.js v20 or higher

```sh
# clone the repository
git clone git@github.com:emaxiss/playwright-project.git && cd playwright-project

# install dependencies
npm install

# install playwright browsers
npx playwright install

# set credentials for the application under test
cp .env.example .env
```

Fill in `ADMIN_USER` and `ADMIN_USER_PASSWORD` in `.env`. The suite fails with an
explicit error if either is missing.

## Test run

#### To run tests

    npm run test

#### To run tests in ui mode

    npm run test:ui

#### To generate test report

    npm run test:report
