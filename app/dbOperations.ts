import { DeliveryPerson, MapData, ProductData } from '@/types/common';
import {supabase} from './supabaseClient';

export const fetchDeliveryPeople = async () => {
    const { data, error } = await supabase.from('users')
      .select('id, full_name')
      .eq('type', 'Delivery Person');
    if (error) {
      console.error('Error fetching delivery people:', error);
      return [];
    } else {
      return data;
    }
};

export const savePickupUserToDatabase = async (pickupFromName: string, pickupFromEmail: string, pickupFromPhoneNumber: string) => {
    const {data, error} = await supabase
      .from('users')
      .insert([
        {
          full_name: pickupFromName,
          email: pickupFromEmail,
          phone_number: pickupFromPhoneNumber
        }
      ]).select();
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

export const saveDeliverUserToDatabase = async (deliverToName: string, deliverToEmail: string, deliverToPhoneNumber: string) => {
    const {data, error} = await supabase
      .from('users')
      .insert([
        {
          full_name: deliverToName,
          email: deliverToEmail,
          phone_number: deliverToPhoneNumber
        }
      ]).select();
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

export const saveProductToDatabase = async (productData: ProductData) => {
    const { data, error } = await supabase
      .from('product')
      .insert([
        {
          url: productData?.url,
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

export const saveOrderToDatabase = async (pickupUserId: number, deliverUserId: number, productId: number, logisticId: number, selectedDeliveryPerson: DeliveryPerson, selectedDate: Date, selectedTime: string) => {
  
    // Insert data into orders table
    const { data, error } = await supabase
      .from('order')
      .insert([
        {
          product: productId,
          logistics: logisticId,
          delivered_by: selectedDeliveryPerson?.id,
          pickup_from: pickupUserId,
          type: 'test',
          deliver_to: deliverUserId,
          pickup_on: selectedDate,
          pickup_between: selectedTime,
          total: '999',
        },
      ]).select();
  
    if (error) {
      console.error('Error saving to database:', error);
    } else {
      console.log('Data saved successfully:', data);
      return data;
    }
};