const config = {
  ROOT_DIR: 'cypress/e2e',
  REPORT_DIR: 'visual-testing-report',
  SCREENSHOTS_DIR: 'visual-testing-screenshots',
  FAILURE_THRESHOLD: 0,
  RETRY_OPTIONS: {
    log: true,
    limit: 2, // max number of iterations
    timeout: 10000, // time limit in ms
    delay: 500, // delay before next iteration in ms
  },
  COMPARISON_OPTIONS: { threshold: 0 },
  JSON_REPORT: {
    FILENAME: 'cypress_visual_report',
    OVERWRITE: true,
  },

};

module.exports = config;