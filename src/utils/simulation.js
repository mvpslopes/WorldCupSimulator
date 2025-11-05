// Calcula a probabilidade de vitória baseada nos ratings
export const calculateWinProbability = (team1Rating, team2Rating) => {
  return team1Rating / (team1Rating + team2Rating);
};

// Simula uma partida e retorna o vencedor
export const simulateMatch = (team1, team2) => {
  const prob = calculateWinProbability(team1.rating, team2.rating);
  const random = Math.random();
  
  if (random < prob) {
    return team1;
  }
  return team2;
};

// Gera gols aleatórios baseados no rating (time mais forte tende a fazer mais gols)
export const generateScore = (team1, team2) => {
  // Validação de segurança
  if (!team1 || !team2 || !team1.rating || !team2.rating) {
    throw new Error('Times inválidos para simulação');
  }
  
  const prob = calculateWinProbability(team1.rating, team2.rating);
  const winner = Math.random() < prob ? team1 : team2;
  
  // Gols baseados em probabilidade (0-4 gols)
  const winnerGoals = Math.floor(Math.random() * 3) + (winner.rating > 85 ? 1 : 0) + (Math.random() < prob ? 1 : 0);
  const loserGoals = Math.floor(Math.random() * Math.min(winnerGoals, 2));
  
  return {
    team1: winner === team1 ? winnerGoals : loserGoals,
    team2: winner === team2 ? winnerGoals : loserGoals,
    winner
  };
};

// Embaralha array (Fisher-Yates)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Sorteia os grupos
export const drawGroups = (teams) => {
  // Garante que temos exatamente 32 times
  if (!teams || teams.length === 0) {
    throw new Error('Nenhum time fornecido para sorteio dos grupos');
  }
  
  // Se tiver mais de 32, pega os primeiros 32
  // Se tiver menos de 32, completa com times fictícios (não deveria acontecer)
  const teamsToUse = teams.slice(0, 32);
  
  if (teamsToUse.length < 32) {
    console.warn(`Aviso: Apenas ${teamsToUse.length} times disponíveis. Necessário 32 para a Copa.`);
  }
  
  const shuffled = shuffleArray(teamsToUse);
  const groups = {};
  
  for (let i = 0; i < 8; i++) {
    const groupLetter = String.fromCharCode(65 + i); // A, B, C, D, E, F, G, H
    const startIdx = i * 4;
    const endIdx = startIdx + 4;
    groups[groupLetter] = shuffled.slice(startIdx, endIdx).filter(t => t); // Filtra undefined/null
  }
  
  // Valida que todos os grupos têm 4 times
  Object.keys(groups).forEach(groupLetter => {
    if (groups[groupLetter].length !== 4) {
      console.warn(`Grupo ${groupLetter} tem apenas ${groups[groupLetter].length} times`);
    }
  });
  
  return groups;
};

// Simula fase de grupos
export const simulateGroupStage = (groups) => {
  const results = {};
  
  Object.keys(groups).forEach(groupLetter => {
    const teams = groups[groupLetter];
    const standings = teams.map(team => ({
      team,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      wins: 0,
      draws: 0,
      losses: 0
    }));
    
    // Jogos todos contra todos
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const score = generateScore(teams[i], teams[j]);
        const team1Index = standings.findIndex(s => s.team === teams[i]);
        const team2Index = standings.findIndex(s => s.team === teams[j]);
        
        standings[team1Index].goalsFor += score.team1;
        standings[team1Index].goalsAgainst += score.team2;
        standings[team2Index].goalsFor += score.team2;
        standings[team2Index].goalsAgainst += score.team1;
        
        if (score.team1 > score.team2) {
          standings[team1Index].points += 3;
          standings[team1Index].wins += 1;
          standings[team2Index].losses += 1;
        } else if (score.team1 < score.team2) {
          standings[team2Index].points += 3;
          standings[team2Index].wins += 1;
          standings[team1Index].losses += 1;
        } else {
          standings[team1Index].points += 1;
          standings[team2Index].points += 1;
          standings[team1Index].draws += 1;
          standings[team2Index].draws += 1;
        }
      }
    }
    
    // Ordena por pontos, depois saldo, depois gols pró
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });
    
    results[groupLetter] = {
      standings,
      qualified: [standings[0].team, standings[1].team]
    };
  });
  
  return results;
};

// Simula fase eliminatória
export const simulateKnockoutRound = (teams) => {
  const matches = [];
  const winners = [];
  
  // Filtra times undefined/null
  const validTeams = teams.filter(t => t && t.rating !== undefined);
  
  for (let i = 0; i < validTeams.length; i += 2) {
    const team1 = validTeams[i];
    const team2 = validTeams[i + 1];
    
    // Se não houver segundo time, o primeiro avança automaticamente
    if (!team2) {
      winners.push(team1);
      continue;
    }
    
    const score = generateScore(team1, team2);
    const winner = score.winner;
    
    matches.push({
      team1,
      team2,
      score1: score.team1,
      score2: score.team2,
      winner
    });
    
    winners.push(winner);
  }
  
  return { matches, winners };
};

// Simula a Copa completa
export const simulateWorldCup = (teams) => {
  const groups = drawGroups(teams);
  const groupStage = simulateGroupStage(groups);
  
  // Coleta os classificados
  const qualified = [];
  Object.keys(groupStage).forEach(groupLetter => {
    qualified.push(...groupStage[groupLetter].qualified);
  });
  
  // Oitavas de final
  const round16 = simulateKnockoutRound(qualified);
  
  // Quartas de final
  const quarterfinals = simulateKnockoutRound(round16.winners);
  
  // Semifinal
  const semifinals = simulateKnockoutRound(quarterfinals.winners);
  
  // Final
  const final = simulateKnockoutRound(semifinals.winners);
  const finalMatch = final.matches[0];
  const champion = finalMatch.winner;
  
  // Terceiro lugar (perdedores das semifinais)
  const semifinalLosers = [];
  semifinals.matches.forEach(m => {
    const loser = m.winner === m.team1 ? m.team2 : m.team1;
    if (loser && loser !== champion) {
      semifinalLosers.push(loser);
    }
  });
  
  let thirdPlaceMatch = null;
  if (semifinalLosers.length === 2 && semifinalLosers[0] && semifinalLosers[1]) {
    const thirdPlace = simulateKnockoutRound(semifinalLosers);
    thirdPlaceMatch = thirdPlace.matches.length > 0 ? thirdPlace.matches[0] : null;
  }
  
  // Determina o runner-up
  const runnerUp = finalMatch.winner === finalMatch.team1 
    ? finalMatch.team2 
    : finalMatch.team1;
  
  return {
    groups,
    groupStage,
    round16: round16.matches,
    quarterfinals: quarterfinals.matches,
    semifinals: semifinals.matches,
    final: finalMatch,
    thirdPlace: thirdPlaceMatch,
    champion: champion,
    runnerUp: runnerUp,
    championGoals: champion === finalMatch.team1 
      ? finalMatch.score1 
      : finalMatch.score2
  };
};

