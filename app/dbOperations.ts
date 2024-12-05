import {
  DeliveryPerson,
  MapData,
  ProductData,
  TransportMode,
  TransportModeData,
} from "@/types/common";
import { supabase } from "./supabaseClient";

const upsertUser = async (name: string, email: string, phoneNumber: string) => {
  // Check whether the user email already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is the code for "No rows found"
    console.error("Error fetching user from database:", fetchError);
    return null;
  }

  if (existingUser) {
    // Email already exists, update the user info and return the user ID
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        full_name: name,
        phone_number: phoneNumber,
      })
      .eq("email", email)
      .select();

    if (updateError) {
      console.error("Error updating user in database:", updateError);
      return null;
    }

    return updatedUser[0].id;
  }

  // Insert new user
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name: name,
        email: email,
        phone_number: phoneNumber,
      },
    ])
    .select();

  if (error) {
    console.error("Error saving to database:", error);
    return null;
  } else {
    if (data && data.length > 0) {
      const userId = data[0].id;
      return userId;
    }
    return null;
  }
};

export const savePickupUserToDatabase = async (
  pickupFromName: string,
  pickupFromEmail: string,
  pickupFromPhoneNumber: string
) => {
  return await upsertUser(
    pickupFromName,
    pickupFromEmail,
    pickupFromPhoneNumber
  );
};

export const saveDeliverUserToDatabase = async (
  deliverToName: string,
  deliverToEmail: string,
  deliverToPhoneNumber: string
) => {
  return await upsertUser(deliverToName, deliverToEmail, deliverToPhoneNumber);
};

export const saveProductToDatabase = async (productData: ProductData) => {
  const { data, error } = await supabase
    .from("product")
    .insert([
      {
        url: productData?.newUrl,
        title: productData?.title,
        price: productData?.price,
        pic_url: productData?.pic_url,
        listed_by: productData?.listed_by,
      },
    ])
    .select();
  if (error) {
    console.error("Error saving to database:", error);
    return null;
  } else {
    if (data && data.length > 0) {
      const productId = data[0].id;
      return productId;
    }
    return null;
  }
};

export const saveLogisticsToDatabase = async (
  mapData: MapData,
  additionalPickupInstructions: string,
  additionalDeliveryInstructions: string,
  transportMode: TransportModeData,
  other_mode: string | null
) => {
  const { data, error } = await supabase
    .from("logistics")
    .insert([
      {
        from: mapData?.from,
        to: mapData?.to,
        from_additional_instructions: additionalPickupInstructions,
        to_additional_instructions: additionalDeliveryInstructions,
        mode_of_transport: transportMode.mode,
        needs_extra_helper: transportMode.needsExtraHelper,
        other_mode: other_mode,
      },
    ])
    .select();
  if (error) {
    console.error("Error saving to database:", error);
    return null;
  } else {
    if (data && data.length > 0) {
      const logisticId = data[0].id;
      return logisticId;
    }
    return null;
  }
};

export const saveLocationToDatabase = async (mapData: MapData) => {
  const { data, error } = await supabase
    .from("locations")
    .insert([
      {
        from: mapData?.from,
        to: mapData?.to,
      },
    ])
    .select();
  if (error) {
    console.error("Error saving to database");
  } else {
    console.log("Data saved successfully:", data);
  }
};

export const saveOrderToDatabase = async (
  pickupUserId: number,
  deliverUserId: number,
  productId: number,
  logisticId: number,
  deliveryPerson: DeliveryPerson,
  selectedDate: Date,
  selectedTime: string,
  serviceType: "buying" | "selling",
  totalPrice: number,
  paymentDone: boolean,
  is_item_paid: boolean | null,
  included_item_price: number | null,
  vehicle_cost: number | null,
  helper_cost: number | null,
  urgency_surcharge: number | null
) => {
  //Determine placed_by based on the service type
  const placedBy = serviceType === "buying" ? deliverUserId : pickupUserId;

  // Insert data into orders table
  const { data, error } = await supabase
    .from("order")
    .insert([
      {
        placed_by: placedBy,
        product: productId,
        payment_done: paymentDone,
        service_type: serviceType,
        logistics: logisticId,
        delivered_by: deliveryPerson?.id,
        pickup_from: pickupUserId,
        type: serviceType,
        deliver_to: deliverUserId,
        pickup_on: selectedDate,
        pickup_between: selectedTime,
        status: "order_pending_payment",
        total: totalPrice.toFixed(2).toString(),
        is_item_paid: is_item_paid,
        included_item_price: included_item_price?.toFixed(2).toString(),
        vehicle_cost: vehicle_cost?.toFixed(2).toString(),
        helper_cost: helper_cost?.toFixed(2).toString(),
        urgency_surcharge: urgency_surcharge?.toFixed(2).toString(),
      },
    ])
    .select();

  if (error) {
    console.error("Error saving to database");
  } else {
    console.log("Data saved successfully");
    return data[0].id;
  }
};

export const updateOrderPaymentDone = async (
  orderId: number,
  paymentDone: boolean,
  payment_method: string,
  payment_error: string | null
) => {
  const { data, error } = await supabase
    .from("order")
    .update({
      payment_done: paymentDone,
      status: paymentDone ? "order_processing" : "order_pending_payment",
      payment_method: payment_method,
      payment_error: payment_error,
    })
    .eq("id", orderId).select(`
      *,
      product: product (*),
      logistics: logistics (*),
      delivered_by: delivered_by (*),
      pickup_from: pickup_from (*),
      deliver_to: deliver_to (*),
      placed_by: placed_by (*)
    `);

  if (error) {
    console.error("Error saving to database");
  } else {
    console.log("Data saved successfully");
    return data[0];
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  console.log("Updating order status");
  const { data, error } = await supabase
    .from("order")
    .update({ status: status })
    .eq("id", orderId)
    .select();
  if (error) {
    console.error("Error updating order status");
  } else {
    console.log("Order status updated successfully:", data);
  }
};

export const fetchDeliveryPersonByMode = async (mode: TransportMode) => {
  try {
    const { data, error } = await supabase
      .from("messengers")
      .select("id, full_name, mode_of_transport")
      .contains("mode_of_transport", [mode])
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching delivery person:", error);
    return null;
  }
};
