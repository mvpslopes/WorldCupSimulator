import { useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory } from '../utils/storage';
import { getFlagImageUrl } from '../utils/flags';
import WorldCupDetails from './WorldCupDetails';
import ComparisonView from './ComparisonView';

const WorldCupDashboard = ({ onBack }) => {
  const history = getHistory();
  const [selectedCup, setSelectedCup] = useState(null);
  const [comparisonCups, setComparisonCups] = useState([]);
  const [filter, setFilter] = useState('all'); // all, champion

  // Ordena por ano (mais recente primeiro)
  const sortedHistory = [...history].sort((a, b) => b.year - a.year);

  // Filtra por campeão se necessário
  const filteredHistory = filter === 'all' 
    ? sortedHistory 
    : sortedHistory.filter(cup => cup.champion.name === filter);

  // Lista de campeões únicos para filtro
  const champions = [...new Set(history.map(cup => cup.champion.name))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-2" style={{ textShadow: '0 0 30px rgba(234, 179, 8, 0.3)' }}>
              🏆 Dashboard de Copas
            </h1>
            <p className="text-gray-300 text-lg">Explore todas as edições simuladas</p>
          </div>
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="btn-secondary flex items-center gap-2"
            >
              <span>←</span>
              <span>Voltar</span>
            </motion.button>
          )}
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8 text-center">
          <p className="text-blue-300 text-sm md:text-base">
            💡 Clique em uma edição para ver detalhes • Clique em duas para comparar • Botão direito para adicionar à comparação
          </p>
        </div>

        {/* Filtros e Comparação */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center items-center">
          {comparisonCups.length > 0 && (
            <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-3 flex items-center gap-3">
              <span className="text-white font-semibold">
                {comparisonCups.length === 1 ? 'Selecione outra edição para comparar' : 'Pronto para comparar!'}
              </span>
              {comparisonCups.length === 2 && (
                <button
                  onClick={() => {
                    setSelectedCup(null);
                    // Modal de comparação será aberto automaticamente quando comparisonCups.length === 2
                  }}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500"
                >
                  Ver Comparação
                </button>
              )}
              <button
                onClick={() => setComparisonCups([])}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Todas ({history.length})
          </button>
          {champions.map(champion => (
            <button
              key={champion}
              onClick={() => setFilter(champion)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                filter === champion
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <img 
                src={getFlagImageUrl(champion, 'w20')} 
                alt={champion}
                className="w-5 h-3.5 object-cover border border-gray-300 rounded"
              />
              {champion}
            </button>
          ))}
        </div>

        {/* Grid de Cards */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Nenhuma Copa encontrada com este filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredHistory.map((cup, index) => (
              <motion.div
                key={cup.year}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (comparisonCups.length === 1 && !comparisonCups.some(c => c.year === cup.year)) {
                    // Se já tem 1 selecionado e é diferente, adiciona para comparação
                    setComparisonCups([...comparisonCups, cup]);
                    setSelectedCup(null);
                  } else if (comparisonCups.length === 0) {
                    // Se não tem nenhum selecionado, abre detalhes
                    setSelectedCup(cup);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (comparisonCups.length < 2 && !comparisonCups.some(c => c.year === cup.year)) {
                    setComparisonCups([...comparisonCups, cup]);
                  }
                }}
                className={`card cursor-pointer group ${
                  comparisonCups.some(c => c.year === cup.year)
                    ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-gray-800/90'
                    : ''
                }`}
              >
                {/* Ano */}
                <div className="text-center mb-4">
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">{cup.year}</h2>
                  <div className="h-1 w-16 bg-yellow-400 mx-auto rounded"></div>
                </div>

                {/* Campeão */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <img 
                      src={getFlagImageUrl(cup.champion.name, 'w40')} 
                      alt={cup.champion.name}
                      className="w-10 h-7 object-cover border border-gray-300 rounded group-hover:scale-110 transition-transform"
                    />
                    <div>
                      <p className="text-xs text-gray-400">Campeão</p>
                      <p className="text-lg font-bold text-white">{cup.champion.name}</p>
                    </div>
                  </div>
                </div>

                {/* Vice */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-center justify-center gap-3">
                    <img 
                      src={getFlagImageUrl(cup.runnerUp.name, 'w40')} 
                      alt={cup.runnerUp.name}
                      className="w-10 h-7 object-cover border border-gray-300 rounded group-hover:scale-110 transition-transform"
                    />
                    <div>
                      <p className="text-xs text-gray-400">Vice</p>
                      <p className="text-sm font-semibold text-gray-300">{cup.runnerUp.name}</p>
                    </div>
                  </div>
                </div>

                {/* Gols do Campeão */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">Gols na Final</p>
                  <p className="text-2xl font-bold text-yellow-400">{cup.championGoals}</p>
                </div>

                {/* Indicador de clique */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-gray-500 group-hover:text-yellow-400 transition-colors">
                    Clique para ver detalhes →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal de Detalhes */}
      {selectedCup && comparisonCups.length < 2 && (
        <WorldCupDetails 
          cupData={selectedCup} 
          onClose={() => setSelectedCup(null)} 
        />
      )}

      {/* Modal de Comparação */}
      {comparisonCups.length === 2 && !selectedCup && (
        <ComparisonView
          cup1={comparisonCups[0]}
          cup2={comparisonCups[1]}
          onClose={() => {
            setComparisonCups([]);
            setSelectedCup(null);
          }}
        />
      )}
    </div>
  );
};

export default WorldCupDashboard;

