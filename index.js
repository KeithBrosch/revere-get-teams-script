// this script should be run once per day to get any new teams on the vlr.gg rankings page
const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");
const cron = require("node-cron");

cron.schedule("0 0 0 * * *", () => {
  console.log(`starting scrape at ${new Date()}`);

  const url = "https://www.vlr.gg/rankings";

  let teams = [];

  request(url, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      const $ = cheerio.load(response.body);
      const teamDivs = $(".rank-item-team");
      const numTeams = teamDivs.length;
      let count = 0;
      while (count < numTeams && numTeams !== 0) {
        const teamName = Object.values(teamDivs[count].attribs)[0];
        let teamURL = Object.values(teamDivs[count].children[1].attribs)[0];
        const teamID = teamURL.split("/")[2];
        const teamThumbnail = Object.values(
          teamDivs[count].children[1].children[1].attribs
        )[0];
        count += 1;
        const team = {
          id: teamID,
          name: teamName,
          thumbnail: teamThumbnail,
        };
        teams.push(team);
      }
    }
    // console.log(teams);
    axios
      .post("http://localhost:5000/teams", {
        teams,
      })
      .then(() => {
        console.log(`finished scrape at ${new Date()}`);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
