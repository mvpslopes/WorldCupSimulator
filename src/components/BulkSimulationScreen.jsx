import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { simulateQualifiersDetailed } from '../utils/qualifiers';
import { simulateWorldCup } from '../utils/simulation';
import { getHistory, getTitles, saveTitles, getCurrentYear, saveCurrentYear } from '../utils/storage';

// Constante para chave do localStorage (importada indiretamente)
const STORAGE_KEYS = {
  HISTORY: 'worldcup_history',
};
import { getFlagImageUrl } from '../utils/flags';
import { getSettings } from '../utils/settings';

const BulkSimulationScreen = ({ yearsToAdvance, onComplete }) => {
  const [currentYear, setCurrentYear] = useState(getCurrentYear());
  const [completedCopas, setCompletedCopas] = useState([]);
  const [currentCopa, setCurrentCopa] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [error, setError] = useState(null);
  const hasRunRef = useRef(false);
  const isMountedRef = useRef(true);
  const shouldCleanupRef = useRef(false);
  const simulationStartTimeRef = useRef(null);
  const settings = getSettings();
  
  const totalCopas = yearsToAdvance / 4;
  
  useEffect(() => {
    // Previne execução duplicada
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    isMountedRef.current = true;
    shouldCleanupRef.current = false; // Reset ao iniciar
    simulationStartTimeRef.current = Date.now(); // Marca quando a simulação começou
    
    const runBulkSimulation = async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const speed = settings.speed === 'fast' ? 5 : settings.speed === 'detailed' ? 200 : 30;
      
      let year = getCurrentYear(); // Sempre pega do storage para garantir consistência
      let history = getHistory(); // Carrega uma vez
      
      try {
        console.log(`\n=== INICIANDO LOOP PRINCIPAL ===`);
        console.log(`Total de copas: ${totalCopas}`);
        console.log(`Ano inicial: ${year}`);
        console.log(`isMounted inicial: ${isMountedRef.current}`);
        
        for (let i = 0; i < totalCopas; i++) {
          // Verifica se deve continuar
          // Ignora cleanup se foi chamado muito rapidamente (menos de 2 segundos após início)
          // Isso evita que React StrictMode interrompa o loop prematuramente
          const timeSinceStart = Date.now() - simulationStartTimeRef.current;
          if (shouldCleanupRef.current && timeSinceStart > 2000) {
            console.log(`[${i + 1}] Cleanup solicitado após ${timeSinceStart}ms, parando loop`);
            break;
          } else if (shouldCleanupRef.current && timeSinceStart <= 2000) {
            console.log(`[${i + 1}] Cleanup ignorado (muito cedo: ${timeSinceStart}ms) - provavelmente StrictMode`);
            shouldCleanupRef.current = false; // Reseta o flag para continuar
          }
          try {
            console.log(`\n>>> INICIANDO ITERAÇÃO ${i + 1}/${totalCopas} (ano ${year}) <<<`);
            console.log(`Condição do loop: i=${i} < ${totalCopas} = ${i < totalCopas}, shouldCleanup=${shouldCleanupRef.current}`);
            
            // Recarrega histórico a cada iteração para garantir consistência
            history = getHistory();
            console.log(`Histórico atual tem ${history.length} copas`);
            
            // Verifica se já existe antes de simular
            const yearExists = history.some(cup => cup.year === year);
            console.log(`Copa ${year} já existe? ${yearExists}`);
            
            if (!yearExists) {
              console.log(`Simulando copa ${year} (${i + 1}/${totalCopas})...`);
              
              // Simula eliminatórias
              const qualifiersResult = simulateQualifiersDetailed(true);
              const qualifiedTeams = qualifiersResult.qualified;
              
              // Verifica se temos 32 times
              if (!qualifiedTeams || qualifiedTeams.length < 32) {
                console.warn(`Apenas ${qualifiedTeams?.length || 0} times qualificados para ${year}, pulando...`);
                year += 4;
                saveCurrentYear(year);
                if (isMountedRef.current) {
                  setProgress(((i + 1) / totalCopas) * 100);
                }
                continue;
              }
              
              // Simula copa
              const worldCupResult = simulateWorldCup(qualifiedTeams);
              
              // Prepara dados da copa
              const copaData = {
                year,
                champion: worldCupResult.champion,
                runnerUp: worldCupResult.runnerUp,
                championGoals: worldCupResult.championGoals
              };
              
              console.log(`Copa ${year} simulada: ${copaData.champion.name} campeão!`);
              
              // Salva no histórico (sem dados completos para economizar espaço)
              history.push({
                year: year,
                champion: worldCupResult.champion,
                runnerUp: worldCupResult.runnerUp,
                championGoals: worldCupResult.championGoals,
                qualifiersData: { qualified: qualifiersResult.qualified.map(t => ({
                  name: t.name,
                  rating: t.rating,
                  confederation: t.confederation
                })) }
              });
              
              // Salva histórico otimizado (sem dados completos para economizar espaço)
              // Não aguarda para não travar durante simulação em massa - fire and forget
              console.log(`Salvando histórico para ${year}...`);
              try {
                // Salva diretamente no localStorage sem await para não bloquear
                const optimized = history.map(entry => ({
                  year: entry.year,
                  champion: entry.champion ? { name: entry.champion.name, rating: entry.champion.rating } : null,
                  runnerUp: entry.runnerUp ? { name: entry.runnerUp.name, rating: entry.runnerUp.rating } : null,
                  championGoals: entry.championGoals || 0,
                  qualifiedTeams: entry.qualifiersData?.qualified?.map(t => ({
                    name: t.name,
                    rating: t.rating,
                    confederation: t.confederation
                  })) || []
                }));
                
                // Limita a 50 para não encher o localStorage
                const limited = optimized.slice(-50);
                const dataStr = JSON.stringify(limited);
                
                try {
                  localStorage.setItem(STORAGE_KEYS.HISTORY, dataStr);
                  console.log(`Histórico salvo para ${year}`);
                } catch (storageError) {
                  console.warn(`Erro ao salvar no localStorage para ${year}:`, storageError);
                  // Se falhar, tenta salvar apenas os últimos 20
                  try {
                    const minimal = optimized.slice(-20);
                    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(minimal));
                  } catch (e) {
                    console.error(`Erro crítico ao salvar histórico:`, e);
                  }
                }
              } catch (error) {
                console.warn(`Erro ao preparar histórico para ${year}:`, error);
                // Continua mesmo se falhar
              }
              
              // Atualiza títulos
              console.log(`Atualizando títulos...`);
              try {
                const titles = getTitles();
                titles[worldCupResult.champion.name] = (titles[worldCupResult.champion.name] || 0) + 1;
                saveTitles(titles);
                console.log(`Títulos atualizados`);
              } catch (err) {
                console.warn(`Erro ao salvar títulos:`, err);
              }
              
              // Atualiza estado de forma segura usando requestAnimationFrame para não bloquear
              console.log(`Atualizando interface...`);
              if (isMountedRef.current) {
                // Usa requestAnimationFrame para garantir que o estado seja atualizado sem bloquear
                requestAnimationFrame(() => {
                  if (isMountedRef.current) {
                    setCurrentCopa(copaData);
                    setCompletedCopas(prev => {
                      const filtered = prev.filter(c => c.year !== copaData.year);
                      return [...filtered, copaData];
                    });
                    setProgress(((i + 1) / totalCopas) * 100);
                    setCurrentYear(year + 4); // Atualiza já com o próximo ano
                    console.log(`Interface atualizada`);
                  }
                });
              }
            } else {
              // Se já existe, apenas avança o ano
              console.log(`Copa ${year} já existe, pulando...`);
              // Mesmo assim atualiza o progresso
              if (isMountedRef.current) {
                requestAnimationFrame(() => {
                  if (isMountedRef.current) {
                    setProgress(((i + 1) / totalCopas) * 100);
                    setCurrentYear(year + 4);
                  }
                });
              }
            }
            
            year += 4;
            saveCurrentYear(year);
            
            // Yield para o navegador não travar (a cada copa)
            // Usa requestAnimationFrame para garantir que o navegador processe atualizações
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            // Pequeno delay entre copas para não travar o navegador
            await delay(speed);
            
            console.log(`Progresso: ${i + 1}/${totalCopas} copas concluídas`);
            
            // Yield adicional após o delay
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            console.log(`[${i + 1}] Finalizando iteração ${i + 1}`);
            console.log(`[${i + 1}] Próxima: i=${i + 1}, totalCopas=${totalCopas}, isMounted=${isMountedRef.current}, continuará? ${i + 1 < totalCopas && isMountedRef.current}`);
          } catch (iterationError) {
            console.error(`[${i + 1}] ERRO na iteração ${i + 1} (ano ${year}):`, iterationError);
            console.error(`[${i + 1}] Stack trace:`, iterationError.stack);
            // Continua para próxima iteração mesmo com erro
            year += 4;
            saveCurrentYear(year);
            if (isMountedRef.current) {
              requestAnimationFrame(() => {
                if (isMountedRef.current) {
                  setProgress(((i + 1) / totalCopas) * 100);
                }
              });
            }
            await delay(speed);
          }
          
          // Verifica se deve continuar ANTES de avançar para próxima iteração
          const timeSinceStartCheck = Date.now() - simulationStartTimeRef.current;
          if (shouldCleanupRef.current && timeSinceStartCheck > 2000) {
            console.log(`[${i + 1}] Cleanup solicitado após ${timeSinceStartCheck}ms, parando loop`);
            break;
          } else if (shouldCleanupRef.current && timeSinceStartCheck <= 2000) {
            console.log(`[${i + 1}] Cleanup ignorado (muito cedo: ${timeSinceStartCheck}ms) - provavelmente StrictMode`);
            shouldCleanupRef.current = false; // Reseta o flag para continuar
          }
          
          console.log(`[${i + 1}] === FIM DA ITERAÇÃO ${i + 1} ===`);
          console.log(`[${i + 1}] Verificando condição do loop: ${i + 1} < ${totalCopas} = ${i + 1 < totalCopas}`);
          console.log(`[${i + 1}] shouldCleanup: ${shouldCleanupRef.current}, tempo desde início: ${timeSinceStartCheck}ms`);
          console.log(`[${i + 1}] Continuará? ${i + 1 < totalCopas && (!shouldCleanupRef.current || timeSinceStartCheck <= 2000)}\n`);
          
          // Yield final antes de próxima iteração usando requestAnimationFrame
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
        
        console.log(`\n=== LOOP PRINCIPAL TERMINADO ===`);
        console.log(`Total de iterações esperadas: ${totalCopas}`);
        console.log(`isMounted ao final: ${isMountedRef.current}`);
      } catch (error) {
        console.error('Erro durante simulação em massa:', error);
        console.error('Stack trace completo:', error.stack);
        if (isMountedRef.current) {
          setError(`Erro durante simulação: ${error.message}`);
        }
      }
      
      const finalTimeSinceStart = Date.now() - simulationStartTimeRef.current;
      console.log(`Simulação em massa finalizada. shouldCleanup: ${shouldCleanupRef.current}, tempo total: ${finalTimeSinceStart}ms`);
      
      // Só considera cleanup válido se passou tempo suficiente (mais de 2 segundos)
      const isValidCleanup = shouldCleanupRef.current && finalTimeSinceStart > 2000;
      
      if (!isValidCleanup) {
        console.log('Marcando como não rodando e aguardando antes de completar...');
        setIsRunning(false);
        
        // Aguarda um pouco antes de voltar
        await delay(2000);
        console.log('Chamando onComplete...');
        onComplete();
      } else {
        console.log('Cleanup válido detectado, não chamando onComplete');
      }
    };
    
    runBulkSimulation();
    
    return () => {
      // Marca cleanup apenas quando realmente desmontar
      // No StrictMode, isso pode ser chamado imediatamente após mount,
      // mas o loop ignora se for muito cedo (< 2 segundos)
      const timeSinceStart = simulationStartTimeRef.current ? Date.now() - simulationStartTimeRef.current : Infinity;
      console.log(`Cleanup function chamado - tempo desde início: ${timeSinceStart}ms`);
      
      // Só marca cleanup se já passou tempo suficiente (mais de 2 segundos)
      // Isso evita que StrictMode interrompa o loop prematuramente
      if (timeSinceStart > 2000) {
        console.log('Cleanup válido - marcando shouldCleanup');
        shouldCleanupRef.current = true;
      } else {
        console.log('Cleanup muito cedo - ignorando (provavelmente StrictMode)');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gradient mb-8">
          ⚡ Simulação em Massa
        </h2>
        
        {/* Erro */}
        {error && (
          <div className="card mb-8 bg-red-500/20 border-red-500">
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        )}
        
        {/* Progresso Geral */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">
              Progresso: {completedCopas.length} de {totalCopas} copas
            </h3>
            <span className="text-yellow-400 font-bold text-xl">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-6 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        {/* Copa Atual */}
        {currentCopa && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              🏆 Copa {currentCopa.year}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Campeão</p>
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={getFlagImageUrl(currentCopa.champion.name, 'w40')}
                    alt={currentCopa.champion.name}
                    className="w-8 h-6 object-cover border border-gray-300 rounded"
                  />
                  <span className="font-bold text-white">{currentCopa.champion.name}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Vice</p>
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={getFlagImageUrl(currentCopa.runnerUp.name, 'w40')}
                    alt={currentCopa.runnerUp.name}
                    className="w-8 h-6 object-cover border border-gray-300 rounded"
                  />
                  <span className="font-bold text-white">{currentCopa.runnerUp.name}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Gols do Campeão</p>
                <span className="text-2xl font-bold text-yellow-400">{currentCopa.championGoals}</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Lista de Copas Concluídas */}
        {completedCopas.length > 0 && (
          <div className="card">
            <h3 className="text-2xl font-bold text-white mb-4">
              📋 Copas Simuladas ({completedCopas.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="px-4 py-3 text-left">Ano</th>
                    <th className="px-4 py-3 text-left">Campeão</th>
                    <th className="px-4 py-3 text-left">Vice</th>
                    <th className="px-4 py-3 text-center">Gols</th>
                  </tr>
                </thead>
                <tbody>
                  {completedCopas
                    .filter((copa, index, self) => 
                      // Remove duplicatas - mantém apenas o primeiro de cada ano
                      index === self.findIndex(c => c.year === copa.year)
                    )
                    .map((copa, index) => (
                    <motion.tr
                      key={`copa-${copa.year}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-700"
                    >
                      <td className="px-4 py-3 text-white font-semibold">{copa.year}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={getFlagImageUrl(copa.champion.name, 'w20')}
                            alt={copa.champion.name}
                            className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                          />
                          <span className="text-white">{copa.champion.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={getFlagImageUrl(copa.runnerUp.name, 'w20')}
                            alt={copa.runnerUp.name}
                            className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                          />
                          <span className="text-white">{copa.runnerUp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-yellow-400 font-bold">
                        {copa.championGoals}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Botão de Finalizar */}
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={onComplete}
              className="btn-primary text-xl px-8 py-4"
            >
              ✅ Finalizar - Ver Histórico
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BulkSimulationScreen;

