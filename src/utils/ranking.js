// Calcula ranking histórico de todas as seleções
export const calculateHistoricalRanking = (history) => {
  if (!history || history.length === 0) {
    return [];
  }

  const ranking = {};

  history.forEach(cup => {
    if (!cup.fullData) return;

    // Processa fase de grupos
    Object.keys(cup.fullData.groupStage).forEach(groupLetter => {
      cup.fullData.groupStage[groupLetter].standings.forEach(standing => {
        const teamName = standing.team.name;
        if (!ranking[teamName]) {
          ranking[teamName] = {
            team: standing.team,
            totalPoints: 0,
            totalWins: 0,
            totalDraws: 0,
            totalLosses: 0,
            totalGoalsFor: 0,
            totalGoalsAgainst: 0,
            totalMatches: 0,
            appearances: 0,
            bestPosition: 33,
            titles: 0,
            runnerUps: 0
          };
        }

        ranking[teamName].totalPoints += standing.points;
        ranking[teamName].totalWins += standing.wins;
        ranking[teamName].totalDraws += standing.draws;
        ranking[teamName].totalLosses += standing.losses;
        ranking[teamName].totalGoalsFor += standing.goalsFor;
        ranking[teamName].totalGoalsAgainst += standing.goalsAgainst;
        ranking[teamName].totalMatches += standing.wins + standing.draws + standing.losses;
        ranking[teamName].appearances += 1;
      });
    });

    // Processa fases eliminatórias
    const knockoutMatches = [
      ...cup.fullData.round16,
      ...cup.fullData.quarterfinals,
      ...cup.fullData.semifinals,
      cup.fullData.final,
      cup.fullData.thirdPlace
    ].filter(m => m);

    knockoutMatches.forEach(match => {
      const team1Name = match.team1.name;
      const team2Name = match.team2.name;

      [team1Name, team2Name].forEach(teamName => {
        if (!ranking[teamName]) {
          const team = match.team1.name === teamName ? match.team1 : match.team2;
          ranking[teamName] = {
            team,
            totalPoints: 0,
            totalWins: 0,
            totalDraws: 0,
            totalLosses: 0,
            totalGoalsFor: 0,
            totalGoalsAgainst: 0,
            totalMatches: 0,
            appearances: 0,
            bestPosition: 33,
            titles: 0,
            runnerUps: 0
          };
        }

        ranking[teamName].totalMatches += 1;
        if (teamName === team1Name) {
          ranking[teamName].totalGoalsFor += match.score1;
          ranking[teamName].totalGoalsAgainst += match.score2;
          if (match.score1 > match.score2) {
            ranking[teamName].totalWins += 1;
            ranking[teamName].totalPoints += 3;
          } else if (match.score1 < match.score2) {
            ranking[teamName].totalLosses += 1;
          } else {
            ranking[teamName].totalDraws += 1;
            ranking[teamName].totalPoints += 1;
          }
        } else {
          ranking[teamName].totalGoalsFor += match.score2;
          ranking[teamName].totalGoalsAgainst += match.score1;
          if (match.score2 > match.score1) {
            ranking[teamName].totalWins += 1;
            ranking[teamName].totalPoints += 3;
          } else if (match.score2 < match.score1) {
            ranking[teamName].totalLosses += 1;
          } else {
            ranking[teamName].totalDraws += 1;
            ranking[teamName].totalPoints += 1;
          }
        }
      });
    });

    // Atualiza títulos e posições
    if (cup.champion) {
      if (!ranking[cup.champion.name]) {
        ranking[cup.champion.name] = {
          team: cup.champion,
          totalPoints: 0,
          totalWins: 0,
          totalDraws: 0,
          totalLosses: 0,
          totalGoalsFor: 0,
          totalGoalsAgainst: 0,
          totalMatches: 0,
          appearances: 0,
          bestPosition: 33,
          titles: 0,
          runnerUps: 0
        };
      }
      ranking[cup.champion.name].titles += 1;
      ranking[cup.champion.name].bestPosition = Math.min(ranking[cup.champion.name].bestPosition, 1);
    }

    if (cup.runnerUp) {
      if (!ranking[cup.runnerUp.name]) {
        ranking[cup.runnerUp.name] = {
          team: cup.runnerUp,
          totalPoints: 0,
          totalWins: 0,
          totalDraws: 0,
          totalLosses: 0,
          totalGoalsFor: 0,
          totalGoalsAgainst: 0,
          totalMatches: 0,
          appearances: 0,
          bestPosition: 33,
          titles: 0,
          runnerUps: 0
        };
      }
      ranking[cup.runnerUp.name].runnerUps += 1;
      ranking[cup.runnerUp.name].bestPosition = Math.min(ranking[cup.runnerUp.name].bestPosition, 2);
    }
  });

  // Calcula posição média baseada em estatísticas
  Object.values(ranking).forEach(team => {
    if (team.appearances > 0) {
      team.averagePoints = team.totalPoints / team.appearances;
      team.averageGoalsFor = team.totalGoalsFor / team.totalMatches;
      team.averageGoalsAgainst = team.totalGoalsAgainst / team.totalMatches;
    }
  });

  return Object.values(ranking).sort((a, b) => {
    // Ordena por: títulos, depois runner-ups, depois pontos totais
    if (b.titles !== a.titles) return b.titles - a.titles;
    if (b.runnerUps !== a.runnerUps) return b.runnerUps - a.runnerUps;
    return b.totalPoints - a.totalPoints;
  });
};

