const refreshCompanyStatesTask = require('./refresh-company-states-task');

const start = () => {
  refreshCompanyStatesTask.run();
};

module.exports = {
  start,
};
