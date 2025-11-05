import { motion } from 'framer-motion';
import { getFlagImageUrl } from '../utils/flags';

const BracketView = ({ cupData }) => {
  if (!cupData || !cupData.fullData) return null;

  const { round16, quarterfinals, semifinals, final, thirdPlace } = cupData.fullData;

  const renderMatch = (match, key, isFinal = false) => {
    if (!match) return null;
    
    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gray-800 border ${isFinal ? 'border-yellow-400' : 'border-gray-700'} rounded-lg p-3 mb-2 min-w-[200px]`}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <img 
              src={getFlagImageUrl(match.team1.name, 'w20')} 
              alt={match.team1.name}
              className="w-5 h-3.5 object-cover border border-gray-300 rounded flex-shrink-0"
            />
            <span className={`text-xs truncate ${match.winner === match.team1 ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
              {match.team1.name}
            </span>
          </div>
          <span className={`text-sm font-bold ${isFinal ? 'text-yellow-400' : 'text-white'}`}>
            {match.score1}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <img 
              src={getFlagImageUrl(match.team2.name, 'w20')} 
              alt={match.team2.name}
              className="w-5 h-3.5 object-cover border border-gray-300 rounded flex-shrink-0"
            />
            <span className={`text-xs truncate ${match.winner === match.team2 ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
              {match.team2.name}
            </span>
          </div>
          <span className={`text-sm font-bold ${isFinal ? 'text-yellow-400' : 'text-white'}`}>
            {match.score2}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-800/90 rounded-lg p-6 border border-gray-700">
      <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Chave Eliminatória</h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {/* Oitavas */}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-gray-400 mb-2 text-center">Oitavas</h4>
            <div className="space-y-2">
              {round16.map((match, i) => renderMatch(match, `r16-${i}`))}
            </div>
          </div>

          {/* Quartas */}
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold text-gray-400 mb-2 text-center">Quartas</h4>
            <div className="space-y-2">
              {quarterfinals.map((match, i) => renderMatch(match, `qf-${i}`))}
            </div>
          </div>

          {/* Semis */}
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold text-gray-400 mb-2 text-center">Semis</h4>
            <div className="space-y-2">
              {semifinals.map((match, i) => renderMatch(match, `sf-${i}`))}
            </div>
          </div>

          {/* Final */}
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold text-yellow-400 mb-2 text-center">Final</h4>
            {renderMatch(final, 'final', true)}
          </div>

          {/* Terceiro Lugar */}
          {thirdPlace && (
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-gray-400 mb-2 text-center">3º Lugar</h4>
              {renderMatch(thirdPlace, 'third')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BracketView;

