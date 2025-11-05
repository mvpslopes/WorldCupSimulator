import { allTeams, allTeamsFull, worldCupQuotas } from '../data/allTeams';

// Função auxiliar para gerar placar (similar à generateScore mas sem dependência circular)
const generateScoreForQualifier = (team1, team2) => {
  if (!team1 || !team2 || !team1.rating || !team2.rating) {
    throw new Error('Times inválidos para simulação');
  }
  
  const prob = team1.rating / (team1.rating + team2.rating);
  const winner = Math.random() < prob ? team1 : team2;
  
  const winnerGoals = Math.floor(Math.random() * 3) + (winner.rating > 85 ? 1 : 0) + (Math.random() < prob ? 1 : 0);
  const loserGoals = Math.floor(Math.random() * Math.min(winnerGoals, 2));
  
  return {
    score1: winner === team1 ? winnerGoals : loserGoals,
    score2: winner === team2 ? winnerGoals : loserGoals,
    winner
  };
};

// Simula eliminatórias por confederação
export const simulateQualifiers = (useFullList = true) => {
  const qualifiedTeams = [];
  const confederationResults = {};
  // Sempre usa a lista completa se disponível (padrão)
  const teamsSource = (useFullList && allTeamsFull) ? allTeamsFull : allTeams;

  // Simula cada confederação
  Object.keys(worldCupQuotas).forEach(confederation => {
    if (confederation === 'HOST') {
      // País sede pode ser adicionado depois
      return;
    }

    const teams = teamsSource[confederation] || [];
    const quota = worldCupQuotas[confederation];

    if (teams.length === 0) return;

    // Ordena por rating (mais forte primeiro)
    const sortedTeams = [...teams].sort((a, b) => b.rating - a.rating);

    // Se temos menos times que a cota, todos se classificam
    if (sortedTeams.length <= quota) {
      qualifiedTeams.push(...sortedTeams);
      return;
    }

    // Simula eliminatórias: top teams se classificam automaticamente
    // Times restantes jogam entre si
    const autoQualified = Math.floor(quota * 0.6); // 60% se classificam automaticamente
    const playoffTeams = quota - autoQualified;
    const autoQualifiedList = sortedTeams.slice(0, autoQualified);
    const playoffMatches = [];

    // Classificação automática dos melhores
    qualifiedTeams.push(...autoQualifiedList);

    // Playoff entre os próximos times
    if (playoffTeams > 0) {
      const playoffCandidates = sortedTeams.slice(autoQualified, autoQualified + (playoffTeams * 2));
      
      // Simula confrontos eliminatórios
      const playoffWinners = [];
      for (let i = 0; i < playoffCandidates.length; i += 2) {
        if (i + 1 < playoffCandidates.length && playoffWinners.length < playoffTeams) {
          const team1 = playoffCandidates[i];
          const team2 = playoffCandidates[i + 1];
          
          // Simula partida ida e volta
          const match1 = generateScoreForQualifier(team1, team2);
          const match2 = generateScoreForQualifier(team2, team1);
          
          const total1 = match1.score1 + match2.score2;
          const total2 = match1.score2 + match2.score1;
          
          const winner = total1 > total2 ? team1 : 
                        total2 > total1 ? team2 :
                        (team1.rating > team2.rating ? team1 : team2);
          
          playoffMatches.push({
            team1,
            team2,
            score1: match1.score1,
            score2: match1.score2,
            winner
          });
          
          playoffWinners.push(winner);
        } else if (playoffWinners.length < playoffTeams) {
          playoffWinners.push(playoffCandidates[i]);
        }
      }

      qualifiedTeams.push(...playoffWinners.slice(0, playoffTeams));
    }
    
    // Armazena resultados por confederação
    confederationResults[confederation] = {
      autoQualified: autoQualifiedList,
      playoffMatches: playoffMatches
    };
  });

  // Ordena por rating para garantir qualidade
  qualifiedTeams.sort((a, b) => b.rating - a.rating);

  // Garante exatamente 32 times (ou menos se não houver times suficientes)
  const result = qualifiedTeams.slice(0, 32);
  
  // Retorna também os resultados detalhados por confederação
  return {
    qualifiedTeams: result,
    confederationResults: confederationResults
  };
};

