import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BulkSimulationModal = ({ onClose, onConfirm }) => {
  const [yearsToAdvance, setYearsToAdvance] = useState(4);
  
  const options = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80];
  
  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-gradient mb-2">
            ⚡ Avançar Múltiplas Copas
          </h2>
          <p className="text-gray-400 mb-6">
            Selecione quantos anos deseja avançar. As simulações serão executadas automaticamente.
          </p>
          
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              Anos para avançar: <span className="text-yellow-400">{yearsToAdvance} anos</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-60 overflow-y-auto">
              {options.map((years) => {
                const copas = years / 4;
                return (
                  <button
                    key={years}
                    onClick={() => setYearsToAdvance(years)}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      yearsToAdvance === years
                        ? 'bg-yellow-400 text-black scale-105'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-lg font-bold">{years}</div>
                    <div className="text-xs opacity-75">{copas} copa{copas !== 1 ? 's' : ''}</div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(yearsToAdvance)}
              className="flex-1 btn-primary"
            >
              Simular {yearsToAdvance / 4} Copa{yearsToAdvance / 4 !== 1 ? 's' : ''}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BulkSimulationModal;

