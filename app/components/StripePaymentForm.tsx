'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  onPaymentSuccess: (payment_method: string) => void;
  onPaymentError: (payment_method: string, error: string) => void;
}

export default function StripePaymentForm({ onPaymentSuccess, onPaymentError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    // Confirm payment and get the result
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      onPaymentError('', error.message ?? 'An unexpected error occurred.');
    } else if (paymentIntent) {
      // Get the payment method from the paymentIntent
      console.log('paymentIntent', paymentIntent);
      onPaymentSuccess(paymentIntent.payment_method as string);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isProcessing || !stripe || !elements} className="mt-4 bg-blue-500 text-white p-2 rounded">
        {isProcessing ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  );
}
