import React, { useEffect, useRef, useMemo } from 'react';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from "flatpickr";
import { DateInputProps } from '../../types/common';

const DateInput: React.FC<DateInputProps> = ({
  options = { dateFormat: 'd M D Y' },
  value,
  onChange = () => {},
  pickupOnError,
  className = '',
  placeholder = 'Select a date'
}) => {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
    
    // Remove time component
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(23, 59, 59, 999);
    
    return { minDate, maxDate };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      flatpickrRef.current = flatpickr(inputRef.current, {
        ...options,
        minDate: minDate,
        maxDate: maxDate,
        onChange: (selectedDates: Date[]) => { onChange(selectedDates) }
      });
    }

    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
      }
    };
  }, [options, onChange, minDate, maxDate]);

  useEffect(() => {
    if (flatpickrRef.current) {
      flatpickrRef.current.setDate(value || minDate, false);
    }
  }, [value, minDate]);

  return (
    <div>
      <label htmlFor="date" className="block text-gray-600 font-bold mb-2">Pickup On</label>
      <input
        ref={inputRef}
        data-id="date"
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black font-medium ${className}`}
        placeholder={placeholder}
      />
      {pickupOnError && <p className="text-red-500 text-sm mt-1">{pickupOnError}</p>}
    </div>
    
  );
};

export default DateInput;