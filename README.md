# Cypress E2E Example Project

This project is a simple example repository with E2E tests written in Cypress. It contains basic end-to-end tests, extended with visual testing and advanced reporting. The project is intended as a portfolio piece for an automation tester's CV.

## Project Contents

- **Cypress E2E tests** – Automated functional tests for a sample web application.
- **Visual tests** – Screenshot comparison using `cypress-image-diff-html-report`.
- **Test reporting** – Readable test reports generated with `mochawesome` and separate visual reports.
- **Example custom commands** – e.g., login, add to basket, HEX to RGB color conversion.
- **Sample test data** – Using fixtures and data generator (`@faker-js/faker`).

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Bartosz-Wilkowski/cypress-tests.git
   cd cypress-tests
   ```

2. **Install dependencies**
   ```sh
   yarn install
   ```

## Running tests and reports

1. **Start the visual report server**
   ```sh
   yarn start:report
   ```

2. **Run the tests**
   ```sh
   yarn test
   ```
   Or with Mochawesome reporting:
   ```sh
   yarn cypress:run
   ```

3. **Generate the reports**
   ```sh
   yarn report
   ```

## Scripts

- `yarn test` – runs Cypress tests.
- `yarn cypress:run` – runs Cypress tests with Mochawesome reporter.
- `yarn report` – generates test and visual reports.
- `yarn start:report` – starts the visual report server.

## Technologies

- [Cypress](https://www.cypress.io/) – E2E testing framework
- [mochawesome](https://github.com/adamgruber/mochawesome) – test report generation
- [cypress-image-diff-html-report](https://github.com/mjhea0/cypress-image-diff-html-report) – visual reports
- [@faker-js/faker](https://github.com/faker-js/faker) – test data generation

---

**Author:** Bartosz Wilkowski  
**Repository:** [github.com/Bartosz-Wilkowski/cypress-tests](https://github.com/Bartosz-Wilkowski/cypress-tests)