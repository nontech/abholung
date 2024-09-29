export interface ProductData {
    title: string
    price: string
    listedBy: string
    address: string
    imgSrc?: string
    // Add other fields as needed
}

export interface TimeRangeProps {
    selectedTime: string;
    onTimeChange: (time: string) => void;
}

export interface RouteInfo {
    distance: number;
    duration: number;
    coordinates: [number, number][];
}

export interface DateInputProps {
    options?: {
      dateFormat: string;
      minDate?: string | Date;
      maxDate?: string | Date;
      disable?: (string | Date)[];
    };
    value: Date | null;
    onChange: ([selectedDate]: Date[]) => void;
    className?: string;
    placeholder?: string;
}

export interface MapData {
    from: string;
    to: string;
}