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

    const { error: insertError } = await supaClient
        .from('teams')
        .insert(formattedTeams);
    
    if (insertError) console.error(insertError);
}

module.exports = { insertMissingTeamsForGame }