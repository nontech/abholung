import React from 'react';

interface StageButtonsProps {
  currentStage: number;
  setStage: (stage: number) => void;
}

const StageButtons: React.FC<StageButtonsProps> = ({ currentStage, setStage }) => {
  const stages = [
    { name: 'Stage 1 - Search', value: 1 },
    { name: 'Stage 2: Details', value: 2 },
    { name: 'Stage 3: Payment', value: 3 },
    { name: 'Stage 4: Summary', value: 4 },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {stages.map((stage) => (
        <button
          key={stage.value}
          onClick={() => setStage(stage.value)}
          className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
            currentStage === stage.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {stage.name}
        </button>
      ))}
    </div>
  );
};

export default StageButtons;

