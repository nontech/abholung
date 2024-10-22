import React from 'react';
import { TimeRangeProps } from '../../types/common';

const TimeRange: React.FC<TimeRangeProps> = ({ selectedTime, onTimeChange, pickupBetweenError }) => {
  const timeOptions = [
    { value: '9-12', label: ' (Morning) 9 am - 12 pm' },
    { value: '12-15', label: '(Afternoon) 12 pm - 3 pm ' },
    { value: '15-18', label: '(Evening) 3 pm - 6 pm ' },
    { value: '18-21', label: '(Night)6 pm - 9 pm' },
  ];

  return (
    <div>
      <label htmlFor="time" className="block text-gray-600 font-bold mb-2">Pickup Between</label>
      <select
        id="time"
        name="time"
        value={selectedTime}
        onChange={(e) => onTimeChange(e.target.value)}
        className="w-full p-2 border rounded text-black text-md"
        required
      >
        <option value="">Select a time range</option>
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {pickupBetweenError && <p className="text-red-500 text-sm mt-1">{pickupBetweenError}</p>}
    </div>
  );
};

const TimePicker: React.FC<TimeRangeProps> = ({ selectedTime, onTimeChange, pickupBetweenError }) => {

  const handleTimeChange = (time: string) => {
    onTimeChange(time);
  };

  return (
    <div>
      <TimeRange selectedTime={selectedTime} onTimeChange={handleTimeChange} pickupBetweenError={pickupBetweenError} />
    </div>
  );
};

export default TimePicker;