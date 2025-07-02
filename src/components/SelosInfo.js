import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { t } from './translations';

const SelosInfo = ({ selosDisponiveis, language, showFullInfo = true }) => {
  return (
    <div className={`bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 ${showFullInfo ? 'mb-4' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-amber-800 flex items-center text-sm sm:text-base">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png" 
            alt="Itália" 
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2" 
          />
          {t(language, 'yourStamps')}
        </h3>
        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
          {selosDisponiveis} {t(language, 'stamps')}
        </span>
      </div>
      
      {showFullInfo && (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {[...Array(Math.min(10, selosDisponiveis))].map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-md"
              >
                <FaCheck size={12} />
              </div>
            ))}
            {selosDisponiveis > 10 && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold text-xs">
                +{selosDisponiveis - 10}
              </div>
            )}
          </div>
          
          <div className="text-xs text-amber-700">
            <p className="mb-1">
              {t(language, 'stampsInfo1')}
            </p>
            <p>
              {t(language, 'stampsInfo2')}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SelosInfo;