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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 via-gray-900 to-black p-6 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="text-6xl md:text-8xl animate-pulse">⚡</div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-4"
            style={{ textShadow: '0 0 30px rgba(234, 179, 8, 0.3)' }}
          >
            Simulação em Massa
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg"
          >
            Simulando <span className="text-yellow-400 font-bold">{totalCopas} copa{totalCopas !== 1 ? 's' : ''}</span> do mundo
          </motion.p>
        </div>
        
        {/* Erro */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card mb-8 bg-gradient-to-r from-red-500/20 via-red-600/15 to-red-500/20 border-2 border-red-500/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-300 font-semibold text-lg">{error}</p>
            </div>
          </motion.div>
        )}
        
        {/* Progresso Geral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8 sticky top-0 z-20 md:static md:z-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gradient mb-2">
                Progresso da Simulação
              </h3>
              <p className="text-gray-300 text-sm md:text-base">
                {completedCopas.length} de {totalCopas} copas concluídas
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-1">
                {Math.round(progress)}%
              </div>
              <div className="text-gray-400 text-xs">completo</div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-700/50 rounded-full h-6 sm:h-7 md:h-10 overflow-hidden border border-gray-600/50 shadow-inner">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </motion.div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-gray-400">
              <span>Início</span>
              <span className="text-yellow-400 font-semibold">{completedCopas.length}/{totalCopas}</span>
              <span>Fim</span>
            </div>
          </div>
        </motion.div>
        
        {/* Copa Atual */}
        {currentCopa && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="card mb-8 border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-gray-800/90 to-gray-900/90"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gradient flex items-center gap-3">
                <span className="text-3xl animate-bounce">🏆</span>
                <span>Copa {currentCopa.year}</span>
              </h3>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
                <span className="text-yellow-400 font-bold">Em andamento</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-gray-700/40 rounded-xl p-6 text-center border border-yellow-500/30 shadow-lg"
              >
                <p className="text-gray-300 text-sm mb-3 font-semibold uppercase tracking-wide">Campeão</p>
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    src={getFlagImageUrl(currentCopa.champion.name, 'w40')}
                    alt={currentCopa.champion.name}
                    className="w-16 h-12 object-cover border-2 border-yellow-400 rounded-lg shadow-lg"
                  />
                  <span className="font-bold text-white text-lg">{currentCopa.champion.name}</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-700/40 via-gray-700/30 to-gray-800/40 rounded-xl p-6 text-center border border-gray-600/50"
              >
                <p className="text-gray-300 text-sm mb-3 font-semibold uppercase tracking-wide">Vice</p>
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    src={getFlagImageUrl(currentCopa.runnerUp.name, 'w40')}
                    alt={currentCopa.runnerUp.name}
                    className="w-16 h-12 object-cover border-2 border-gray-400 rounded-lg shadow-lg"
                  />
                  <span className="font-bold text-white text-lg">{currentCopa.runnerUp.name}</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-gray-700/40 rounded-xl p-6 text-center border border-yellow-500/30 shadow-lg"
              >
                <p className="text-gray-300 text-sm mb-3 font-semibold uppercase tracking-wide">Gols do Campeão</p>
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold text-yellow-400">{currentCopa.championGoals}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Lista de Copas Concluídas */}
        {completedCopas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gradient flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <span>Copas Simuladas</span>
              </h3>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
                <span className="text-yellow-400 font-bold text-lg">{completedCopas.length}</span>
              </div>
            </div>
            <div className="overflow-x-auto hidden md:block">
              <div className="rounded-xl overflow-hidden border border-gray-700/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800/90 via-gray-700/90 to-gray-800/90 text-white">
                      <th className="px-6 py-4 text-left font-bold text-yellow-400">Ano</th>
                      <th className="px-6 py-4 text-left font-bold">Campeão</th>
                      <th className="px-6 py-4 text-left font-bold">Vice</th>
                      <th className="px-6 py-4 text-center font-bold">Gols</th>
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
                      className="border-b border-gray-700/30 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:via-yellow-500/5 hover:to-transparent transition-all duration-300 group"
                    >
                      <td className="px-6 py-4 text-white font-bold group-hover:text-yellow-400 transition-colors">
                        <span className="text-xl">{copa.year}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getFlagImageUrl(copa.champion.name, 'w20')}
                            alt={copa.champion.name}
                            className="w-8 h-6 object-cover border-2 border-gray-400 rounded-lg shadow-md group-hover:scale-110 group-hover:border-yellow-400 transition-all duration-300"
                          />
                          <span className="text-white font-semibold group-hover:text-yellow-400 transition-colors">{copa.champion.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getFlagImageUrl(copa.runnerUp.name, 'w20')}
                            alt={copa.runnerUp.name}
                            className="w-8 h-6 object-cover border-2 border-gray-400 rounded-lg shadow-md group-hover:scale-110 transition-all duration-300"
                          />
                          <span className="text-gray-300 font-semibold group-hover:text-white transition-colors">{copa.runnerUp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-lg font-bold text-yellow-400 group-hover:bg-yellow-500/30 group-hover:scale-110 transition-all duration-300">
                          {copa.championGoals}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Lista em cards para mobile */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {completedCopas
                .filter((copa, index, self) => index === self.findIndex(c => c.year === copa.year))
                .map((copa, index) => (
                  <motion.div
                    key={`copa-card-${copa.year}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-400 text-xl font-bold">{copa.year}</div>
                      <div className="h-10 w-px bg-gray-700" />
                      <div className="flex items-center gap-2">
                        <img src={getFlagImageUrl(copa.champion.name, 'w20')} alt={copa.champion.name} className="w-8 h-6 object-cover border border-gray-400 rounded" />
                        <span className="text-white text-sm font-semibold">{copa.champion.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img src={getFlagImageUrl(copa.runnerUp.name, 'w20')} alt={copa.runnerUp.name} className="w-8 h-6 object-cover border border-gray-400 rounded" />
                      </div>
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-yellow-500/20 border border-yellow-500/30 rounded-lg font-bold text-yellow-400">
                        {copa.championGoals}
                      </span>
                    </div>
                  </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Botão de Finalizar */}
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex justify-center mt-8 md:mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="btn-primary text-lg md:text-xl px-6 py-4 md:px-10 md:py-5 flex items-center gap-3 fixed bottom-4 left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:bottom-auto"
            >
              <span className="text-xl md:text-2xl">✅</span>
              <span>Finalizar - Ver Histórico</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BulkSimulationScreen;

