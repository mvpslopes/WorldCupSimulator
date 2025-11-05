import { motion } from 'framer-motion';
import { getHistory } from '../utils/storage';
import { calculateGlobalStats } from '../utils/globalStats';
import { getFlagImageUrl } from '../utils/flags';

const GlobalStats = () => {
  const history = getHistory();
  const stats = calculateGlobalStats(history);

  if (history.length === 0) {
    return (
      <div className="bg-gray-800/90 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Estatísticas Globais</h2>
        <p className="text-white text-center py-8">Nenhuma estatística disponível ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/90 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Estatísticas Globais</h2>
      
      {/* Estatísticas Gerais */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total de Partidas</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.totalMatches}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total de Gols</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.totalGoals}</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Média de Gols/Partida</p>
          <p className="text-3xl font-bold text-yellow-400">
            {stats.totalMatches > 0 ? (stats.totalGoals / stats.totalMatches).toFixed(2) : '0'}
          </p>
        </div>
      </div>

      {/* Maior Goleada */}
      {stats.biggestWin && (
        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">🏆 Maior Goleada</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={getFlagImageUrl(stats.biggestWin.winner.name, 'w40')} 
                alt={stats.biggestWin.winner.name}
                className="w-10 h-7 object-cover border border-gray-300 rounded"
              />
              <span className="text-xl font-bold text-white">{stats.biggestWin.winner.name}</span>
              <span className="text-2xl font-bold text-yellow-400">{stats.biggestWin.winnerScore}</span>
            </div>
            <span className="text-gray-400">x</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-yellow-400">{stats.biggestWin.loserScore}</span>
              <span className="text-xl font-bold text-white">{stats.biggestWin.loser.name}</span>
              <img 
                src={getFlagImageUrl(stats.biggestWin.loser.name, 'w40')} 
                alt={stats.biggestWin.loser.name}
                className="w-10 h-7 object-cover border border-gray-300 rounded"
              />
            </div>
            <span className="text-gray-400 ml-4">({stats.biggestWin.year})</span>
          </div>
        </div>
      )}

      {/* Recordes */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {stats.records.mostWinsInEdition.team && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">⚽ Mais Vitórias em uma Edição</h3>
            <div className="flex items-center gap-2">
              <img 
                src={getFlagImageUrl(stats.records.mostWinsInEdition.team, 'w40')} 
                alt={stats.records.mostWinsInEdition.team}
                className="w-10 h-7 object-cover border border-gray-300 rounded"
              />
              <div>
                <p className="text-white font-bold">{stats.records.mostWinsInEdition.team}</p>
                <p className="text-gray-400 text-sm">{stats.records.mostWinsInEdition.wins} vitórias ({stats.records.mostWinsInEdition.year})</p>
              </div>
            </div>
          </div>
        )}
        
        {stats.records.bestDefense.team && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">🛡️ Melhor Defesa</h3>
            <div className="flex items-center gap-2">
              <img 
                src={getFlagImageUrl(stats.records.bestDefense.team, 'w40')} 
                alt={stats.records.bestDefense.team}
                className="w-10 h-7 object-cover border border-gray-300 rounded"
              />
              <div>
                <p className="text-white font-bold">{stats.records.bestDefense.team}</p>
                <p className="text-gray-400 text-sm">{stats.records.bestDefense.goalsAgainst} gols sofridos ({stats.records.bestDefense.year})</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confrontos Diretos */}
      {Object.keys(stats.headToHead).length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-yellow-400 mb-4">⚔️ Confrontos Diretos</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {Object.entries(stats.headToHead)
              .sort((a, b) => (b[1].team1Wins + b[1].team2Wins) - (a[1].team1Wins + a[1].team2Wins))
              .slice(0, 10)
              .map(([key, h2h]) => (
                <div key={key} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getFlagImageUrl(h2h.team1, 'w20')} 
                        alt={h2h.team1}
                        className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                      />
                      <span className="text-white text-sm font-semibold">{h2h.team1}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-yellow-400 font-bold">{h2h.team1Wins}</span>
                      <span className="text-gray-400 mx-2">-</span>
                      <span className="text-yellow-400 font-bold">{h2h.team2Wins}</span>
                      {h2h.draws > 0 && (
                        <span className="text-gray-400 text-xs ml-2">({h2h.draws}E)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold">{h2h.team2}</span>
                      <img 
                        src={getFlagImageUrl(h2h.team2, 'w20')} 
                        alt={h2h.team2}
                        className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalStats;

