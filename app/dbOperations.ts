import { DeliveryPerson, MapData, ProductData } from '@/types/common';
import {supabase} from './supabaseClient';

export const fetchDeliveryPeople = async () => {
    const { data, error } = await supabase.from('users')
      .select('id, full_name, ratings')
      .eq('type', 'Delivery Person');
    if (error) {
      console.error('Error fetching delivery people:', error);
      return [];
    } else {
      return data;
    }
};

const upsertUser = async (name: string, email: string, phoneNumber: string) => {
    // Check whether the user email already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the code for "No rows found"
      console.error('Error fetching user from database:', fetchError);
      return null;
    }

    if (existingUser) {
      // Email already exists, update the user info and return the user ID
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          full_name: name,
          phone_number: phoneNumber
        })
        .eq('email', email)
        .select();

      if (updateError) {
        console.error('Error updating user in database:', updateError);
        return null;
      }

      return updatedUser[0].id;
    }

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          full_name: name,
          email: email,
          phone_number: phoneNumber
        }
      ])
      .select();

    if (error) {
      console.error('Error saving to database:', error);
      return null;
    } else {
      if (data && data.length > 0) {
        const userId = data[0].id;
        return userId;
      }
      return null;
    }
};

export const savePickupUserToDatabase = async (pickupFromName: string, pickupFromEmail: string, pickupFromPhoneNumber: string) => {
    return await upsertUser(pickupFromName, pickupFromEmail, pickupFromPhoneNumber);
};

export const saveDeliverUserToDatabase = async (deliverToName: string, deliverToEmail: string, deliverToPhoneNumber: string) => {
    return await upsertUser(deliverToName, deliverToEmail, deliverToPhoneNumber);
};

export const saveProductToDatabase = async (productData: ProductData) => {
    const { data, error } = await supabase
      .from('product')
      .insert([
        {
          url: productData?.newUrl,
          title: productData?.title,
          price: productData?.price,
          pic_url: productData?.pic_url,
          listed_by: productData?.listed_by
        }
      ]).select();
    if (error) {
      console.error('Error saving to database:', error);
      return null;
    } else {
      if (data && data.length > 0) {
        const productId = data[0].id;
        return productId;
      }
      return null;
    }
};

export const saveLogisticsToDatabase = async (mapData: MapData, additionalPickupInstructions: string, additionalDeliveryInstructions: string) => {
    const { data, error } = await supabase
      .from('logistics')
      .insert([
        {
          from: mapData?.from,
          to: mapData?.to,
          from_additional_instructions: additionalPickupInstructions,
          to_additional_instructions: additionalDeliveryInstructions
        }
      ]).select();
    if (error) {
      console.error('Error saving to database:', error);
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
    .from('locations')
    .insert([
      {
        from: mapData?.from,
        to: mapData?.to,
      }
    ])
    .select();
  if (error) {
    console.error('Error saving to database:', error);
  } else {
    console.log('Data saved successfully:', data);
  }
}

export const saveOrderToDatabase = async (pickupUserId: number, deliverUserId: number, productId: number, logisticId: number, selectedDeliveryPerson: DeliveryPerson, selectedDate: Date, selectedTime: string, serviceType: 'buying' | 'selling', totalPrice: number) => {
    //Determine placed_by based on the service type
    const placedBy = serviceType === 'buying' ? deliverUserId : pickupUserId;
  
    // Insert data into orders table
    const { data, error } = await supabase
      .from('order')
      .insert([
        {
          placed_by: placedBy,
          product: productId,
          service_type: serviceType,
          logistics: logisticId,
          delivered_by: selectedDeliveryPerson?.id,
          pickup_from: pickupUserId,
          type: serviceType,
          deliver_to: deliverUserId,
          pickup_on: selectedDate,
          pickup_between: selectedTime,
          status: 'order_processing',
          total: totalPrice.toString(),
        },
      ]).select(`
        *,
        product: product (*),
        logistics: logistics (*),
        delivered_by: delivered_by (*),
        pickup_from: pickup_from (*),
        deliver_to: deliver_to (*),
        placed_by: placed_by (*)
      `);
  
    if (error) {
      console.error('Error saving to database:', error);
    } else {
      console.log('Data saved successfully:', data);
      return data[0];
    }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
    console.log('Updating order status:', orderId, status);
    const { data, error } = await supabase
      .from('order')
      .update({ status: status })
      .eq('id', orderId)
      .select();
    if (error) {
      console.error('Error updating order status:', error);
    } else {
      console.log('Order status updated successfully:', data);
    }
};
