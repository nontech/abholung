"use client";

// Import React & Next stuff
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// Import types
import { Database } from "@/types/supabase-types";
import type {
  DeliveryPerson,
  MapData,
  Place,
  ProductData,
  TransportMode,
} from "../types/common";
import { DeliveryDetails, DetailsPageType } from "../types/common";

// Import database operations
import {
  fetchDeliveryPersonByMode,
  saveDeliverUserToDatabase,
  saveLocationToDatabase,
  saveLogisticsToDatabase,
  saveOrderToDatabase,
  savePickupUserToDatabase,
  saveProductToDatabase,
  updateOrderPaymentDone,
} from "./dbOperations";

// Import common components on every page
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";

// Import buttons
import BackButton from "./components/BackButton";
import ContinueButton from "./components/ContinueButton";

// Import components
import ProductInfo from "./components/ProductInfo";
// import DateInput from "./components/DateInput";
import CheckoutContent from "./components/CheckoutContent";
import DatePicker from "./components/DatePicker";
import PaymentOptionSelector from "./components/PaymentArrangementSelector";
import PriceInfo, { calculateTimeSaved } from "./components/PriceInfo";
import TimePicker from "./components/TimePicker";
import TransportModeSelector from "./components/TransportModeSelector";
import TransportRoute from "./components/TransportRoute";
import TypeOfService from "./components/TypeOfService";

// Import pages
import DetailsPage from "./components/DetailsPage";
import SummaryPage from "./components/SummaryPage";

// Experimental
// import StageButtons from './components/StageButtons';

// Define the Order type using the Database type
type Order = Database["public"]["Tables"]["order"]["Row"];

// Define the Product type using the Database type
type Product = Database["public"]["Tables"]["product"]["Row"];

type Logistics = Database["public"]["Tables"]["logistics"]["Row"];

type Users = Database["public"]["Tables"]["users"]["Row"];

// Extend the Order type to include the related Product fields
type OrderAll = Order & {
  product: Product;
  logistics: Logistics;
  delivered_by: Users;
  pickup_from: Users;
  deliver_to: Users;
  placed_by: Users;
};

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

// Add AlertCircle to the imports at the top
import { AlertCircle } from "lucide-react";

// Add this import at the top with other imports
import { ChevronDown, ChevronUp } from "lucide-react";

// Add a helper function to parse German price format
const parseGermanPrice = (price: string): number => {
  // Remove currency symbol and any whitespace
  const cleanPrice = price.replace("€", "").trim();
  // Replace dots (thousand separators) with nothing and comma with dot
  const standardizedPrice = cleanPrice.replace(".", "").replace(",", ".");
  return parseFloat(standardizedPrice);
};

// Add this after the imports
const HOW_IT_WORKS_STEPS = [
  {
    title: "Find Your Item",
    description: "Copy the Kleinanzeigen URL of your item",
    icon: "🔍",
  },
  {
    title: "Enter Details",
    description: "Add pickup & delivery locations",
    icon: "📝",
  },
  {
    title: "Choose Transport",
    description: "Select suitable transport mode",
    icon: "🚚",
  },
  {
    title: "Secure Payment",
    description: "Pay securely and track order",
    icon: "💳",
  },
];

