import React, { useEffect, useRef, useState } from "react";
import "flatpickr/dist/flatpickr.min.css";
import flatpickr from "flatpickr";
import { DateInputProps } from "../../types/common";

const DateInput: React.FC<DateInputProps> = ({
  options = { dateFormat: "d M D Y" },
  value,
  onChange = () => {},
  pickupOnError,
  className = "",
  placeholder = "Select a date",
}) => {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (inputRef.current && !flatpickrRef.current) {
      const now = new Date();
      const minDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      const maxDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 3
      );

      flatpickrRef.current = flatpickr(inputRef.current, {
        ...options,
        defaultDate: value || maxDate,
        minDate: minDate,
        maxDate: maxDate,
        onChange: (selectedDates: Date[]) => {
          if (selectedDates.length > 0) {
            setInputValue(selectedDates[0].toLocaleDateString());
            onChange(selectedDates);
          }
        },
      });

      // Set initial value
      if (value) {
        setInputValue(value.toLocaleDateString());
      } else {
        setInputValue(maxDate.toLocaleDateString());
        onChange([maxDate]);
      }
    }

    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    };
  }, [options, onChange, value]);

  const handleInputClick = () => {
    if (flatpickrRef.current) {
      flatpickrRef.current.open();
    }
  };

  return (
    <div>
      <label htmlFor="date" className="block text-gray-600 font-bold mb-2">
        Pickup On
      </label>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={() => {}} // This is intentionally empty
        onClick={handleInputClick}
        data-id="date"
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black font-medium ${className}`}
        placeholder={placeholder}
        readOnly
      />
      {pickupOnError && (
        <p className="text-red-500 text-sm mt-1">{pickupOnError}</p>
      )}
    </div>
  );
};

export default DateInput;
