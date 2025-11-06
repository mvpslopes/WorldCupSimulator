import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulateWorldCup } from '../utils/simulation';
import { getFlagImageUrl, getFlag } from '../utils/flags';
import { getSettings } from '../utils/settings';

// Função auxiliar para obter URL da bandeira
const getDisplayFlagUrl = (team) => {
  if (!team) return null;
  return getFlagImageUrl(team.name);
};

// Função auxiliar para obter emoji da bandeira (fallback)
const getDisplayFlagEmoji = (team) => {
  if (!team) return '🏳️';
  if (team.flag && team.flag.length > 2 && !team.flag.match(/^[A-Z]{2}$/)) {
    return team.flag;
  }
  return getFlag(team.name);
};

const SimulationScreen = ({ teams, onComplete }) => {
  const [phase, setPhase] = useState('loading');
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const hasRunRef = useRef(false);
  const settings = getSettings();

  // Fases da simulação
  const phases = ['groups', 'round16', 'quarterfinals', 'semifinals', 'final', 'complete'];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    // Previne execução duplicada em StrictMode
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Simula toda a copa de uma vez
    const runSimulation = () => {
      setProgress(5);
      const worldCupResult = simulateWorldCup(teams);
      setResult(worldCupResult);
      setPhase('groups');
      setProgress(100);
    };

    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      const nextIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIndex);
      setPhase(phases[nextIndex]);
      
      // Se chegou na final, mostra a final
      if (phases[nextIndex] === 'final') {
        // Final já está no resultado
      }
      
      // Se completou, finaliza
      if (phases[nextIndex] === 'complete') {
        setTimeout(() => {
          onComplete(result);
        }, 500);
      }
    }
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'groups': return 'Fase de Grupos';
      case 'round16': return 'Oitavas de Final';
      case 'quarterfinals': return 'Quartas de Final';
      case 'semifinals': return 'Semifinais';
      case 'final': return 'Final';
      case 'complete': return 'Simulação Completa';
      default: return 'Simulando...';
    }
  };

  const getNextPhaseTitle = () => {
    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex >= phases.length) return 'Finalizar';
    switch (phases[nextIndex]) {
      case 'round16': return 'Oitavas de Final';
      case 'quarterfinals': return 'Quartas de Final';
      case 'semifinals': return 'Semifinais';
      case 'final': return 'Final';
      case 'complete': return 'Finalizar';
      default: return 'Próxima Fase';
    }
  };

  const canAdvance = () => {
    return currentPhaseIndex < phases.length - 1;
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl text-yellow-400"
        >
          ⚽
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4 drop-shadow-lg" style={{ textShadow: '0 0 30px rgba(234, 179, 8, 0.3)' }}>
            {getPhaseTitle()}
          </h2>
        </div>

        {/* Barra de Progresso */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-center text-gray-400 text-sm mt-2">
            {currentPhaseIndex + 1} de {phases.length} fases
          </p>
        </div>

        {phase === 'groups' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {Object.keys(result.groups).map(groupLetter => (
              <motion.div
                key={groupLetter}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: parseInt(groupLetter.charCodeAt(0) - 65) * 0.1 }}
                className="card"
              >
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3">Grupo {groupLetter}</h3>
                <div className="space-y-2">
                  {result.groupStage[groupLetter].standings.map((standing, index) => (
                    <div
                      key={standing.team.name}
                      className={`flex justify-between items-center p-2 sm:p-3 rounded-lg ${
                        index < 2 ? 'bg-yellow-400/20 font-semibold border border-yellow-400' : 'bg-gray-700/50'
                      }`}
                    >
                      <span className="text-sm sm:text-lg flex items-center gap-2 flex-1 min-w-0">
                        <img 
                          src={getDisplayFlagUrl(standing.team)} 
                          alt={standing.team.name}
                          className="w-5 h-3.5 sm:w-6 sm:h-4 object-cover border border-gray-300 rounded flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span className="flag-emoji text-lg sm:text-xl" style={{ display: 'none' }}>
                          {getDisplayFlagEmoji(standing.team)}
                        </span>
                        <span className="text-white truncate">{standing.team.name}</span>
                      </span>
                      <span className="font-bold text-white text-sm sm:text-base ml-2 flex-shrink-0">{standing.points}pts</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {(phase === 'round16' || phase === 'quarterfinals' || phase === 'semifinals') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {result[phase].map((match, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:space-x-3 w-full sm:w-auto justify-center sm:justify-start">
                    <img 
                      src={getDisplayFlagUrl(match.team1)} 
                      alt={match.team1.name}
                      className="w-7 h-4 sm:w-8 sm:h-5 object-cover border border-gray-300 rounded flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span className="flag-emoji text-xl sm:text-2xl" style={{ display: 'none' }}>
                      {getDisplayFlagEmoji(match.team1)}
                    </span>
                    <span className="text-base sm:text-xl font-semibold text-white truncate flex-1 text-center sm:text-left">{match.team1.name}</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-400 whitespace-nowrap">
                    {match.score1} - {match.score2}
                  </span>
                  <div className="flex items-center gap-2 sm:space-x-3 w-full sm:w-auto justify-center sm:justify-end">
                    <span className="text-base sm:text-xl font-semibold text-white truncate flex-1 text-center sm:text-right">{match.team2.name}</span>
                    <img 
                      src={getDisplayFlagUrl(match.team2)} 
                      alt={match.team2.name}
                      className="w-7 h-4 sm:w-8 sm:h-5 object-cover border border-gray-300 rounded flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.previousSibling.style.display = 'inline';
                      }}
                    />
                    <span className="flag-emoji text-xl sm:text-2xl" style={{ display: 'none' }}>
                      {getDisplayFlagEmoji(match.team2)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-center text-base text-gray-200 bg-gray-700/50 py-2 rounded">
                  <span className="font-bold flex items-center justify-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Vencedor: <img 
                      src={getDisplayFlagUrl(match.winner)} 
                      alt={match.winner.name}
                      className="w-5 h-3.5 inline-block object-cover border border-gray-300 rounded mr-1"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                    <span className="flag-emoji text-lg" style={{ display: 'none' }}>
                      {getDisplayFlagEmoji(match.winner)}
                    </span> <span className="text-white">{match.winner.name}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {phase === 'final' && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/95 rounded-lg p-8 shadow-2xl max-w-2xl mx-auto mt-8 border border-gray-700"
          >
            <h3 className="text-4xl font-bold text-center text-yellow-400 mb-8">FINAL</h3>
            <div className="flex items-center justify-center space-x-8 mb-8 flex-wrap gap-6">
              <div className="text-center flex flex-col items-center">
                <img 
                  src={getFlagImageUrl(result.final.team1.name, 'w80')} 
                  alt={result.final.team1.name}
                  className="w-20 h-14 mb-3 object-cover border-2 border-gray-300 rounded shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="text-6xl mb-3 flag-emoji" style={{ display: 'none' }}>
                  {getDisplayFlagEmoji(result.final.team1)}
                </div>
                <div className="text-2xl font-bold text-white">{result.final.team1.name}</div>
              </div>
              <div className="text-6xl font-bold text-yellow-400">
                {result.final.score1} - {result.final.score2}
              </div>
              <div className="text-center flex flex-col items-center">
                <img 
                  src={getFlagImageUrl(result.final.team2.name, 'w80')} 
                  alt={result.final.team2.name}
                  className="w-20 h-14 mb-3 object-cover border-2 border-gray-300 rounded shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="text-6xl mb-3 flag-emoji" style={{ display: 'none' }}>
                  {getDisplayFlagEmoji(result.final.team2)}
                </div>
                <div className="text-2xl font-bold text-white">{result.final.team2.name}</div>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center bg-yellow-400/20 border border-yellow-400 py-4 rounded-lg"
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">🏆</span>
                <span className="text-white">Campeão:</span>
                <img 
                  src={getFlagImageUrl(result.final.winner.name, 'w40')} 
                  alt={result.final.winner.name}
                  className="w-10 h-7 inline-block object-cover border border-gray-300 rounded mr-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span className="flag-emoji text-2xl" style={{ display: 'none' }}>
                  {getDisplayFlagEmoji(result.final.winner)}
                </span>
                <span className="text-white">{result.final.winner.name}</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Botão Avançar */}
        {canAdvance() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8 mb-4"
          >
            <button
              onClick={handleNextPhase}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-xl px-8 py-4 rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              → Avançar para {getNextPhaseTitle()}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SimulationScreen;

