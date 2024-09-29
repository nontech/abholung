import React, { useEffect, useRef } from 'react';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from "flatpickr";
import { DateInputProps } from '../../types/common';

const DateInput: React.FC<DateInputProps> = ({
  options = { dateFormat: 'd M D Y' },
  value,
  onChange = () => {},
  className = '',
  placeholder = 'Select a date'
}) => {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate today's date
  const today = new Date();

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Calculate the date 3 days from tomorrow
  const maxDate = new Date(tomorrow);
  maxDate.setDate(tomorrow.getDate() + 2);

  useEffect(() => {
    if (inputRef.current) {
      flatpickrRef.current = flatpickr(inputRef.current, {
        ...options,
        minDate: tomorrow,
        maxDate: maxDate,
        disable: [today],
        onChange: (selectedDates: Date[]) => onChange(selectedDates),
      });
    }

    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
      }
    };
  }, [options, onChange, today, tomorrow, maxDate]);

  useEffect(() => {
    if (flatpickrRef.current) {
      flatpickrRef.current.setDate(value || tomorrow, false);
    }
  }, [value, tomorrow]);

  return (
    <div className="mb-4">
      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date:</label>
      <input
        ref={inputRef}
        data-id="date"
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black font-medium ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default DateInput;