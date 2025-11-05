// Calcula estatísticas de todos os times baseado nos resultados da simulação
export const calculateTeamStatistics = (result) => {
  const stats = {};
  
  // Inicializa estatísticas para todos os times
  const allTeams = [];
  Object.keys(result.groups).forEach(groupLetter => {
    result.groups[groupLetter].forEach(team => {
      if (!allTeams.find(t => t.name === team.name)) {
        allTeams.push(team);
      }
    });
  });
  
  allTeams.forEach(team => {
    stats[team.name] = {
      team,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      matches: 0
    };
  });
  
  // Processa fase de grupos
  Object.keys(result.groupStage).forEach(groupLetter => {
    result.groupStage[groupLetter].standings.forEach(standing => {
      const teamName = standing.team.name;
      if (stats[teamName]) {
        stats[teamName].wins = standing.wins;
        stats[teamName].draws = standing.draws;
        stats[teamName].losses = standing.losses;
        stats[teamName].goalsFor = standing.goalsFor;
        stats[teamName].goalsAgainst = standing.goalsAgainst;
        stats[teamName].points = standing.points;
        stats[teamName].matches = standing.wins + standing.draws + standing.losses;
      }
    });
  });
  
  // Processa fases eliminatórias (oitavas, quartas, semis, final)
  const knockoutMatches = [
    ...result.round16,
    ...result.quarterfinals,
    ...result.semifinals,
    result.final,
    result.thirdPlace
  ].filter(m => m);
  
  knockoutMatches.forEach(match => {
    const team1Name = match.team1.name;
    const team2Name = match.team2.name;
    
    if (stats[team1Name]) {
      stats[team1Name].matches += 1;
      stats[team1Name].goalsFor += match.score1;
      stats[team1Name].goalsAgainst += match.score2;
      
      if (match.score1 > match.score2) {
        stats[team1Name].wins += 1;
        stats[team1Name].points += 3;
      } else if (match.score1 < match.score2) {
        stats[team1Name].losses += 1;
      } else {
        stats[team1Name].draws += 1;
        stats[team1Name].points += 1;
      }
    }
    
    if (stats[team2Name]) {
      stats[team2Name].matches += 1;
      stats[team2Name].goalsFor += match.score2;
      stats[team2Name].goalsAgainst += match.score1;
      
      if (match.score2 > match.score1) {
        stats[team2Name].wins += 1;
        stats[team2Name].points += 3;
      } else if (match.score2 < match.score1) {
        stats[team2Name].losses += 1;
      } else {
        stats[team2Name].draws += 1;
        stats[team2Name].points += 1;
      }
    }
  });
  
  return Object.values(stats).sort((a, b) => {
    // Ordena por pontos, depois saldo de gols, depois gols pró
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    return b.goalsFor - a.goalsFor;
  });
};

