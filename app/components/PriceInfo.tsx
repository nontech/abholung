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
  totalPrice,
  basePrice,
  productPrice,
  deliveryDate,
  duration,
  isItemPaidAlready,
  transportMode,
  needsExtraHelper,
  vehicleCost,
  helperCost,
  urgencySurcharge,
}) => {
  const productPriceFloat = productPrice ? parseGermanPrice(productPrice) : 0;
  const productSurcharge =
    productPriceFloat > 120 ? Math.min(productPriceFloat * 0.1, 20) : 0;

  return (
    <div className="bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
        <h2 className="text-xl font-semibold text-gray-800">Price Breakdown</h2>
      </div>

      <div className="space-y-4">
        <PriceDetail
          label="Delivery Price"
          amount={
            basePrice +
            productSurcharge +
            urgencySurcharge +
            vehicleCost +
            helperCost
          }
          className="pb-3"
        />

        {!isItemPaidAlready && productPrice && (
          <PriceDetail
            label="Product Price"
            amount={parseGermanPrice(productPrice)}
            className="pb-3"
          />
        )}

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Total</span>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {formatGermanPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceInfo;
