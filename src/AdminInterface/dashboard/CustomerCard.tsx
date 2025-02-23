import React from 'react';
import Avatar from './Avatar';

interface Customer {
  _id: string;
  name: string;
  citizen_id: string;
  created_at: string;
  updated_at: string;
  bond_status?: { status?: string };
  company: string;
  email: string;
  phone: string;
  profilePicture?: string;
}

interface Props {
  customer: Customer;
  onViewDetails: (customer: Customer) => void;
}

const CustomerCard: React.FC<Props> = ({ customer, onViewDetails }) => {
  const handleViewDetails = () => {
    console.log('CustomerCard: Sending customer data:', customer);
    onViewDetails(customer);
  };

  // Add console.log to debug profilePicture
  console.log('Profile Picture URL:', customer.profilePicture);

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center mb-4">
          <Avatar 
            name={customer.name} 
            size="md" 
            profilePicture={customer.profilePicture} 
          />
          <span className="ml-4 text-gray-700 font-semibold">{customer.name}</span>
        </div>
        <div className="text-gray-600">
          <span>Company: {customer.company}</span>
          <br />
          <span>Email: {customer.email}</span>
          <br />
          <span>Phone: {customer.phone}</span>
          <br />
          <span>Bond Status: {customer.bond_status?.status || 'No status available'}</span>
        </div>
      </div>
      <button
        onClick={handleViewDetails}
        className="mt-4 bg-yellow-500 text-white py-1 px-4 rounded hover:bg-blue-700 transition-colors duration-300 mb-2"
      >
        View Details
      </button>
    </div>
  );  
};

export default CustomerCard;