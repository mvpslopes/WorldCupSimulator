import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { simulateQualifiers, simulateQualifiersDetailed } from '../utils/qualifiers';
import { getFlagImageUrl } from '../utils/flags';
import { getSettings } from '../utils/settings';

const QualifiersScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('loading');
  const [results, setResults] = useState(null);
  const [currentConfederation, setCurrentConfederation] = useState('');
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [nextPhase, setNextPhase] = useState('');
  const hasRunRef = useRef(false);
  const settings = getSettings();

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const getSpeedMultiplier = () => {
      switch (settings.speed) {
        case 'fast': return 0.2;
        case 'detailed': return 2;
        default: return 1;
      }
    };

    const speed = getSpeedMultiplier();

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const delayWithTimer = async (ms, nextPhaseName) => {
      setNextPhase(nextPhaseName);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.ceil((ms - elapsed) / 1000));
        setTimeRemaining(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 100);
      await delay(ms);
      clearInterval(interval);
      setTimeRemaining(0);
    };

    const runQualifiers = async () => {
      setProgress(10);
      
      if (settings.speed === 'fast') {
        const qualResults = simulateQualifiersDetailed(true); // Usa lista completa
        setResults(qualResults);
        setProgress(100);
        await delay(500 * speed);
        // Passa os dados completos das eliminatórias
        onComplete(qualResults.qualified, qualResults);
        return;
      }

      // Simula cada confederação (usa lista completa por padrão)
      const confederations = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];
      const qualResults = simulateQualifiersDetailed(true); // Usa lista completa
      setResults(qualResults);

      let progressStep = 20;
      for (const confed of confederations) {
        setCurrentConfederation(confed);
        setProgress(progressStep);
        await delayWithTimer(2000 * speed, `Qualificatórias ${confed}`);
        progressStep += 12;
      }

      setProgress(100);
      await delay(1000 * speed);
      // Passa os dados completos das eliminatórias
      onComplete(qualResults.qualified, qualResults);
    };

    runQualifiers();
  }, [settings.speed, onComplete]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  if (!results) {
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

  const confederationNames = {
    'UEFA': 'Europa',
    'CONMEBOL': 'América do Sul',
    'CONCACAF': 'América do Norte/Central',
    'CAF': 'África',
    'AFC': 'Ásia',
    'OFC': 'Oceania'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-4 drop-shadow-lg">
          Eliminatórias para Copa do Mundo
        </h2>

        {/* Timer */}
        {timeRemaining > 0 && nextPhase && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-6 bg-gray-800/90 rounded-lg p-4 border border-yellow-400/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400 text-sm">Próxima etapa:</p>
                <p className="text-yellow-400 font-bold text-lg">{nextPhase}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Tempo restante:</p>
                <p className="text-white font-bold text-2xl">{formatTime(timeRemaining)}</p>
              </div>
            </div>
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: timeRemaining, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}

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
          <p className="text-center text-gray-400 text-sm mt-2">{progress}% completo</p>
        </div>

        {/* Times Qualificados por Confederação */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.keys(results.allTeams || results.byConfederation).map((confed, index) => {
            const allTeams = results.allTeams?.[confed] || [];
            const qualifiedTeams = results.byConfederation?.[confed] || [];
            if (allTeams.length === 0) return null;

            return (
              <motion.div
                key={confed}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/90 rounded-lg p-6 shadow-xl border border-gray-700"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                  {confederationNames[confed] || confed}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  <span className="text-green-400 font-semibold">{qualifiedTeams.length} qualificadas</span>
                  {' / '}
                  <span className="text-white">{allTeams.length} participantes</span>
                </p>
                
                {/* Qualificadas */}
                <div className="mb-4">
                  <h4 className="text-green-400 font-semibold mb-2 text-sm">✅ Qualificadas:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {qualifiedTeams.map((team, idx) => (
                      <div
                        key={team.name}
                        className="flex items-center gap-2 p-2 bg-green-400/10 border border-green-400/30 rounded"
                      >
                        <img 
                          src={getFlagImageUrl(team.name, 'w20')} 
                          alt={team.name}
                          className="w-6 h-4 object-cover border border-gray-300 rounded"
                        />
                        <span className="text-white font-semibold text-sm">{team.name}</span>
                        <span className="ml-auto text-yellow-400 text-xs">Rating: {team.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eliminadas */}
                {allTeams.length > qualifiedTeams.length && (
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2 text-sm">❌ Eliminadas:</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {allTeams
                        .filter(team => !qualifiedTeams.some(q => q.name === team.name))
                        .map((team, idx) => (
                          <div
                            key={team.name}
                            className="flex items-center gap-2 p-1.5 bg-gray-700/30 rounded opacity-70"
                          >
                            <img 
                              src={getFlagImageUrl(team.name, 'w16')} 
                              alt={team.name}
                              className="w-5 h-3 object-cover border border-gray-300 rounded"
                            />
                            <span className="text-gray-400 text-xs">{team.name}</span>
                            <span className="ml-auto text-gray-500 text-xs">{team.rating}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Playoffs */}
        {results.playoffs && results.playoffs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/90 rounded-lg p-6 shadow-xl border border-gray-700 mb-8"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Playoffs</h3>
            <div className="space-y-4">
              {results.playoffs.map((playoff, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-white mb-3">
                    {confederationNames[playoff.confederation] || playoff.confederation}
                  </h4>
                  <div className="space-y-2">
                    {playoff.matches.map((match, mIdx) => (
                      <div key={mIdx} className="bg-gray-600/50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img 
                              src={getFlagImageUrl(match.team1.name, 'w20')} 
                              alt={match.team1.name}
                              className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                            />
                            <span className="text-white">{match.team1.name}</span>
                          </div>
                          <span className="text-yellow-400 font-bold">
                            {match.match1 && match.match2 ? (
                              // Playoff ida e volta
                              `${match.match1.score1} - ${match.match1.score2} | ${match.match2.score1} - ${match.match2.score2}`
                            ) : (
                              // Partida única (grupos)
                              `${match.score1 || 0} - ${match.score2 || 0}`
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white">{match.team2.name}</span>
                            <img 
                              src={getFlagImageUrl(match.team2.name, 'w20')} 
                              alt={match.team2.name}
                              className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                        <div className="text-center text-sm text-gray-300">
                          {match.total1 !== undefined && match.total2 !== undefined ? (
                            <>
                              Total: {match.total1} - {match.total2} | 
                              <span className="text-yellow-400 font-bold ml-2">
                                Vencedor: {match.winner?.name || 'Empate'}
                              </span>
                            </>
                          ) : (
                            <span className="text-yellow-400 font-bold">
                              Vencedor: {match.winner?.name || 'Empate'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resumo Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-6 text-center"
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">
            {results.qualified.length} Seleções Classificadas!
          </h3>
          <p className="text-white">
            A Copa do Mundo está pronta para começar!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QualifiersScreen;

