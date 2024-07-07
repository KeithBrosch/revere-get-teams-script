const dotenv = require("dotenv");
dotenv.config();

const valorant = require('./utils/valorant-scrape');
const cron = require('node-cron');

//uncomment to run locally
// valorant.getTeams();
cron.schedule('0 0 0 * * *', () => {
  valorant.getTeams();
});