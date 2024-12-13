import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProductData } from "@/types/common";
import TypeOfService from "./TypeOfService";

interface OrderSummaryProductInfoProps {
  productData: ProductData;
  isProductDetailsOpen: boolean;
  setIsProductDetailsOpen: (value: boolean) => void;
  serviceType: "buying" | "selling";
  handleServiceTypeChange: (type: "buying" | "selling") => void;
}

const OrderSummaryProductInfo = ({
  productData,
  isProductDetailsOpen,
  setIsProductDetailsOpen,
  serviceType,
  handleServiceTypeChange,
}: OrderSummaryProductInfoProps) => {
  return (
    <div className="mt-3 p-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
        <h2 className="text-xl font-semibold">Product Info</h2>
      </div>
      <div className="overflow-hidden">
        <p className="text-md mb-2 truncate">
          <strong>Title:</strong>{" "}
          <span className="inline-block max-w-[calc(100%-60px)] truncate align-bottom">
            {productData.title}
          </span>
        </p>
      </div>
      {productData.pic_url && (
        <div className="flex justify-center items-center mb-3 lg:mb-4">
          <Image
            src={productData.pic_url}
            alt={productData.title}
            width={120}
            height={120}
            className="rounded-md w-[120px] h-[120px] object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="mt-3">
        <div
          onClick={() =>
            setIsProductDetailsOpen(!isProductDetailsOpen)
          }
          className="w-full cursor-pointer select-none"
        >
          <div className="flex items-center py-2 gap-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <span className="font-bold text-gray-900">
              Product Details
            </span>
            {isProductDetailsOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {isProductDetailsOpen && (
            <div className="pt-2 pb-3 space-y-2 text-gray-600">
              <p className="text-sm">
                <strong>Product price:</strong> {productData.price}
              </p>
              <p className="text-sm">
                <strong>Listed by:</strong> {productData.listed_by}
              </p>
              <p className="text-sm">
                <strong>Pickup Address:</strong> {productData.address}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 mb-3 lg:mt-4">
        <TypeOfService
          onServiceChange={handleServiceTypeChange}
          serviceType={serviceType}
        />
      </div>
    </div>
  );
};

export default OrderSummaryProductInfo;
