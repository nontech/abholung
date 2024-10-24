import React from 'react';
import CheckoutButton from './CheckoutButton';

interface PaymentProps {
    total_amount: number;
}


export default function PaymentPage({total_amount}: PaymentProps){
    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
            
            <div className="text-center mb-8">
                <span className="text-4xl font-bold text-gray-800">€ {total_amount.toFixed(2)}</span>
            </div>
            
            <div className="space-y-4 mb-8">
                <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">Secure payment powered by Stripe</p>
                </div>
                <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-gray-600">Multiple payment options available</p>
                </div>
                <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">You'll return to the app after payment</p>
                </div>
            </div>
            
            <CheckoutButton amount={total_amount} />
            
            <p className="text-sm text-gray-500 mt-4 text-center">
                By proceeding, you'll be redirected to Stripe's secure checkout page
            </p>
        </div>
    )
}
