import { motion } from 'framer-motion';
import { getFlagImageUrl } from '../utils/flags';
import { calculateTeamStatistics } from '../utils/statistics';

const ComparisonView = ({ cup1, cup2, onClose }) => {
  if (!cup1 || !cup2) return null;

  const stats1 = cup1.fullData ? calculateTeamStatistics(cup1.fullData) : [];
  const stats2 = cup2.fullData ? calculateTeamStatistics(cup2.fullData) : [];

  const getTopStat = (stats, statKey) => {
    if (!stats || stats.length === 0) return null;
    return stats.reduce((max, stat) => stat[statKey] > max[statKey] ? stat : max);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-yellow-400">
            Comparação: {cup1.year} vs {cup2.year}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Campeões */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{cup1.year} - Campeão</h3>
              <div className="flex items-center gap-3">
                <img 
                  src={getFlagImageUrl(cup1.champion.name, 'w40')} 
                  alt={cup1.champion.name}
                  className="w-10 h-7 object-cover border border-gray-300 rounded"
                />
                <span className="text-2xl font-bold text-white">{cup1.champion.name}</span>
              </div>
            </div>
            <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{cup2.year} - Campeão</h3>
              <div className="flex items-center gap-3">
                <img 
                  src={getFlagImageUrl(cup2.champion.name, 'w40')} 
                  alt={cup2.champion.name}
                  className="w-10 h-7 object-cover border border-gray-300 rounded"
                />
                <span className="text-2xl font-bold text-white">{cup2.champion.name}</span>
              </div>
            </div>
          </div>

          {/* Comparação de Estatísticas */}
          {stats1.length > 0 && stats2.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Comparação de Recordes</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Mais Gols */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">⚽ Mais Gols</h4>
                  <div className="space-y-3">
                    <div className="border-b border-gray-600 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src={getFlagImageUrl(getTopStat(stats1, 'goalsFor')?.team.name || '', 'w20')} 
                          alt=""
                          className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                        />
                        <span className="text-white text-sm font-semibold">{getTopStat(stats1, 'goalsFor')?.team.name || 'N/A'}</span>
                      </div>
                      <span className="text-yellow-400 font-bold">{cup1.year}: {getTopStat(stats1, 'goalsFor')?.goalsFor || 0} gols</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src={getFlagImageUrl(getTopStat(stats2, 'goalsFor')?.team.name || '', 'w20')} 
                          alt=""
                          className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                        />
                        <span className="text-white text-sm font-semibold">{getTopStat(stats2, 'goalsFor')?.team.name || 'N/A'}</span>
                      </div>
                      <span className="text-yellow-400 font-bold">{cup2.year}: {getTopStat(stats2, 'goalsFor')?.goalsFor || 0} gols</span>
                    </div>
                  </div>
                </div>

                {/* Mais Vitórias */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">🏆 Mais Vitórias</h4>
                  <div className="space-y-3">
                    <div className="border-b border-gray-600 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src={getFlagImageUrl(getTopStat(stats1, 'wins')?.team.name || '', 'w20')} 
                          alt=""
                          className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                        />
                        <span className="text-white text-sm font-semibold">{getTopStat(stats1, 'wins')?.team.name || 'N/A'}</span>
                      </div>
                      <span className="text-yellow-400 font-bold">{cup1.year}: {getTopStat(stats1, 'wins')?.wins || 0} vitórias</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src={getFlagImageUrl(getTopStat(stats2, 'wins')?.team.name || '', 'w20')} 
                          alt=""
                          className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                        />
                        <span className="text-white text-sm font-semibold">{getTopStat(stats2, 'wins')?.team.name || 'N/A'}</span>
                      </div>
                      <span className="text-yellow-400 font-bold">{cup2.year}: {getTopStat(stats2, 'wins')?.wins || 0} vitórias</span>
                    </div>
                  </div>
                </div>

                {/* Total de Gols na Edição */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">📊 Total de Gols</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-400">{stats1.reduce((sum, s) => sum + s.goalsFor, 0)}</p>
                      <p className="text-gray-400 text-sm">{cup1.year}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-400">{stats2.reduce((sum, s) => sum + s.goalsFor, 0)}</p>
                      <p className="text-gray-400 text-sm">{cup2.year}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 5 Seleções de cada edição */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">{cup1.year} - Top 5</h4>
                  <div className="space-y-2">
                    {stats1.slice(0, 5).map((stat, index) => (
                      <div key={stat.team.name} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 font-bold w-6">{index + 1}º</span>
                          <img 
                            src={getFlagImageUrl(stat.team.name, 'w20')} 
                            alt={stat.team.name}
                            className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                          />
                          <span className="text-white font-semibold">{stat.team.name}</span>
                        </div>
                        <span className="text-yellow-400 font-bold">{stat.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">{cup2.year} - Top 5</h4>
                  <div className="space-y-2">
                    {stats2.slice(0, 5).map((stat, index) => (
                      <div key={stat.team.name} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 font-bold w-6">{index + 1}º</span>
                          <img 
                            src={getFlagImageUrl(stat.team.name, 'w20')} 
                            alt={stat.team.name}
                            className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                          />
                          <span className="text-white font-semibold">{stat.team.name}</span>
                        </div>
                        <span className="text-yellow-400 font-bold">{stat.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ComparisonView;

