'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      // Check if Stripe is loaded
      if (stripe) {
        // Set a newStage in localStorage before redirecting
        // This will be used on page.tsx to redirect to the summary page after successful payment from Stripe
        localStorage.setItem('newStage', '4');
        
        // Redirect to Stripe checkout
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe checkout error:', error);
          // If there's an error, remove the lastStage from localStorage
          localStorage.removeItem('lastStage');
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // If there's an error, remove the lastStage from localStorage
      localStorage.removeItem('lastStage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`
        w-full py-3 px-4 
        text-white font-semibold text-lg
        rounded-md shadow-md
        transition-all duration-300 ease-in-out
        ${loading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        <>
          Proceed to Payment
          <span className="ml-2">→</span>
        </>
      )}
    </button>
  );
}