export default function Home() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [url, setUrl] = useState<string>("");
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 3);
    return initialDate;
  });
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Pickup from details
  const [pickupFromName, setPickupFromName] = useState<string>("");
  const [pickupFromEmail, setPickupFromEmail] = useState<string>("");
  const [pickupFromPhoneNumber, setPickupFromPhoneNumber] =
    useState<string>("");
  const [additionalPickupInstructions, setAdditionalPickupInstructions] =
    useState<string>("");

  // Deliver to details
  const [deliverToName, setdeliverToName] = useState<string>("");
  const [deliverToEmail, setdeliverToEmail] = useState<string>("");
  const [deliverPhoneNumber, setdeliverPhoneNumber] = useState<string>("");
  const [additionalDeliveryInstructions, setAdditionaldeliveryInstructions] =
    useState<string>("");

  // Set Messenger
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(
    null
  );

  // Transport route details
  const [origin, setOrigin] = useState<Place>({
    address: "",
    latLng: null,
  });
  const [destination, setDestination] = useState<Place>({
    address: "",
    latLng: null,
  });
  const [duration, setDuration] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<"buying" | "selling">(
    "buying"
  );
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [SearchFormErrors, setSearchFormErrors] = useState({
    product: "",
    pickupFrom: "",
    deliverTo: "",
    pickupOn: "",
    pickupBetween: "",
  });

  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [stage, setStage] = useState<number>(1);

  const [orderId, setOrderId] = useState<number | null>(null);

  const [transportMode, setTransportMode] = useState<{
    mode: TransportMode;
    needsExtraHelper: boolean;
    otherModeText?: string;
  }>({
    mode: "public transport",
    needsExtraHelper: false,
    otherModeText: undefined,
  });

  const [isItemPaidAlready, setIsItemPaidAlready] = useState(true);

  // Add state for the costs
  const [vehicleCost, setVehicleCost] = useState<number>(0);
  const [helperCost, setHelperCost] = useState<number>(0);
  const [urgencySurcharge, setUrgencySurcharge] = useState<number>(0);

  // Calculate total price whenever dependencies change
  useEffect(() => {
    let total = basePrice;

    // Add product value surcharge
    const productPriceFloat = productData?.price
      ? parseGermanPrice(productData.price)
      : 0;

    // Add product price if KK is handling payment AND it's a buying service
    if (!isItemPaidAlready && serviceType === "buying") {
      total += productPriceFloat;
    }

    // Add product value surcharge
    if (productPriceFloat > 120) {
      total += Math.min(productPriceFloat * 0.1, 20);
    }

    // Calculate and set vehicle cost
    if (duration && transportMode.mode) {
      const timeSavedHours = calculateTimeSaved(duration) / 60;
      const vehicleCosts = {
        car: 30,
        truck: 50,
        "cargo bike": 10,
      };
      const hourlyRate =
        vehicleCosts[transportMode.mode as keyof typeof vehicleCosts] || 0;
      const calculatedVehicleCost = hourlyRate * timeSavedHours;
      setVehicleCost(calculatedVehicleCost);
      total += calculatedVehicleCost;

      // Calculate and set helper cost
      if (transportMode.needsExtraHelper) {
        const HELPER_RATE = 15;
        const calculatedHelperCost = HELPER_RATE * timeSavedHours;
        setHelperCost(calculatedHelperCost);
        total += calculatedHelperCost;
      } else {
        setHelperCost(0);
      }
    }

    // Calculate and set urgency surcharge
    let calculatedUrgencySurcharge = 0;
    if (selectedDate) {
      const daysFromNow = Math.ceil(
        (selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysFromNow === 2) {
        calculatedUrgencySurcharge = 2;
      } else if (daysFromNow === 1) {
        calculatedUrgencySurcharge = 5;
      }
      setUrgencySurcharge(calculatedUrgencySurcharge);
      total += calculatedUrgencySurcharge;
    }

    setTotalPrice(total);
  }, [
    basePrice,
    productData?.price,
    selectedDate,
    isItemPaidAlready,
    duration,
    transportMode.mode,
    transportMode.needsExtraHelper,
    serviceType,
  ]);

  const saveOrderToDb = async () => {
    const pickupUserId = await savePickupUserToDatabase(
      pickupFromName,
      pickupFromEmail,
      pickupFromPhoneNumber
    );
    const deliverUserId = await saveDeliverUserToDatabase(
      deliverToName,
      deliverToEmail,
      deliverPhoneNumber
    );
    const productId = await saveProductToDatabase(productData!);
    const logisticId = await saveLogisticsToDatabase(
      mapData!,
      additionalPickupInstructions,
      additionalDeliveryInstructions,
      transportMode,
      transportMode.otherModeText || null
    );
    if (pickupUserId && deliverUserId && productId && logisticId) {
      const orderId: number | null = await saveOrderToDatabase(
        pickupUserId,
        deliverUserId,
        productId,
        logisticId,
        deliveryPerson!,
        selectedDate!,
        selectedTime,
        serviceType,
        totalPrice,
        false, // paymentDone
        isItemPaidAlready,
        !isItemPaidAlready ? parseGermanPrice(productData!.price!) : null,
        vehicleCost,
        helperCost,
        urgencySurcharge
      );
      return orderId;
    }
    return null;
  };

  const updateOrderPaymentDetails = async (
    paymentDone: boolean,
    payment_method: string,
    payment_error: string | null
  ) => {
    if (orderId) {
      const orderData: OrderAll | null = await updateOrderPaymentDone(
        orderId,
        paymentDone,
        payment_method,
        payment_error
      );
      return orderData;
    }
    return null;
  };

  const handleDetailsPageSubmission = async (submitted: boolean) => {
    if (submitted) {
      const orderId = await saveOrderToDb();
      if (orderId) {
        setOrderId(orderId);
      }
    }
  };

  const handlePaymentError = async (payment_method: string, error: string) => {
    console.error("Payment failed:", error);
    await updateOrderPaymentDetails(false, payment_method, error);
  };

  const handleSuccessfulPayment = async (payment_method: string) => {
    setStage(4);
    setIsConfettiActive(true);
    console.log("paymentDone is done, sending emails & saving to database");
    const sendEmail = async (orderData: OrderAll) => {
      try {
        const emailSend =
          serviceType === "buying" ? deliverToEmail : pickupFromEmail;
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emails: [
              {
                to: emailSend,
                subject: `Order being processed - #[${orderData.id}]`,
                type: "order_processing_customer",
                orderData: orderData,
              },
              {
                to: "info@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
              {
                to: "aman.jaiswal@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
              {
                to: "mukesh.jaiswal@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
              {
                to: "philip.tapiwa@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
            ],
          }),
        });
        console.log("Emails sent successfully");
      } catch (error) {
        console.error("Error sending emails:");
        alert("Error sending emails");
      }
    };

    const orderData = await updateOrderPaymentDetails(
      true,
      payment_method,
      null
    );
    if (orderData) {
      await sendEmail(orderData);
    }
  };

  const pickupDetails: DeliveryDetails = {
    name: pickupFromName,
    email: pickupFromEmail,
    phoneNumber: pickupFromPhoneNumber,
    additionalInstructions: additionalPickupInstructions,
    address: mapData?.from,
    date: selectedDate,
    time: selectedTime,
  };

  const deliveryDetails: DeliveryDetails = {
    name: deliverToName,
    email: deliverToEmail,
    phoneNumber: deliverPhoneNumber,
    additionalInstructions: additionalDeliveryInstructions,
    address: mapData?.to,
    date: selectedDate,
    time: selectedTime,
  };

  const detailsPageProps: DetailsPageType = {
    serviceType: serviceType,
    mapData: mapData,
    selectedDate: selectedDate,
    selectedTime: selectedTime,
    pickupFromName: pickupFromName,
    pickupFromEmail: pickupFromEmail,
    pickupFromPhoneNumber: pickupFromPhoneNumber,
    additionalPickupInstructions: additionalPickupInstructions,
    onPickupFromNameChange: setPickupFromName,
    onPickupFromEmailChange: setPickupFromEmail,
    onPickupFromPhoneNumberChange: setPickupFromPhoneNumber,
    onAdditionalPickupInstructionsChange: setAdditionalPickupInstructions,
    deliverToName: deliverToName,
    deliverToEmail: deliverToEmail,
    deliverToPhoneNumber: deliverPhoneNumber,
    additionalDeliveryInstructions: additionalDeliveryInstructions,
    onDeliverToNameChange: setdeliverToName,
    onDeliverToEmailChange: setdeliverToEmail,
    onDeliverToPhoneNumberChange: setdeliverPhoneNumber,
    onAdditionalDeliveryInstructionsChange: setAdditionaldeliveryInstructions,
    productData: productData!,
    totalPrice: totalPrice,
    onEdit: setStage,
  };

  const validateSearchForm = () => {
    const newErrors = {
      product: !productData?.newUrl?.trim()
        ? "Please paste a valid Kleinanzeigen product link"
        : "",
      pickupFrom: !mapData?.from?.trim() ? "Pickup From is required" : "",
      deliverTo: !mapData?.to?.trim() ? "Delivery To is required" : "",
      pickupOn: !selectedDate ? "Pickup On is required" : "",
      pickupBetween: !selectedTime ? "Pickup Between is required" : "",
    };

    setSearchFormErrors(newErrors);

    // Check if any error message is not empty
    return !Object.values(newErrors).some((error) => error !== "");
  };

  function isAddressInBerlin(): boolean {
    return (
      origin.address.toLowerCase().includes("berlin") &&
      destination.address.toLowerCase().includes("berlin")
    );
  }

  const handleContinue = async () => {
    const validForm = validateSearchForm();
    // No form errors
    if (validForm) {
      if (!isAddressInBerlin()) {
        // save entries to databae
        await saveLocationToDatabase(mapData!);
        // open info modal
        const infoModal = document.getElementById(
          "info_modal"
        ) as HTMLDialogElement | null;
        if (infoModal) {
          infoModal.showModal();
        }
        return;
      }
      // move on to details page
      setStage(2);
    } else {
      setTimeout(() => {
        const continueButton = document.getElementById("continue-section");
        if (continueButton) {
          continueButton.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  };

  const handleBack = () => {
    if (stage > 1 && stage < 4) {
      setStage(stage - 1);
    }
  };

  const handleDateChange = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
    setSearchFormErrors((prevErrors) => ({
      ...prevErrors,
      pickupOn: "",
    }));
  }, []);

  const handleModeChange = async (
    mode: TransportMode,
    needsExtraHelper: boolean,
    otherModeText?: string
  ) => {
    setTransportMode({
      mode,
      needsExtraHelper,
      otherModeText: mode === "other" ? otherModeText : undefined,
    });

    // Fetch and set delivery person based on transport mode
    const deliveryPerson = await fetchDeliveryPersonByMode(mode);
    if (deliveryPerson) {
      setDeliveryPerson(deliveryPerson);
    }
  };

  const handlePaymentOptionChange = (isPaid: boolean) => {
    setIsItemPaidAlready(isPaid);
  };

  const handleServiceTypeChange = (type: "buying" | "selling") => {
    setServiceType(type);
    // When selling is selected, always set to prepaid and don't allow changes
    if (type === "selling") {
      setIsItemPaidAlready(true);
    }
  };

  // First, update the initial state of isHowItWorksOpen to be true
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(true);

  // Then, add/update the useEffect to close it when product is loaded
  useEffect(() => {
    if (productData) {
      setIsHowItWorksOpen(false);
    }
  }, [productData]);

  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-gray-50 to-teal-50 p-5 min-h-screen">
      <Header />
      <div className="ml-64 mb-5">
        {/* Back Navigation */}
        {stage > 1 && stage < 4 && <BackButton onClick={handleBack} />}
      </div>

      {/* Progress Bar */}
      {stage <= 3 && (
        <div
          className={`h-full p-4 mb-10 ${
            stage === 1 ? "max-w-2xl mx-10" : "w-full px-10"
          }`}
        >
          <ProgressBar currentStep={stage} />
        </div>
      )}

      {stage === 1 && (
        <div className="flex flex-col lg:flex-row w-full max-w-4xl mx-10">
          <div className="w-full lg:w-2/3 lg:pr-4">
            {/* Wrap ProductInfo in a card */}
            <div className="bg-white rounded-lg shadow-md mb-6 relative">
              <ProductInfo
                onProductFetched={setProductData}
                url={url}
                onUrlChange={(newUrl) => {
                  setUrl(newUrl);
                  setSearchFormErrors((prevErrors) => ({
                    ...prevErrors,
                    product: "",
                  }));
                }}
                productError={SearchFormErrors.product}
              />
            </div>

            {!productData ? (
              <div className="sm:fixed right-10 top-40 w-96 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                  How It Works
                </h2>
                <div className="space-y-0">
                  {HOW_IT_WORKS_STEPS.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex gap-3">
                        {/* Icon Circle */}
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <span className="text-xl">{step.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="pb-8">
                          <h3 className="font-bold text-xl text-gray-800 mb-1">
                            {step.title}
                          </h3>
                          <p className="text-lg text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      {index < HOW_IT_WORKS_STEPS.length - 1 && (
                        <div
                          className="absolute left-[15px] top-8 w-[2px] h-[calc(100%-16px)] bg-emerald-200"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full mt-6 rounded-lg lg:mt-0">
                <div className="lg:fixed lg:top-5 lg:bottom-5 lg:right-24 w-full lg:w-1/4 space-y-4">
                  {/* Separate How It Works Card */}
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <button
                      onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
                      className="w-full p-4 flex justify-between items-center text-left"
                    >
                      <span className="text-lg font-medium">How It Works</span>
                      {isHowItWorksOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {isHowItWorksOpen && (
                      <div className="p-4 pt-0 space-y-0">
                        {HOW_IT_WORKS_STEPS.map((step, index) => (
                          <div key={index} className="relative">
                            <div className="flex gap-3">
                              {/* Icon Circle */}
                              <div className="relative z-10 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <span className="text-sm">{step.icon}</span>
                              </div>

                              {/* Content */}
                              <div className="pb-8">
                                <h3 className="text-md text-gray-800">
                                  {step.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {step.description}
                                </p>
                              </div>
                            </div>

                            {/* Connecting Line */}
                            {index < HOW_IT_WORKS_STEPS.length - 1 && (
                              <div
                                className="absolute left-[11px] top-6 w-[2px] h-[calc(100%-12px)] bg-emerald-200"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order Summary Card */}
                  <div
                    className={`bg-white p-3 lg:p-6 rounded-lg shadow-md overflow-y-auto ${
                      isHowItWorksOpen
                        ? "lg:max-h-[calc(100vh-450px)]" // Less height when How It Works is expanded
                        : "lg:max-h-[calc(100vh-200px)]" // More height when collapsed
                    }`}
                  >
                    <h2 className="text-2xl font-semibold mb-3 lg:mb-4">
                      Order Summary
                    </h2>

                    <div className="mt-3 lg:mt-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                        <h2 className="text-xl font-semibold"> Product info</h2>
                      </div>
                      <span className="text-md mb-2 truncate">
                        <strong>Title:</strong> {productData.title}
                      </span>
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
                                <strong>Product price:</strong>{" "}
                                {productData.price}
                              </p>
                              <p className="text-sm">
                                <strong>Listed by:</strong>{" "}
                                {productData.listed_by}
                              </p>
                              <p className="text-sm">
                                <strong>Pickup Address:</strong>{" "}
                                {productData.address}
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
                    <div className="hidden lg:block">
                      <PriceInfo
                        totalPrice={totalPrice}
                        basePrice={basePrice}
                        productPrice={productData?.price || ""}
                        deliveryDate={selectedDate}
                        duration={duration}
                        isItemPaidAlready={isItemPaidAlready}
                        transportMode={transportMode.mode}
                        needsExtraHelper={transportMode.needsExtraHelper}
                        vehicleCost={vehicleCost}
                        helperCost={helperCost}
                        urgencySurcharge={urgencySurcharge}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <TransportRoute
              origin={origin}
              destination={destination}
              setOrigin={(newOrigin) => {
                setOrigin(newOrigin);
                setSearchFormErrors((prevErrors) => ({
                  ...prevErrors,
                  pickupFrom: "",
                }));
              }}
              setDestination={(newDestination) => {
                setDestination(newDestination);
                setSearchFormErrors((prevErrors) => ({
                  ...prevErrors,
                  deliverTo: "",
                }));
              }}
              onMapDataChange={setMapData}
              pickupFromError={SearchFormErrors.pickupFrom}
              deliverToError={SearchFormErrors.deliverTo}
              duration={duration}
              setDuration={setDuration}
              setTotalPrice={setBasePrice}
            />

            {/* Wrap just the date/time pickers in a card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-6">
              <div className="flex flex-row items-center gap-3 mb-6">
                <div className="h-10 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                <h2 className="text-2xl font-semibold ">Pickup Schedule</h2>
              </div>
              <div className="flex mb-4 grid grid-cols-1 sm:grid-cols-1 w-full gap-6">
                <div>
                  <DatePicker
                    date={selectedDate || undefined}
                    setSelectedDate={handleDateChange}
                  />
                </div>
                <div>
                  <TimePicker
                    selectedTime={selectedTime}
                    onTimeChange={(time) => {
                      setSelectedTime(time);
                      setSearchFormErrors((prevErrors) => ({
                        ...prevErrors,
                        pickupBetween: "",
                      }));
                    }}
                    pickupBetweenError={SearchFormErrors.pickupBetween}
                  />
                </div>
              </div>
            </div>

            <TransportModeSelector
              selectedMode={transportMode.mode}
              needsExtraHelper={transportMode.needsExtraHelper}
              onModeChange={handleModeChange}
              duration={duration}
              otherModeText={transportMode.otherModeText}
            />
            {/* Payment Option Selector or Disclaimer */}
            {serviceType === "buying" ? (
              <PaymentOptionSelector
                onPaymentOptionChange={handlePaymentOptionChange}
                initialValue={isItemPaidAlready}
              />
            ) : (
              <div className="p-6 bg-white rounded-lg shadow-md mb-6">
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Payment Reminder</span>
                </div>
                <p className="mt-2 text-gray-600">
                  Make sure the payment for item has been done by the buyer
                </p>
              </div>
            )}

            <div className="mt-4 lg:hidden">
              <PriceInfo
                totalPrice={totalPrice}
                basePrice={basePrice}
                productPrice={productData?.price || ""}
                deliveryDate={selectedDate}
                duration={duration}
                isItemPaidAlready={isItemPaidAlready}
                transportMode={transportMode.mode}
                needsExtraHelper={transportMode.needsExtraHelper}
                vehicleCost={vehicleCost}
                helperCost={helperCost}
                urgencySurcharge={urgencySurcharge}
              />
            </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="info_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-center text-md">
                  We are currently only available in Berlin.
                  <br />
                  <br />
                  Coming to rest of Germany soon!
                </h3>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            {/* Show form errors above Continue button */}
            <div
              id="continue-section"
              className="flex flex-col items-center my-8 py-4"
            >
              {Object.values(SearchFormErrors).some(
                (error) => error !== ""
              ) && (
                <div className="mb-4">
                  {Object.values(SearchFormErrors).map(
                    (error, index) =>
                      error && (
                        <p key={index} className="text-red-500 text-sm">
                          {error}
                        </p>
                      )
                  )}
                </div>
              )}
              <ContinueButton onClick={handleContinue} isEnabled={true} />
            </div>
          </div>
        </div>
      )}

      {stage === 2 && (
        <DetailsPage
          details={detailsPageProps}
          handleDetailsPageSubmission={handleDetailsPageSubmission}
          deliveryPerson={deliveryPerson}
        />
      )}
      {stage === 3 && (
        <CheckoutContent
          total_amount={totalPrice}
          onPaymentSuccess={(payment_method: string) =>
            handleSuccessfulPayment(payment_method)
          }
          onPaymentError={(payment_method: string, error: string) =>
            handlePaymentError(payment_method, error)
          }
        />
      )}
      {stage === 4 && (
        <SummaryPage
          pickupDetails={pickupDetails}
          deliveryDetails={deliveryDetails}
        />
      )}

      {/* Confetti Animation */}
      {isConfettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
    </div>
  );
}