// Simula grupos de eliminatórias dentro de uma confederação
const simulateQualificationGroups = (teams, quota) => {
  if (teams.length <= quota) {
    return {
      qualified: teams,
      groupMatches: [],
      groupStandings: []
    };
  }

  // Divide em grupos (aproximadamente 4-6 times por grupo)
  const groupsPerConfederation = Math.ceil(teams.length / 5); // ~5 times por grupo
  const teamsPerGroup = Math.ceil(teams.length / groupsPerConfederation);
  
  const groups = [];
  for (let i = 0; i < teams.length; i += teamsPerGroup) {
    groups.push(teams.slice(i, i + teamsPerGroup));
  }

  const allMatches = [];
  const allStandings = [];
  const groupQualified = [];

  // Simula cada grupo
  groups.forEach((group, groupIndex) => {
    const standings = group.map(team => ({
      team,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      matches: 0
    }));

    // Todos contra todos (ida e volta)
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const team1 = group[i];
        const team2 = group[j];
        
        // Jogo de ida
        const match1 = generateScoreForQualifier(team1, team2);
        // Jogo de volta
        const match2 = generateScoreForQualifier(team2, team1);
        
        const t1Idx = standings.findIndex(s => s.team === team1);
        const t2Idx = standings.findIndex(s => s.team === team2);
        
        // Atualiza estatísticas
        standings[t1Idx].goalsFor += match1.score1 + match2.score2;
        standings[t1Idx].goalsAgainst += match1.score2 + match2.score1;
        standings[t2Idx].goalsFor += match1.score2 + match2.score1;
        standings[t2Idx].goalsAgainst += match1.score1 + match2.score2;
        standings[t1Idx].matches += 2;
        standings[t2Idx].matches += 2;
        
        // Pontos
        if (match1.score1 > match1.score2) {
          standings[t1Idx].points += 3;
          standings[t1Idx].wins += 1;
          standings[t2Idx].losses += 1;
        } else if (match1.score1 < match1.score2) {
          standings[t2Idx].points += 3;
          standings[t2Idx].wins += 1;
          standings[t1Idx].losses += 1;
        } else {
          standings[t1Idx].points += 1;
          standings[t2Idx].points += 1;
          standings[t1Idx].draws += 1;
          standings[t2Idx].draws += 1;
        }
        
        if (match2.score1 > match2.score2) {
          standings[t2Idx].points += 3;
          standings[t2Idx].wins += 1;
          standings[t1Idx].losses += 1;
        } else if (match2.score1 < match2.score2) {
          standings[t1Idx].points += 3;
          standings[t1Idx].wins += 1;
          standings[t2Idx].losses += 1;
        } else {
          standings[t1Idx].points += 1;
          standings[t2Idx].points += 1;
          standings[t1Idx].draws += 1;
          standings[t2Idx].draws += 1;
        }
        
        allMatches.push({
          group: groupIndex + 1,
          team1,
          team2,
          match1: { score1: match1.score1, score2: match1.score2 },
          match2: { score1: match2.score1, score2: match2.score2 },
          total1: match1.score1 + match2.score2,
          total2: match1.score2 + match2.score1,
          winner: (match1.score1 + match2.score2) > (match1.score2 + match2.score1) ? team1 :
                  (match1.score2 + match2.score1) > (match1.score1 + match2.score2) ? team2 : null
        });
      }
    }

    // Ordena por pontos, saldo, gols pró
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });

    allStandings.push({
      group: groupIndex + 1,
      teams: group,
      standings
    });

    // Classifica o primeiro de cada grupo (ou mais, dependendo da quota)
    const qualifiedPerGroup = Math.max(1, Math.floor(quota / groupsPerConfederation));
    groupQualified.push(...standings.slice(0, qualifiedPerGroup).map(s => s.team));
  });

  // Se ainda faltam vagas, faz playoffs entre os segundos lugares (ou próximos)
  const remainingQuota = quota - groupQualified.length;
  if (remainingQuota > 0) {
    const playoffCandidates = [];
    allStandings.forEach(groupData => {
      const qualified = groupQualified.filter(q => 
        groupData.teams.some(t => t.name === q.name)
      );
      // Pega o próximo não qualificado do grupo
      const next = groupData.standings.find(s => 
        !qualified.some(q => q.name === s.team.name)
      );
      if (next) playoffCandidates.push(next.team);
    });

    // Ordena por rating e pega os melhores
    playoffCandidates.sort((a, b) => b.rating - a.rating);
    groupQualified.push(...playoffCandidates.slice(0, remainingQuota));
  }

  return {
    qualified: groupQualified.slice(0, quota),
    groupMatches: allMatches,
    groupStandings: allStandings
  };
};

