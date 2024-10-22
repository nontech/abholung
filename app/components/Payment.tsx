import Image from 'next/image';

interface PaymentProps {
    handlePaymentDone: (paymentDone: boolean) => void;
}

export default function PaymentPage({handlePaymentDone}: PaymentProps){

    const paypal_logo = '/images/paypal_logo.png';
    const mukesh_paypal = '/images/mukesh_paypal.png';

    return (
        <div className="mt-16">
          <div className='flex justify-center mb-10'>
            <Image
              src={mukesh_paypal}
              alt="Mukesh Paypal link"
              className="h-80 w-80"
              width={120}  
              height={120} 
            />
          </div>
          <div className='flex justify-center mb-10'>
            <Image
              src={paypal_logo}
              alt="Paypal Logo"
              width={120}  
              height={120} 
            />
          </div>
          <div className='flex justify-center mb-10'>
            <button onClick={() => handlePaymentDone(true)} className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-48">
                I paid via PayPal
            </button>
          </div>
          
        </div>
    )
}