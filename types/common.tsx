export interface ProductData {
    newUrl: string
    title: string
    price: string
    listed_by: string
    address: string
    pic_url?: string
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

export interface DeliveryDetails {
    name: string;
    email: string;
    phoneNumber: string;
    additionalInstructions: string;
    address: string | undefined;
    date: Date | null;
    time: string;
}

export interface DetailsPageType {
    mapData: MapData | null;
    selectedDate: Date | null;
    selectedTime: string | null;
    pickupFromName: string;
    pickupFromEmail: string;
    pickupFromPhoneNumber: string;
    additionalPickupInstructions: string;
    onPickupFromNameChange: (value: string) => void;
    onPickupFromEmailChange: (value: string) => void;
    onPickupFromPhoneNumberChange: (value: string) => void;
    onAdditionalPickupInstructionsChange: (value: string) => void;
    deliverToName: string;
    deliverToEmail: string;
    deliverToPhoneNumber: string;
    additionalDeliveryInstructions: string;
    onDeliverToNameChange: (value: string) => void;
    onDeliverToEmailChange: (value: string) => void;
    onDeliverToPhoneNumberChange: (value: string) => void;
    onAdditionalDeliveryInstructionsChange: (value: string) => void;
    productData: ProductData;
    onEdit: (value: number) => void;
}

export interface DeliveryPerson {
    id: number;
    full_name: string;
}