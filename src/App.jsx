import { useState, useRef } from 'react';
import HomeScreen from './components/HomeScreen';
import SimulationScreen from './components/SimulationScreen';
import ChampionScreen from './components/ChampionScreen';
import WorldCupDashboard from './components/WorldCupDashboard';
import QualifiersScreen from './components/QualifiersScreen';
import { teams } from './teams';
import { getHistory, saveHistory, getTitles, saveTitles, getCurrentYear, saveCurrentYear } from './utils/storage';

function App() {
  const [screen, setScreen] = useState('home');
  const [championData, setChampionData] = useState(null);
  const [qualifiedTeams, setQualifiedTeams] = useState(null);
  const [qualifiersData, setQualifiersData] = useState(null); // Dados das eliminatórias
  const processingRef = useRef(false);

  const handleStartSimulation = () => {
    setScreen('qualifiers');
    processingRef.current = false; // Reset ao iniciar nova simulação
  };

  const handleQualifiersComplete = (teams, qualifiersData = null) => {
    setQualifiedTeams(teams);
    setQualifiersData(qualifiersData); // Salva dados das eliminatórias
    setScreen('simulation');
  };

  const handleSimulationComplete = (result) => {
    // Previne processamento duplicado
    if (processingRef.current) return;
    processingRef.current = true;

    const currentYear = getCurrentYear();
    
    // Verifica se já existe uma Copa para este ano (evita duplicação)
    const history = getHistory();
    const yearExists = history.some(cup => cup.year === currentYear);
    
    if (!yearExists) {
      // Salva no histórico com dados completos
      history.push({
        year: currentYear,
        champion: result.champion,
        runnerUp: result.runnerUp,
        championGoals: result.championGoals,
        fullData: result, // Salva dados completos para estatísticas
        qualifiersData: qualifiersData // Salva dados das eliminatórias (do estado)
      });
      saveHistory(history);

      // Atualiza títulos
      const titles = getTitles();
      titles[result.champion.name] = (titles[result.champion.name] || 0) + 1;
      saveTitles(titles);

      // Avança o ano
      saveCurrentYear(currentYear + 4);
    }

    // Salva dados para a tela de campeão
    setChampionData({
      champion: result.champion,
      runnerUp: result.runnerUp,
      championGoals: result.championGoals
    });

    // Mostra tela de campeão após um delay
    setTimeout(() => {
      setScreen('champion');
    }, 2000);
  };

  const handleBackToHome = () => {
    setScreen('home');
    setChampionData(null);
    setQualifiedTeams(null);
    setQualifiersData(null); // Limpa dados das eliminatórias
  };

  return (
    <>
      {screen === 'home' && (
        <HomeScreen 
          onStartSimulation={handleStartSimulation}
          onViewDashboard={() => setScreen('dashboard')}
        />
      )}
      {screen === 'dashboard' && (
        <WorldCupDashboard onBack={() => setScreen('home')} />
      )}
      {screen === 'qualifiers' && (
        <QualifiersScreen 
          onComplete={handleQualifiersComplete}
        />
      )}
      {screen === 'simulation' && (
        <SimulationScreen 
          teams={qualifiedTeams || teams} 
          onComplete={handleSimulationComplete}
        />
      )}
      {screen === 'champion' && championData && (
        <ChampionScreen
          champion={championData.champion}
          runnerUp={championData.runnerUp}
          championGoals={championData.championGoals}
          onBack={handleBackToHome}
        />
      )}
    </>
  );
}

export default App;

