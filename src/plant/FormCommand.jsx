import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

const OrderPopup = ({ plante, onClose, userId }) => {
  const user_id = Number(sessionStorage.getItem('user'));
  const [formData, setFormData] = useState({
    user_id: user_id,
    plante_id: plante.id,
    quantity: 1,
    price: plante.ptrc * 1,  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
      price: name === 'quantity' ? parseInt(value) * plante.ptrc : prev.total_price 
    }));
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        console.log(plante.id);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log(formData);
      }

      const response = await axios.post('http://127.0.0.1:8000/api/orders', formData);
      console.log(response);

      Swal.fire({
        icon: "success",
        title: "Order created.",
        text: response.data.order.original.message,
        timer: 2000,
        showConfirmButton: false,
      });

      console.log('Commande créée:', response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Commander {plante.nomPlante}</h2>
        
        <div className="flex items-center mb-6">
          <img 
            src={`http://127.0.0.1:8000/storage/${plante.images}`} 
            alt={plante.nomPlante}
            className="w-20 h-20 object-cover rounded-md mr-4"
          />
          <div>
            <p className="font-semibold">{plante.nomPlante}</p>
            <p className="text-green-600 font-bold">{plante.ptrc} €</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Quantité</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Total Price</label>
            <p className="text-green-600 font-bold">{formData.total_price} €</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Confirmer la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderPopup;
