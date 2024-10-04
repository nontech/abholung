import React from 'react';

interface ContinueButtonProps {
  onClick: () => void;
  isEnabled: boolean;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick, isEnabled }) => {
  return (
    <button
      onClick={onClick}
      className={`mt-4 bg-green-500 text-white px-4 py-2 rounded ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={!isEnabled}
    >
      Continue
    </button>
  );
};

export default ContinueButton;