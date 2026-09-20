# Playwright Project

A Playwright test suite and the Kanban board application it exercises.

## About

The repository contains both the application under test and the suite that
covers it. The application is a small Vite and React board with four columns,
task creation and deletion, drag and drop between columns, title filtering and
a JSON API served as Vite middleware.

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
- **Data driven cases.** Board display assertions run from a table of cases
  rather than repeated test bodies.
- **Isolation.** Tests that mutate the board seed their own state, so they stay
  independent under parallel execution.

## Setup

### Prerequisites

- Node.js v20 or higher

```sh
# clone the repository
git clone git@github.com:emaxiss/playwright-project.git && cd playwright-project

# install dependencies
npm install

# install playwright browsers
npx playwright install
```

No environment configuration is required. The test run starts the application
automatically.

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

| Area            | Cases                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Board display   | Task placement and tags across boards, board switching, empty columns |
| Task management | Create, validation failure, delete, filter by title                   |
| Drag and drop   | Move between columns, drop on origin, drop into empty column          |
| Error handling  | Failed board request, missing board, empty board                      |

## Layout

```
app/             application under test (Vite, React)
  src/api/       board API served as Vite middleware
  src/data/      seed board data
page-objects/    page objects, components and fixtures
tests/           specs
```
