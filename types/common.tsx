export interface ProductData {
  newUrl: string;
  title: string;
  price: string;
  listed_by: string;
  address: string;
  pic_url?: string;
  // Add other fields as needed
}

export interface TimeRangeProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  pickupBetweenError: string;
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
  pickupOnError: string;
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
  serviceType: "buying" | "selling";
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
  totalPrice: number;
  onEdit: (value: number) => void;
}

export interface DeliveryPerson {
  id: number;
  full_name: string;
  mode_of_transport: string;
}

export interface Place {
  address: string;
  latLng: google.maps.LatLng | null;
}

export type TransportMode =
  | "car"
  | "bicycle"
  | "public transport"
  | "truck"
  | "cargo bike"
  | "other";

export interface TransportModeData {
  mode: TransportMode;
  needsExtraHelper: boolean;
}

export interface PriceInfoProps {
  duration: string | null;
  productPrice: string | null;
  totalPrice: number;
  basePrice: number;
  deliveryDate: Date | null;
  isItemPaidAlready?: boolean;
}
