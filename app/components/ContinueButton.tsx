import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => void;
  isEnabled: boolean;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  onClick,
  isEnabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      className={`
        flex items-center justify-center space-x-2
        px-8 py-3 rounded-lg font-medium text-base
        transition-all duration-200 transform
        ${
          isEnabled
            ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
    >
      <span>Continue</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  );
};

export default ContinueButton;
