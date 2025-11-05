import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlagImageUrl } from '../utils/flags';
import { calculateTeamStatistics } from '../utils/statistics';
import { getDetailedData } from '../utils/storage';
import BracketView from './BracketView';

const WorldCupDetails = ({ cupData, onClose }) => {
  const [detailedData, setDetailedData] = useState(null);
  
  useEffect(() => {
    // Se não tiver fullData, tenta buscar do armazenamento detalhado
    if (!cupData?.fullData && cupData?.year) {
      const detailed = getDetailedData(cupData.year);
      if (detailed) {
        setDetailedData(detailed);
      }
    }
  }, [cupData]);
  
  if (!cupData) {
    return null;
  }

  // Usa dados detalhados se disponíveis, senão usa dados básicos
  const fullData = cupData.fullData || detailedData?.fullData;
  const qualifiersData = cupData.qualifiersData || detailedData?.qualifiersData;

  // Se não tiver dados completos (copas antigas), mostra mensagem
  if (!fullData) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">
                Copa do Mundo {cupData.year}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <p className="text-white">
              Esta Copa foi simulada antes da atualização de estatísticas. 
              Simule novamente para ver estatísticas detalhadas.
            </p>
            <div className="mt-4 p-4 bg-gray-700/50 rounded">
              <p className="text-white font-semibold">🏆 Campeão: {cupData.champion.name}</p>
              <p className="text-white">🥈 Vice: {cupData.runnerUp.name}</p>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const stats = calculateTeamStatistics(fullData);
  const [activeTab, setActiveTab] = useState('stats'); // stats, bracket

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center z-10">
            <h2 className="text-4xl font-bold text-yellow-400">
              Copa do Mundo {cupData.year}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 p-6 border-b border-gray-700 flex-wrap">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              📊 Estatísticas
            </button>
            <button
              onClick={() => setActiveTab('bracket')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'bracket'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              🏆 Chave Eliminatória
            </button>
            {qualifiersData && (
              <button
                onClick={() => setActiveTab('qualifiers')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'qualifiers'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                🌍 Eliminatórias
              </button>
            )}
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === 'stats' && (
            <>
              {/* Campeão e Vice */}
              <div className="p-6 border-b border-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4">
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">🏆 Campeão</h3>
                    <div className="flex items-center gap-3">
                      <img 
                        src={getFlagImageUrl(cupData.champion.name, 'w40')} 
                        alt={cupData.champion.name}
                        className="w-10 h-7 object-cover border border-gray-300 rounded"
                      />
                      <span className="text-2xl font-bold text-white">{cupData.champion.name}</span>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">🥈 Vice-Campeão</h3>
                    <div className="flex items-center gap-3">
                      <img 
                        src={getFlagImageUrl(cupData.runnerUp.name, 'w40')} 
                        alt={cupData.runnerUp.name}
                        className="w-10 h-7 object-cover border border-gray-300 rounded"
                      />
                      <span className="text-2xl font-bold text-white">{cupData.runnerUp.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas Gerais */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">Estatísticas por Seleção</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700 text-white">
                        <th className="px-4 py-3 text-left">Pos</th>
                        <th className="px-4 py-3 text-left">Seleção</th>
                        <th className="px-4 py-3 text-center">J</th>
                        <th className="px-4 py-3 text-center">V</th>
                        <th className="px-4 py-3 text-center">E</th>
                        <th className="px-4 py-3 text-center">D</th>
                        <th className="px-4 py-3 text-center">GP</th>
                        <th className="px-4 py-3 text-center">GC</th>
                        <th className="px-4 py-3 text-center">SG</th>
                        <th className="px-4 py-3 text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((stat, index) => (
                    <motion.tr
                      key={stat.team.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`border-b border-gray-700 hover:bg-gray-700/50 ${
                        stat.team.name === cupData.champion.name ? 'bg-yellow-400/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-white font-semibold">{index + 1}º</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img 
                            src={getFlagImageUrl(stat.team.name, 'w20')} 
                            alt={stat.team.name}
                            className="w-6 h-4 object-cover border border-gray-300 rounded"
                          />
                          <span className="text-white font-semibold">{stat.team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white text-center">{stat.matches}</td>
                      <td className="px-4 py-3 text-green-400 text-center font-bold">{stat.wins}</td>
                      <td className="px-4 py-3 text-yellow-400 text-center font-bold">{stat.draws}</td>
                      <td className="px-4 py-3 text-red-400 text-center font-bold">{stat.losses}</td>
                      <td className="px-4 py-3 text-white text-center font-bold">{stat.goalsFor}</td>
                      <td className="px-4 py-3 text-white text-center">{stat.goalsAgainst}</td>
                      <td className={`px-4 py-3 text-center font-bold ${
                        (stat.goalsFor - stat.goalsAgainst) > 0 ? 'text-green-400' : 
                        (stat.goalsFor - stat.goalsAgainst) < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {stat.goalsFor - stat.goalsAgainst > 0 ? '+' : ''}{stat.goalsFor - stat.goalsAgainst}
                      </td>
                        <td className="px-4 py-3 text-yellow-400 text-center font-bold">{stat.points}</td>
                      </motion.tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>
            </>
          )}

          {activeTab === 'bracket' && (
            <div className="p-6">
              <BracketView cupData={cupData} />
            </div>
          )}

          {activeTab === 'qualifiers' && qualifiersData && (
            <div className="p-6">
              <QualifiersReport qualifiersData={qualifiersData} />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Componente para exibir relatório das eliminatórias
const QualifiersReport = ({ qualifiersData }) => {
  const confederationNames = {
    'UEFA': 'Europa',
    'CONMEBOL': 'América do Sul',
    'CONCACAF': 'América do Norte/Central',
    'CAF': 'África',
    'AFC': 'Ásia',
    'OFC': 'Oceania'
  };

  const worldCupQuotas = {
    UEFA: 13,
    CONMEBOL: 4,
    CONCACAF: 4,
    CAF: 5,
    AFC: 4,
    OFC: 1,
  };

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-yellow-400 mb-6">
        📋 Relatório das Eliminatórias
      </h3>

      {/* Resumo Geral */}
      <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
        <h4 className="text-xl font-bold text-white mb-4">Resumo Geral</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm">Total Qualificados</p>
            <p className="text-2xl font-bold text-yellow-400">
              {qualifiersData.qualified?.length || 0}/32
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm">Confederações</p>
            <p className="text-2xl font-bold text-white">
              {Object.keys(qualifiersData.byConfederation || {}).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm">Playoffs Realizados</p>
            <p className="text-2xl font-bold text-white">
              {qualifiersData.playoffs?.length || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-gray-400 text-sm">Qualificação Automática</p>
            <p className="text-2xl font-bold text-green-400">
              {qualifiersData.qualified?.length - (qualifiersData.playoffs?.reduce((sum, p) => sum + (p.matches?.length || 0), 0) || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Por Confederação */}
      {Object.keys(qualifiersData.allTeams || qualifiersData.byConfederation || {}).map(confederation => {
        const allTeams = qualifiersData.allTeams?.[confederation] || [];
        const qualified = qualifiersData.byConfederation?.[confederation] || [];
        const playoff = qualifiersData.playoffs?.find(p => p.confederation === confederation);
        const quota = worldCupQuotas[confederation] || 0;
        const eliminated = allTeams.filter(team => !qualified.some(q => q.name === team.name));

        return (
          <motion.div
            key={confederation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700/50 rounded-lg p-6 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-2xl font-bold text-white">
                  {confederationNames[confederation] || confederation}
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  Total de participantes: {allTeams.length} seleções
                </p>
              </div>
              <span className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-lg font-semibold">
                {qualified.length}/{quota} Vagas
              </span>
            </div>

            {/* Qualificados Automaticamente */}
            {qualified.length > 0 && (
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-green-400 mb-3">
                  ✅ Qualificados ({qualified.length})
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {qualified.map(team => (
                    <div
                      key={team.name}
                      className="bg-gray-800 rounded-lg p-3 flex flex-col items-center border border-gray-600"
                    >
                      <img
                        src={getFlagImageUrl(team.name, 'w40')}
                        alt={team.name}
                        className="w-10 h-7 object-cover border border-gray-300 rounded mb-2"
                      />
                      <span className="text-sm font-semibold text-white text-center">
                        {team.name}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Rating: {team.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eliminadas (se houver) */}
            {eliminated.length > 0 && (
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-red-400 mb-3">
                  ❌ Eliminadas ({eliminated.length})
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-60 overflow-y-auto">
                  {eliminated.map(team => (
                    <div
                      key={team.name}
                      className="bg-gray-800/50 rounded-lg p-2 flex flex-col items-center border border-gray-700 opacity-70"
                    >
                      <img
                        src={getFlagImageUrl(team.name, 'w40')}
                        alt={team.name}
                        className="w-8 h-5 object-cover border border-gray-300 rounded mb-1"
                      />
                      <span className="text-xs font-semibold text-gray-400 text-center">
                        {team.name}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {team.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grupos de Eliminatórias */}
            {qualifiersData.qualificationGroups?.[confederation] && (
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-yellow-400 mb-3">
                  📋 Grupos de Eliminatórias
                </h5>
                {qualifiersData.qualificationGroups[confederation].groups.map((groupData, gIdx) => (
                  <div key={gIdx} className="mb-4 bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <h6 className="text-md font-bold text-white mb-3">Grupo {groupData.group}</h6>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-700 text-white">
                            <th className="px-2 py-2 text-left">Pos</th>
                            <th className="px-2 py-2 text-left">Time</th>
                            <th className="px-2 py-2 text-center">Pts</th>
                            <th className="px-2 py-2 text-center">J</th>
                            <th className="px-2 py-2 text-center">V</th>
                            <th className="px-2 py-2 text-center">E</th>
                            <th className="px-2 py-2 text-center">D</th>
                            <th className="px-2 py-2 text-center">GP</th>
                            <th className="px-2 py-2 text-center">GC</th>
                            <th className="px-2 py-2 text-center">SG</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupData.standings.map((standing, idx) => {
                            const isQualified = qualified.some(q => q.name === standing.team.name);
                            return (
                              <tr
                                key={standing.team.name}
                                className={`border-b border-gray-700 ${isQualified ? 'bg-green-400/20' : ''}`}
                              >
                                <td className="px-2 py-2 text-white font-semibold">{idx + 1}º</td>
                                <td className="px-2 py-2">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={getFlagImageUrl(standing.team.name, 'w20')}
                                      alt={standing.team.name}
                                      className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                                    />
                                    <span className="text-white text-xs">{standing.team.name}</span>
                                    {isQualified && <span className="text-green-400 text-xs">✅</span>}
                                  </div>
                                </td>
                                <td className="px-2 py-2 text-yellow-400 font-bold text-center">{standing.points}</td>
                                <td className="px-2 py-2 text-white text-center">{standing.matches}</td>
                                <td className="px-2 py-2 text-green-400 text-center">{standing.wins}</td>
                                <td className="px-2 py-2 text-yellow-400 text-center">{standing.draws}</td>
                                <td className="px-2 py-2 text-red-400 text-center">{standing.losses}</td>
                                <td className="px-2 py-2 text-white text-center">{standing.goalsFor}</td>
                                <td className="px-2 py-2 text-white text-center">{standing.goalsAgainst}</td>
                                <td className={`px-2 py-2 text-center font-bold ${
                                  (standing.goalsFor - standing.goalsAgainst) > 0 ? 'text-green-400' :
                                  (standing.goalsFor - standing.goalsAgainst) < 0 ? 'text-red-400' : 'text-gray-400'
                                }`}>
                                  {(standing.goalsFor - standing.goalsAgainst) > 0 ? '+' : ''}
                                  {standing.goalsFor - standing.goalsAgainst}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Partidas do Grupo */}
                    <div className="mt-4">
                      <h6 className="text-sm font-semibold text-gray-300 mb-2">Partidas do Grupo</h6>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {qualifiersData.qualificationGroups[confederation].matches
                          .filter(m => m.group === groupData.group)
                          .map((match, mIdx) => (
                            <div key={mIdx} className="bg-gray-700/30 rounded p-2 text-xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 flex-1">
                                  <img
                                    src={getFlagImageUrl(match.team1.name, 'w16')}
                                    alt={match.team1.name}
                                    className="w-4 h-3 object-cover border border-gray-300 rounded"
                                  />
                                  <span className="text-white">{match.team1.name}</span>
                                </div>
                                <span className="text-yellow-400 font-bold mx-2">
                                  {match.match1.score1}-{match.match1.score2} | {match.match2.score1}-{match.match2.score2}
                                </span>
                                <div className="flex items-center gap-1 flex-1 justify-end">
                                  <span className="text-white">{match.team2.name}</span>
                                  <img
                                    src={getFlagImageUrl(match.team2.name, 'w16')}
                                    alt={match.team2.name}
                                    className="w-4 h-3 object-cover border border-gray-300 rounded"
                                  />
                                </div>
                              </div>
                              <div className="text-center text-gray-400 mt-1">
                                Total: {match.total1} - {match.total2}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Playoffs (mantido para compatibilidade) */}
            {playoff && playoff.matches && playoff.matches.length > 0 && (
              <div>
                <h5 className="text-lg font-semibold text-yellow-400 mb-3">
                  ⚽ Playoffs ({playoff.matches.length} partidas)
                </h5>
                <div className="space-y-3">
                  {playoff.matches.map((match, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={getFlagImageUrl(match.team1.name, 'w20')}
                            alt={match.team1.name}
                            className="w-6 h-4 object-cover border border-gray-300 rounded"
                          />
                          <span className="text-white font-semibold">
                            {match.team1.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mx-4">
                          <span className={`text-lg font-bold ${
                            match.winner?.name === match.team1.name
                              ? 'text-yellow-400'
                              : 'text-gray-400'
                          }`}>
                            {match.score1 || match.match1?.score1 || 0}
                          </span>
                          <span className="text-gray-500">-</span>
                          <span className={`text-lg font-bold ${
                            match.winner?.name === match.team2.name
                              ? 'text-yellow-400'
                              : 'text-gray-400'
                          }`}>
                            {match.score2 || match.match1?.score2 || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-1 justify-end">
                          <span className="text-white font-semibold">
                            {match.team2.name}
                          </span>
                          <img
                            src={getFlagImageUrl(match.team2.name, 'w20')}
                            alt={match.team2.name}
                            className="w-6 h-4 object-cover border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      {match.winner && (
                        <div className="mt-2 text-center">
                          <span className="text-sm text-gray-400">
                            Vencedor: <span className="font-bold text-yellow-400">
                              {match.winner.name}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default WorldCupDetails;

