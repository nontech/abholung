import React, { useState } from 'react';

interface TimeRangeProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

const TimeRange: React.FC<TimeRangeProps> = ({ selectedTime, onTimeChange }) => {
  const timeOptions = [
    { value: '9-12', label: ' (Morning) 9 am - 12 pm' },
    { value: '12-15', label: '(Afternoon) 12 pm - 3 pm ' },
    { value: '15-18', label: '(Evening) 3 pm - 6 pm ' },
    { value: '18-21', label: '(Night)6 pm - 9 pm' },
  ];

  return (
    <div className="mb-4">
      <label htmlFor="time" className="block text-sm font-medium text-gray-700">Select Time</label>
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
    </div>
  );
};

const TimePicker: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div>
      <h1>Select a Time Range</h1>
      <TimeRange selectedTime={selectedTime} onTimeChange={handleTimeChange} />
    </div>
  );
};

export default TimePicker;