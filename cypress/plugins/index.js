const {
  addCleanupDiffOutputCommand,
  addMatchImageSnapshotPlugin,
} = require('cypress-image-diff/plugin');
 
module.exports = (on) => {
  addMatchImageSnapshotPlugin(on);
};