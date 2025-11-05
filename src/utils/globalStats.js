// Calcula estatísticas globais de todas as Copas
export const calculateGlobalStats = (history) => {
  if (!history || history.length === 0) {
    return {
      totalMatches: 0,
      totalGoals: 0,
      biggestWin: null,
      headToHead: {},
      records: {}
    };
  }

  const stats = {
    totalMatches: 0,
    totalGoals: 0,
    biggestWin: null,
    headToHead: {},
    records: {
      mostGoalsInEdition: { year: null, goals: 0 },
      mostWinsInEdition: { team: null, wins: 0, year: null },
      longestWinStreak: { team: null, streak: 0 },
      bestDefense: { team: null, goalsAgainst: Infinity, year: null }
    }
  };

  history.forEach(cup => {
    if (!cup.fullData) return;

    // Processa partidas
    const allMatches = [
      ...cup.fullData.round16,
      ...cup.fullData.quarterfinals,
      ...cup.fullData.semifinals,
      cup.fullData.final,
      cup.fullData.thirdPlace
    ].filter(m => m);

    allMatches.forEach(match => {
      stats.totalMatches++;
      stats.totalGoals += match.score1 + match.score2;

      // Confrontos diretos
      const team1 = match.team1.name;
      const team2 = match.team2.name;
      const key = [team1, team2].sort().join(' vs ');
      
      if (!stats.headToHead[key]) {
        stats.headToHead[key] = {
          team1: team1,
          team2: team2,
          team1Wins: 0,
          team2Wins: 0,
          draws: 0,
          team1Goals: 0,
          team2Goals: 0
        };
      }

      if (match.score1 > match.score2) {
        stats.headToHead[key].team1Wins++;
        stats.headToHead[key].team1Goals += match.score1;
        stats.headToHead[key].team2Goals += match.score2;
      } else if (match.score1 < match.score2) {
        stats.headToHead[key].team2Wins++;
        stats.headToHead[key].team1Goals += match.score1;
        stats.headToHead[key].team2Goals += match.score2;
      } else {
        stats.headToHead[key].draws++;
        stats.headToHead[key].team1Goals += match.score1;
        stats.headToHead[key].team2Goals += match.score2;
      }

      // Maior goleada
      const goalDiff1 = Math.abs(match.score1 - match.score2);
      if (!stats.biggestWin || goalDiff1 > stats.biggestWin.difference) {
        const winner = match.score1 > match.score2 ? match.team1 : match.team2;
        const loser = match.score1 > match.score2 ? match.team2 : match.team1;
        const winnerScore = match.score1 > match.score2 ? match.score1 : match.score2;
        const loserScore = match.score1 > match.score2 ? match.score2 : match.score1;
        
        stats.biggestWin = {
          winner,
          loser,
          winnerScore,
          loserScore,
          difference: goalDiff1,
          year: cup.year
        };
      }
    });

    // Estatísticas por edição
    if (cup.fullData.groupStage) {
      let editionGoals = 0;
      let editionBestDefense = { team: null, goals: Infinity };

      Object.keys(cup.fullData.groupStage).forEach(groupLetter => {
        cup.fullData.groupStage[groupLetter].standings.forEach(standing => {
          editionGoals += standing.goalsFor;
          
          if (standing.goalsAgainst < editionBestDefense.goals) {
            editionBestDefense = {
              team: standing.team,
              goals: standing.goalsAgainst
            };
          }

          if (standing.wins > stats.records.mostWinsInEdition.wins) {
            stats.records.mostWinsInEdition = {
              team: standing.team.name,
              wins: standing.wins,
              year: cup.year
            };
          }
        });
      });

      if (editionGoals > stats.records.mostGoalsInEdition.goals) {
        stats.records.mostGoalsInEdition = {
          year: cup.year,
          goals: editionGoals
        };
      }

      if (editionBestDefense.goals < stats.records.bestDefense.goalsAgainst) {
        stats.records.bestDefense = {
          team: editionBestDefense.team.name,
          goalsAgainst: editionBestDefense.goals,
          year: cup.year
        };
      }
    }
  });

  return stats;
};

