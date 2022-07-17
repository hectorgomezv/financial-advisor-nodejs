const refreshPortfolioStatesTask = require('./refresh-portfolio-states-task');

const start = () => {
  refreshPortfolioStatesTask.run();
};

module.exports = {
  start,
};
