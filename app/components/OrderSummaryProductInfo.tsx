import Image from "next/image";
import { ProductData } from "@/types/common";
import TypeOfService from "./TypeOfService";

interface OrderSummaryProductInfoProps {
  productData: ProductData;
  serviceType: "buying" | "selling";
  handleServiceTypeChange: (type: "buying" | "selling") => void;
}

const OrderSummaryProductInfo = ({
  productData,
  serviceType,
  handleServiceTypeChange,
}: OrderSummaryProductInfoProps) => {
  return (
    <div className="mt-3 p-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
        <h2 className="text-xl font-semibold">Product Info</h2>
      </div>
      {productData.pic_url && (
        <div className="flex justify-center items-center mt-4 mb-8 lg:mb-4">
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
        <div className="pt-2 pb-3 space-y-2 text-gray-600">
          <p>
            <strong>{productData.title}</strong>
          </p>
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
