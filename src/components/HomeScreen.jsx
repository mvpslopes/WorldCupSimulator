import { useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory, getTitles, getCurrentYear, resetAll } from '../utils/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { teams } from '../teams';
import { getFlagImageUrl, getFlag } from '../utils/flags';
import WorldCupDetails from './WorldCupDetails';
import GlobalStats from './GlobalStats';
import { calculateHistoricalRanking } from '../utils/ranking';
import SettingsPanel from './SettingsPanel';
import BulkSimulationModal from './BulkSimulationModal';

const HomeScreen = ({ onStartSimulation, onViewDashboard, onStartBulkSimulation }) => {
  const history = getHistory();
  const titles = getTitles();
  const currentYear = getCurrentYear();
  const [selectedCup, setSelectedCup] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGlobalStats, setShowGlobalStats] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Função auxiliar para buscar a bandeira pelo nome
  const getFlagByName = (name) => {
    // Primeiro tenta buscar no array de teams
    const team = teams.find(t => t.name === name);
    if (team && team.flag) {
      return team.flag;
    }
    // Se não encontrar, usa o mapeamento de flags
    return getFlag(name);
  };
  
  // Função para obter a URL da imagem da bandeira
  const getDisplayFlagUrl = (team) => {
    if (!team) return null;
    return getFlagImageUrl(team.name);
  };

  // Converte títulos em array para o gráfico
  const titlesData = Object.entries(titles)
    .map(([name, count]) => ({ name, títulos: count }))
    .sort((a, b) => b.títulos - a.títulos)
    .slice(0, 10); // Top 10

  // Gráfico de evolução de títulos
  const evolutionData = history.map(cup => ({
    year: cup.year,
    ...Object.keys(titles).reduce((acc, name) => {
      const count = history
        .filter(c => c.year <= cup.year && c.champion.name === name).length;
      if (count > 0) {
        acc[name] = count;
      }
      return acc;
    }, {})
  }));

  const historicalRanking = calculateHistoricalRanking(history);

  // Encontra o maior campeão
  const topChampion = Object.entries(titles).reduce((max, [name, count]) => 
    count > (max[1] || 0) ? [name, count] : max, ['', 0]
  );

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja reiniciar todo o histórico?')) {
      resetAll();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header moderno */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold mb-4 text-gradient drop-shadow-2xl"
          >
            🏆 Simulador de Copas do Mundo
          </motion.h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Simule copas do mundo com todas as 211 seleções da FIFA
          </p>
        </div>

        {/* Botões principais */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartSimulation}
            className="btn-primary text-xl md:text-2xl px-8 md:px-12 py-4 md:py-5"
          >
            ⚡ Avançar 4 Anos ({currentYear})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBulkModal(true)}
            className="btn-secondary text-lg md:text-xl"
          >
            🚀 Avançar Múltiplas Copas
          </motion.button>
          {history.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewDashboard}
                className="btn-secondary text-lg md:text-xl"
              >
                📊 Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGlobalStats(!showGlobalStats)}
                className="btn-secondary text-lg md:text-xl"
              >
                📈 Estatísticas
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRanking(!showRanking)}
                className="btn-secondary text-lg md:text-xl"
              >
                🏅 Ranking
              </motion.button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="btn-secondary text-lg md:text-xl"
          >
            ⚙️ Configurações
          </motion.button>
        </div>

        {/* Histórico de Copas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6 flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Histórico de Copas
          </h2>
          {history.length === 0 ? (
            <p className="text-white text-center py-8">Nenhuma Copa simulada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <p className="text-gray-400 text-sm mb-2">💡 Clique em uma linha para ver estatísticas detalhadas</p>
              <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-white">
                      <th className="px-4 py-4 text-left font-semibold">Ano</th>
                      <th className="px-4 py-4 text-left font-semibold">Campeão</th>
                      <th className="px-4 py-4 text-left font-semibold">Vice</th>
                      <th className="px-4 py-4 text-left font-semibold">Gols do Campeão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((cup, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-700/50 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-transparent cursor-pointer transition-all duration-200"
                        onClick={() => setSelectedCup(cup)}
                      >
                      <td className="px-4 py-3 font-semibold text-white">{cup.year}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <img 
                            src={getDisplayFlagUrl(cup.champion)} 
                            alt={cup.champion.name}
                            className="w-6 h-4 object-cover border border-gray-300 rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                          <span className="flag-emoji" style={{ display: 'none' }}>
                            {getFlagByName(cup.champion.name)}
                          </span>
                          <span className="font-semibold text-white">{cup.champion.name}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <img 
                            src={getDisplayFlagUrl(cup.runnerUp)} 
                            alt={cup.runnerUp.name}
                            className="w-6 h-4 object-cover border border-gray-300 rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                          <span className="flag-emoji" style={{ display: 'none' }}>
                            {getFlagByName(cup.runnerUp.name)}
                          </span>
                          <span className="font-semibold text-white">{cup.runnerUp.name}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">{cup.championGoals}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Estatísticas Gerais */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/90 rounded-lg p-6 shadow-xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Total de Títulos</h2>
            {Object.keys(titles).length === 0 ? (
              <p className="text-white text-center py-8">Nenhum título ainda.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(titles)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count], index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className={`flex justify-between items-center p-3 rounded ${
                        name === topChampion[0] ? 'bg-yellow-400/20 font-bold border border-yellow-400' : 'bg-gray-700/50'
                      }`}
                    >
                      <span className="text-lg flex items-center gap-2">
                        <img 
                          src={getFlagImageUrl(name)} 
                          alt={name}
                          className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span className="flag-emoji text-xl" style={{ display: 'none' }}>
                          {getFlagByName(name)}
                        </span>
                        <span className="text-white">{name}</span>
                      </span>
                      <span className="text-2xl font-bold text-yellow-400">{count}</span>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/90 rounded-lg p-6 shadow-xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Gráfico de Títulos</h2>
            {titlesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={titlesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
                  <Bar dataKey="títulos" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-white text-center py-8">Nenhum dado para exibir.</p>
            )}
          </motion.div>
        </div>

        {/* Estatísticas Globais */}
        {showGlobalStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <GlobalStats />
          </motion.div>
        )}

        {/* Ranking Histórico */}
        {showRanking && historicalRanking.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gray-800/90 rounded-lg p-6 shadow-xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">🏅 Ranking Histórico Geral</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="px-4 py-3 text-left">Pos</th>
                    <th className="px-4 py-3 text-left">Seleção</th>
                    <th className="px-4 py-3 text-center">Títulos</th>
                    <th className="px-4 py-3 text-center">Vices</th>
                    <th className="px-4 py-3 text-center">Participações</th>
                    <th className="px-4 py-3 text-center">Pontos Totais</th>
                    <th className="px-4 py-3 text-center">Melhor Posição</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalRanking.slice(0, 20).map((team, index) => (
                    <motion.tr
                      key={team.team.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`border-b border-gray-700 hover:bg-gray-700/50 ${
                        index < 3 ? 'bg-yellow-400/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-white font-semibold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''} {index + 1}º
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img 
                            src={getFlagImageUrl(team.team.name, 'w20')} 
                            alt={team.team.name}
                            className="w-6 h-4 object-cover border border-gray-300 rounded"
                          />
                          <span className="text-white font-semibold">{team.team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-yellow-400 text-center font-bold">{team.titles}</td>
                      <td className="px-4 py-3 text-gray-300 text-center">{team.runnerUps}</td>
                      <td className="px-4 py-3 text-white text-center">{team.appearances}</td>
                      <td className="px-4 py-3 text-yellow-400 text-center font-bold">{team.totalPoints}</td>
                      <td className="px-4 py-3 text-white text-center">
                        {team.bestPosition <= 3 ? (
                          <span className="font-bold text-yellow-400">{team.bestPosition}º</span>
                        ) : (
                          <span>{team.bestPosition}º</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Gráfico de Evolução */}
        {evolutionData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gray-800/90 rounded-lg p-6 shadow-xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">📈 Evolução de Títulos</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
                {Object.keys(titles).slice(0, 8).map((name, index) => {
                  const colors = ['#eab308', '#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];
                  return (
                    <Line 
                      key={name} 
                      type="monotone" 
                      dataKey={name} 
                      stroke={colors[index % colors.length]} 
                      strokeWidth={2}
                      name={name}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Botão de Reset */}
        {history.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            >
              Reiniciar Histórico
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Modal de Detalhes */}
      {selectedCup && (
        <WorldCupDetails 
          cupData={selectedCup} 
          onClose={() => setSelectedCup(null)} 
        />
      )}

      {/* Modal de Configurações */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
      
      {/* Modal de Simulação em Massa */}
      {showBulkModal && (
        <BulkSimulationModal
          onClose={() => setShowBulkModal(false)}
          onConfirm={(years) => {
            setShowBulkModal(false);
            onStartBulkSimulation(years);
          }}
        />
      )}
    </div>
  );
};

export default HomeScreen;