// Simula eliminatórias com visualização detalhada
export const simulateQualifiersDetailed = (useFullList = true) => {
  const results = {
    qualified: [],
    byConfederation: {},
    playoffs: [],
    allTeams: {}, // Todas as seleções que participaram por confederação
    qualificationGroups: {} // Grupos e partidas das eliminatórias
  };

  const teamsSource = useFullList && allTeamsFull ? allTeamsFull : allTeams;

  Object.keys(worldCupQuotas).forEach(confederation => {
    if (confederation === 'HOST') return;

    const teams = teamsSource[confederation] || [];
    const quota = worldCupQuotas[confederation];

    if (teams.length === 0) return;

    // Embaralha para não sempre os mesmos se classificarem
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const sortedTeams = shuffled.sort((a, b) => b.rating - a.rating);
    
    // Salva TODAS as seleções que participaram
    results.allTeams[confederation] = sortedTeams;

    // Simula eliminatórias com grupos e partidas reais
    const qualificationResult = simulateQualificationGroups(sortedTeams, quota);
    
    results.qualified.push(...qualificationResult.qualified);
    results.byConfederation[confederation] = qualificationResult.qualified;
    
    // Armazena informações dos grupos
    results.qualificationGroups[confederation] = {
      groups: qualificationResult.groupStandings,
      matches: qualificationResult.groupMatches
    };
  });

  results.qualified.sort((a, b) => b.rating - a.rating);
  
  // Se tiver menos de 32, completa com os melhores times restantes de todas as confederações
  if (results.qualified.length < 32) {
    const allRemainingTeams = [];
    
    // Coleta todos os times não qualificados de todas as confederações
    Object.keys(results.allTeams).forEach(conf => {
      const allTeamsInConf = results.allTeams[conf] || [];
      const qualifiedInConf = results.byConfederation[conf] || [];
      
      allTeamsInConf.forEach(team => {
        if (!qualifiedInConf.some(q => q.name === team.name)) {
          allRemainingTeams.push(team);
        }
      });
    });
    
    // Ordena por rating e pega os melhores até completar 32
    allRemainingTeams.sort((a, b) => b.rating - a.rating);
    const needed = 32 - results.qualified.length;
    const additionalTeams = allRemainingTeams.slice(0, needed);
    
    // Adiciona os times adicionais
    results.qualified.push(...additionalTeams);
    
    // Atualiza byConfederation para incluir os times adicionais
    additionalTeams.forEach(team => {
      const conf = team.confederation;
      if (!results.byConfederation[conf]) {
        results.byConfederation[conf] = [];
      }
      if (!results.byConfederation[conf].some(q => q.name === team.name)) {
        results.byConfederation[conf].push(team);
      }
    });
    
    console.log(`Completado para 32 times: adicionados ${additionalTeams.length} times adicionais.`);
  }
  
  // Garante exatamente 32 times (ou menos se não houver suficientes)
  const finalQualified = results.qualified.slice(0, 32);
  
  if (finalQualified.length < 32) {
    console.warn(`Apenas ${finalQualified.length} times qualificados. Necessário 32 para a Copa do Mundo.`);
  }
  
  // Atualiza os resultados com a lista final
  results.qualified = finalQualified;
  
  // Atualiza byConfederation para refletir apenas os qualificados finais
  Object.keys(results.byConfederation).forEach(conf => {
    results.byConfederation[conf] = results.byConfederation[conf].filter(team =>
      finalQualified.some(q => q.name === team.name)
    );
  });

  return results;
};

