import React from "react";

interface PriceInfoProps {
  duration: string | null;
  productPrice: string | null;
  totalPrice: number;
  basePrice: number;
  deliveryDate: Date | null;
  isItemPaidAlready?: boolean;
  transportMode?: string;
  needsExtraHelper?: boolean;
}

interface PriceDetailProps {
  label: string;
  amount: number;
  className?: string;
}

const PriceDetail: React.FC<PriceDetailProps> = ({
  label,
  amount,
  className,
}) => (
  <div className={`flex justify-between items-center ${className || ""}`}>
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{amount.toFixed(2)} €</span>
  </div>
);

export const formatTimeSaved = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${remainingMinutes} min`;
  }
};

export const calculateTimeSaved = (duration: string): number => {
  if (!duration) return 0;
  const parts = duration.split(" ");
  let hours = 0;
  let minutes = 0;

  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];

    if (unit.startsWith("hour")) {
      hours = value;
    } else if (unit.startsWith("min")) {
      minutes = value;
    }
  }

  const totalMinutes = hours * 60 + minutes;
  const savedMinutes = totalMinutes * 2;

  return savedMinutes;
};

const PriceInfo: React.FC<PriceInfoProps> = ({
  duration,
  productPrice,
  totalPrice,
  basePrice,
  deliveryDate,
  isItemPaidAlready = true,
  transportMode,
  needsExtraHelper = false,
}) => {
  const productPriceFloat = productPrice
    ? parseFloat(productPrice.replace("€", "").trim())
    : 0;

  const productSurcharge =
    productPriceFloat > 120 ? productPriceFloat * 0.1 : 0;

  const getUrgencySurcharge = (): number => {
    if (!deliveryDate) return 0;
    const today = new Date();
    const daysFromNow = Math.ceil(
      (deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysFromNow === 2) return 2;
    if (daysFromNow === 1) return 5;
    return 0;
  };

  const urgencySurcharge = getUrgencySurcharge();

  const getVehicleCost = (): number => {
    if (!duration || !transportMode) return 0;

    const timeSavedHours = calculateTimeSaved(duration) / 60;

    switch (transportMode) {
      case "car":
        return 30 * timeSavedHours;
      case "truck":
        return 50 * timeSavedHours;
      case "cargo bike":
        return 10 * timeSavedHours;
      default:
        return 0;
    }
  };

  const getHelperCost = (): number => {
    if (!duration || !needsExtraHelper) return 0;
    const HELPER_RATE = 15;
    const timeSavedHours = calculateTimeSaved(duration) / 60;
    return HELPER_RATE * timeSavedHours;
  };

  const vehicleCost = getVehicleCost();
  const helperCost = getHelperCost();

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-l font-semibold text-gray-700 mb-4">
        Price Information
      </h2>
      <div className="space-y-3">
        <PriceDetail
          label="Delivery Price"
          amount={
            basePrice +
            productSurcharge +
            urgencySurcharge +
            vehicleCost +
            helperCost
          }
          className="pb-2 border-b border-gray-200"
        />

        {!isItemPaidAlready && (
          <PriceDetail
            label="Item Price"
            amount={productPriceFloat}
            className="pb-2 border-b border-gray-200"
          />
        )}

        <PriceDetail
          label="Total Price"
          amount={totalPrice}
          className="pt-2 border-t border-gray-200 font-bold text-lg"
        />
      </div>
    </div>
  );
};

export default PriceInfo;
