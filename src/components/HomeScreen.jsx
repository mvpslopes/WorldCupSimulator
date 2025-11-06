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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 via-gray-900 to-black p-6 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/3 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header moderno */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-block mb-6"
          >
            <div className="text-7xl md:text-9xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
              🏆
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-gradient drop-shadow-2xl"
            style={{ textShadow: '0 0 30px rgba(234, 179, 8, 0.3)' }}
          >
            Simulador de Copas do Mundo
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg md:text-xl lg:text-2xl font-light tracking-wide"
          >
            Simule copas do mundo com todas as <span className="text-yellow-400 font-semibold">211 seleções</span> da FIFA
          </motion.p>
        </div>

        {/* Botões principais */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-16 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartSimulation}
            className="btn-primary text-base sm:text-xl md:text-2xl px-4 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 relative group w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">⚡</span>
              <span className="flex-1 sm:flex-none">Avançar 4 Anos</span>
              <span className="bg-black/20 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-lg font-bold">{currentYear}</span>
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBulkModal(true)}
            className="btn-secondary text-sm sm:text-lg md:text-xl flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="text-lg sm:text-xl">🚀</span>
            <span>Avançar Múltiplas Copas</span>
          </motion.button>
          {history.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewDashboard}
                className="btn-secondary text-sm sm:text-lg md:text-xl flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="text-lg sm:text-xl">📊</span>
                <span>Dashboard</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGlobalStats(!showGlobalStats)}
                className={`btn-secondary text-sm sm:text-lg md:text-xl flex items-center justify-center gap-2 w-full sm:w-auto ${
                  showGlobalStats ? 'bg-yellow-500/20 border-yellow-500/50' : ''
                }`}
              >
                <span className="text-lg sm:text-xl">📈</span>
                <span>Estatísticas</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRanking(!showRanking)}
                className={`btn-secondary text-sm sm:text-lg md:text-xl flex items-center justify-center gap-2 w-full sm:w-auto ${
                  showRanking ? 'bg-yellow-500/20 border-yellow-500/50' : ''
                }`}
              >
                <span className="text-lg sm:text-xl">🏅</span>
                <span>Ranking</span>
              </motion.button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="btn-secondary text-sm sm:text-lg md:text-xl flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="text-lg sm:text-xl">⚙️</span>
            <span>Configurações</span>
          </motion.button>
        </div>

        {/* Histórico de Copas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient flex items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl animate-pulse">📜</span>
              <span>Histórico de Copas</span>
            </h2>
            {history.length > 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 sm:px-4 py-1 sm:py-2">
                <span className="text-yellow-400 font-bold text-base sm:text-lg">{history.length}</span>
                <span className="text-gray-300 ml-2 text-sm sm:text-base">edição{history.length !== 1 ? 'ões' : ''}</span>
              </div>
            )}
          </div>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🏆</div>
              <p className="text-gray-400 text-xl">Nenhuma Copa simulada ainda.</p>
              <p className="text-gray-500 text-sm mt-2">Comece simulando sua primeira Copa do Mundo!</p>
            </div>
          ) : (
            <>
              {/* Tabela para desktop */}
              <div className="hidden md:block overflow-x-auto">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <span className="text-blue-400 text-xl">💡</span>
                  <p className="text-blue-300 text-sm">Clique em uma linha para ver estatísticas detalhadas</p>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-700/50">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800/90 via-gray-700/90 to-gray-800/90 text-white">
                        <th className="px-6 py-4 text-left font-bold text-yellow-400">Ano</th>
                        <th className="px-6 py-4 text-left font-bold">Campeão</th>
                        <th className="px-6 py-4 text-left font-bold">Vice</th>
                        <th className="px-6 py-4 text-left font-bold">Gols do Campeão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((cup, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-700/30 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:via-yellow-500/5 hover:to-transparent cursor-pointer transition-all duration-300 group"
                          onClick={() => setSelectedCup(cup)}
                        >
                        <td className="px-6 py-4 font-bold text-white group-hover:text-yellow-400 transition-colors">
                          <span className="text-2xl">{cup.year}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-3">
                            <img 
                              src={getDisplayFlagUrl(cup.champion)} 
                              alt={cup.champion.name}
                              className="w-8 h-6 object-cover border-2 border-gray-400 rounded-lg shadow-md group-hover:scale-110 group-hover:border-yellow-400 transition-all duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                            <span className="flag-emoji text-2xl" style={{ display: 'none' }}>
                              {getFlagByName(cup.champion.name)}
                            </span>
                            <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">{cup.champion.name}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-3">
                            <img 
                              src={getDisplayFlagUrl(cup.runnerUp)} 
                              alt={cup.runnerUp.name}
                              className="w-8 h-6 object-cover border-2 border-gray-400 rounded-lg shadow-md group-hover:scale-110 transition-all duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                            <span className="flag-emoji text-2xl" style={{ display: 'none' }}>
                              {getFlagByName(cup.runnerUp.name)}
                            </span>
                            <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{cup.runnerUp.name}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-lg font-bold text-yellow-400 group-hover:bg-yellow-500/30 group-hover:scale-110 transition-all duration-300">
                            {cup.championGoals}
                          </span>
                        </td>
                      </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cards para mobile */}
              <div className="md:hidden space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 mb-3 flex items-center gap-2">
                  <span className="text-blue-400 text-lg">💡</span>
                  <p className="text-blue-300 text-xs">Toque em um card para ver detalhes</p>
                </div>
                {history.map((cup, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedCup(cup)}
                    className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-yellow-400">{cup.year}</div>
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-500/20 border border-yellow-500/30 rounded-lg font-bold text-yellow-400">
                        {cup.championGoals}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-16">Campeão:</span>
                        <img 
                          src={getDisplayFlagUrl(cup.champion)} 
                          alt={cup.champion.name}
                          className="w-6 h-4 object-cover border border-gray-400 rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span className="flag-emoji text-sm" style={{ display: 'none' }}>
                          {getFlagByName(cup.champion.name)}
                        </span>
                        <span className="font-semibold text-white text-sm flex-1">{cup.champion.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-16">Vice:</span>
                        <img 
                          src={getDisplayFlagUrl(cup.runnerUp)} 
                          alt={cup.runnerUp.name}
                          className="w-6 h-4 object-cover border border-gray-400 rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span className="flag-emoji text-sm" style={{ display: 'none' }}>
                          {getFlagByName(cup.runnerUp.name)}
                        </span>
                        <span className="font-medium text-gray-300 text-sm flex-1">{cup.runnerUp.name}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Estatísticas Gerais */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gradient flex items-center gap-3">
                <span className="text-3xl">🏅</span>
                <span>Total de Títulos</span>
              </h2>
              {Object.keys(titles).length > 0 && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
                  <span className="text-yellow-400 font-bold">{Object.keys(titles).length}</span>
                </div>
              )}
            </div>
            {Object.keys(titles).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4 opacity-50">🏆</div>
                <p className="text-gray-400">Nenhum título ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(titles)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count], index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
                        name === topChampion[0] 
                          ? 'bg-gradient-to-r from-yellow-400/20 via-yellow-500/15 to-yellow-400/20 font-bold border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/20' 
                          : 'bg-gray-700/40 border border-gray-600/50 hover:bg-gray-700/60 hover:border-gray-500/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${index === 0 ? 'text-2xl' : index === 1 ? 'text-xl' : index === 2 ? 'text-lg' : ''}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                        </div>
                        <img 
                          src={getFlagImageUrl(name)} 
                          alt={name}
                          className="w-7 h-5 object-cover border-2 border-gray-400 rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span className="flag-emoji text-xl" style={{ display: 'none' }}>
                          {getFlagByName(name)}
                        </span>
                        <span className={`text-lg ${name === topChampion[0] ? 'text-yellow-300' : 'text-white'}`}>{name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${name === topChampion[0] ? 'text-yellow-400' : 'text-yellow-500'}`}>{count}</span>
                        <span className="text-gray-400 text-sm">título{count !== 1 ? 's' : ''}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <span>Gráfico de Títulos</span>
            </h2>
            {titlesData.length > 0 ? (
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={titlesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100} 
                      stroke="#d1d5db" 
                      fontSize={12}
                      tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis 
                      stroke="#d1d5db" 
                      fontSize={12}
                      tick={{ fill: '#9ca3af' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #4b5563', 
                        color: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                      }} 
                      cursor={{ fill: 'rgba(234, 179, 8, 0.1)' }}
                    />
                    <Bar 
                      dataKey="títulos" 
                      fill="url(#colorGradient)"
                      radius={[8, 8, 0, 0]}
                    >
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#eab308" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4 opacity-50">📊</div>
                <p className="text-gray-400">Nenhum dado para exibir.</p>
              </div>
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

