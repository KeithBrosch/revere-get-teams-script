const { createClient } = require("@supabase/supabase-js")
const { Games } = require('../Constants')
const supaClient = createClient(process.env.SUPABASE_API_URL, process.env.SUPABASE_ANON_KEY);


async function insertMissingTeamsForGame(teams, game = Games.valorant) {
    //  TODO - could make this a lot more performant, but performance isn't a huge deal here.
    const { data: existingTeams, error } = await supaClient
        .from('teams')
        .select('intragame_team_id');

    const existingTeamIds = existingTeams.map((et) => et.intragame_team_id);
    const newTeams = teams.filter((x) => !existingTeamIds.includes(parseInt(x.id)));
    const formattedTeams = newTeams.map((x) => ({ intragame_team_id: parseInt(x.id), name: x.name, game_id: game }));

    //sometimes vlr.gg has the same team in multiple regions resulting in the team getting more than 1 row in the table.
    //hacky way to unique-ify the teams from the scrape before going to DB.
    let filteredList = [...new Set(formattedTeams.map(JSON.stringify))].map(JSON.parse)

    const { error: insertError } = await supaClient
        .from('teams')
        .insert(filteredList);
    
    if (insertError) console.error(insertError);
}

module.exports = { insertMissingTeamsForGame }