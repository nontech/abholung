import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string, coords?: [number, number]) => void;
  placeholder: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get('/api/get-map-data/autocomplete', { params: { input: value } });
        const newSuggestions = response.data.features || [];
        setSuggestions(
          newSuggestions.map((feature: any) => ({
            label: feature.properties.label,
            coordinates: feature.geometry.coordinates,
          }))
        );
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (suggestion: any) => {
    onChange(suggestion.label, suggestion.coordinates);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="w-full p-2 border rounded text-gray-900 placeholder-gray-400"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(suggestion);
              }}
              className="w-full p-2 border rounded text-gray-900 placeholder-gray-400"
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
