"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutContentProps {
  total_amount: number;
  onPaymentSuccess: (payment_method: string) => void;
  onPaymentError: (payment_method: string, error: string) => void;
}

export default function CheckoutContent({
  total_amount,
  onPaymentSuccess,
  onPaymentError,
}: CheckoutContentProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(total_amount * 100) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [total_amount]);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-4">
        <span className="text-xl font-semibold">
          Total: €{total_amount.toFixed(2)}
        </span>
      </div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm
            onPaymentSuccess={(payment_method: string) =>
              onPaymentSuccess(payment_method)
            }
            onPaymentError={(payment_method: string, error: string) =>
              onPaymentError(payment_method, error)
            }
          />
        </Elements>
      )}
    </div>
  );
}
