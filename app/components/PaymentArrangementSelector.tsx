import React, { useState } from "react";

interface PaymentOptionSelectorProps {
  onPaymentOptionChange: (isPrepaid: boolean) => void;
  initialValue: boolean;
}

const PaymentOptionSelector: React.FC<PaymentOptionSelectorProps> = ({
  onPaymentOptionChange,
  initialValue,
}) => {
  const [isPrepaid, setIsPrepaid] = useState<boolean>(initialValue);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "prepaid";
    setIsPrepaid(value);
    onPaymentOptionChange(value);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Payment Arrangement
      </h3>
      <div className="space-y-4">
        <label
          className={`
            relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
            ${
              isPrepaid
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          <input
            type="radio"
            value="prepaid"
            checked={isPrepaid}
            onChange={handleOptionChange}
            className="form-radio h-4 w-4 text-blue-600 hidden"
          />
          <span className="font-medium text-gray-700">
            I&apos;ve already paid for the product. Please pickup & deliver it
            to me.
          </span>
          {isPrepaid && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
        </label>

        <div className="space-y-2">
          <label
            className={`
              relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${
                !isPrepaid
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            <input
              type="radio"
              value="kk_payment"
              checked={!isPrepaid}
              onChange={handleOptionChange}
              className="form-radio h-4 w-4 text-blue-600 hidden"
            />
            <span className="font-medium text-gray-700">
              I would like you to handle payment, including price of the item
            </span>
            {!isPrepaid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </label>

          {!isPrepaid && (
            <p className="text-xs text-gray-500 italic ml-4">
              * In case we cannot find seller, the delivery fee is
              non-refundable
            </p>
          )}
        </div>

        {!isPrepaid && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="text-sm text-yellow-700">
                We&apos;ll have a video call for you to verify the product
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentOptionSelector;
