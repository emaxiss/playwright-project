# Playwright Project

[![Playwright Tests](https://github.com/emaxiss/playwright-project/actions/workflows/playwright.yml/badge.svg)](https://github.com/emaxiss/playwright-project/actions/workflows/playwright.yml)

A Playwright test suite and the Kanban board application it exercises.

## About

The repository contains both the application under test and the suite that
covers it. The application is a Vite and React board with a sign in gate, four
columns, a task detail panel for creating and editing, drag and drop, search,
tag filters, sorting, delete confirmation with undo, and a JSON API served as
Vite middleware.

Keeping the application in the repository means the suite owns its target. It
boots with the tests, needs no credentials, and its API can be intercepted to
force failures or seed a known board per test.

### Framework

- **Page object model.** Pages compose smaller component classes (column, task
  card, nav menu), each scoped to its own container locator so a query cannot
  match outside it.
- **Fixtures.** Page objects are injected per test. Two further fixtures wrap
  `page.route`: `seedBoard` serves a known board and applies writes to it, and
  `failBoardRequest` forces an error response.
- **Role based locators.** Columns are named regions and cards are named
  articles, so the suite selects by role and accessible name rather than by
  class names or DOM position.
- **Stored session.** A setup project signs in once and saves the session, which
  the browser projects reuse through storageState instead of signing in per test.
- **Data driven cases.** Board display assertions run from a table of cases
  rather than repeated test bodies.
- **Isolation.** Tests that mutate the board seed their own state, so they stay
  independent under parallel execution.
- **Sharded CI.** The suite runs as three shards in parallel and a final job
  merges the blob reports into one HTML report.

## Setup

### Prerequisites

- Node.js v22 or higher

```sh
# clone the repository
git clone git@github.com:emaxiss/playwright-project.git && cd playwright-project

# install dependencies
npm install

# install playwright browsers
npx playwright install
```

No environment configuration is required. The test run starts the application
automatically. The demo account is `admin` / `password123`, shown on the sign in
screen; `ADMIN_USER` and `ADMIN_USER_PASSWORD` override it.

## Test run

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `npm test`            | Run the suite across Chromium, Firefox, WebKit |
| `npm run test:ui`     | Run in UI mode                                 |
| `npm run test:report` | Open the last HTML report                      |
| `npm run app:dev`     | Start the application on its own               |
| `npm run typecheck`   | Type check the project                         |
| `npm run format`      | Format with Prettier                           |

## Coverage

| Area            | Cases                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| Authentication  | Valid sign in, invalid username, invalid password, board gated, sign out |
| Board display   | Task placement, tags and assignee, column counts, empty columns          |
| Board switching | Switching boards, clearing an active search, closing an open panel       |
| Task management | Create, validation failure, edit, cancel, confirm delete, undo delete    |
| Filtering       | Title search, tag filter, combined tags, sort by title and priority      |
| Drag and drop   | Move between columns, drop on origin, drop into empty column             |
| Error handling  | Failed board request, missing board, empty board, expired session        |
| Keyboard access | Open by keyboard, focus trapped in both modals, nested Escape, inert     |

43 tests per browser including the sign in setup, 127 across chromium,
firefox and webkit.

## Layout

```
app/             application under test (Vite, React)
  src/api/       board API served as Vite middleware
  src/data/      seed board data
page-objects/    page objects, components and fixtures
tests/           specs
```

## Continuous integration

Every push to `main` and every pull request runs typecheck, a Prettier check,
and the suite split across three parallel shards. Each shard uploads a blob
report and a final job merges them into a single HTML report, downloadable from
the run summary on the Actions tab.

The lockfile is written by npm 11, which records optional platform packages
that npm 10 rejects, so the workflow pins npm to match.
