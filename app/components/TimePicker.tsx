import { TimeRangeProps } from "../../types/common";

const TimePicker = ({
  selectedTime,
  onTimeChange,
  pickupBetweenError,
}: TimeRangeProps) => {
  const timeSlots = [
    "(Morning) 09:00-12:00",
    "(Afternoon) 12:00-15:00",
    "(Evening) 15:00-18:00",
    "(Night) 18:00-21:00",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 hover:border-emerald-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Select Pickup Time
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeChange(time)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${
                selectedTime === time
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm"
              }`}
          >
            {time}
          </button>
        ))}
      </div>

      {pickupBetweenError && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg mt-3">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">{pickupBetweenError}</span>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
