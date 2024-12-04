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
  vehicleCost: number;
  helperCost: number;
  urgencySurcharge: number;
}

interface PriceDetailProps {
  label: string;
  amount: number;
  className?: string;
}

const formatGermanPrice = (price: number): string => {
  return (
    price.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
};

const PriceDetail: React.FC<PriceDetailProps> = ({
  label,
  amount,
  className,
}) => (
  <div className={`flex justify-between items-center ${className || ""}`}>
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{formatGermanPrice(amount)}</span>
  </div>
);

const parseGermanPrice = (price: string): number => {
  const cleanPrice = price.replace("€", "").trim();
  const standardizedPrice = cleanPrice.replace(".", "").replace(",", ".");
  return parseFloat(standardizedPrice);
};

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
  vehicleCost,
  helperCost,
  urgencySurcharge,
}) => {
  const productPriceFloat = productPrice ? parseGermanPrice(productPrice) : 0;
  const productSurcharge =
    productPriceFloat > 120 ? productPriceFloat * 0.1 : 0;

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
