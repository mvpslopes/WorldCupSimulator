import { motion } from 'framer-motion';
import Confetti from './Confetti';
import { getFlagImageUrl, getFlag } from '../utils/flags';

// Função auxiliar para obter emoji da bandeira (fallback)
const getDisplayFlagEmoji = (team) => {
  if (!team) return '🏳️';
  if (team.flag && team.flag.length > 2 && !team.flag.match(/^[A-Z]{2}$/)) {
    return team.flag;
  }
  return getFlag(team.name);
};

const ChampionScreen = ({ champion, runnerUp, championGoals, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-8 relative overflow-hidden">
      <Confetti />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-9xl mb-8"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold text-yellow-400 mb-4 drop-shadow-lg"
        >
          CAMPEÃO!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/95 rounded-lg p-8 shadow-2xl mb-8 max-w-2xl mx-auto border border-gray-700"
        >
          <img 
            src={getFlagImageUrl(champion.name, 'w160')} 
            alt={champion.name}
            className="w-32 h-22 mb-4 object-cover border-2 border-gray-300 rounded shadow-lg mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="text-8xl mb-4 flag-emoji text-center" style={{ display: 'none' }}>
            {getDisplayFlagEmoji(champion)}
          </div>
          <h2 className="text-5xl font-bold text-yellow-400 mb-4">{champion.name}</h2>
          <p className="text-2xl text-gray-300 mb-2 flex items-center justify-center gap-2">
            <span className="font-semibold">Vice-campeão:</span> 
            <img 
              src={getFlagImageUrl(runnerUp.name, 'w40')} 
              alt={runnerUp.name}
              className="w-8 h-5 object-cover border border-gray-300 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
            <span className="flag-emoji text-xl" style={{ display: 'none' }}>
              {getDisplayFlagEmoji(runnerUp)}
            </span>
            <span className="text-white">{runnerUp.name}</span>
          </p>
          <p className="text-xl text-white">
            Gols na final: {championGoals}
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xl py-4 px-12 rounded-full shadow-2xl"
        >
          Voltar ao Início
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChampionScreen;

