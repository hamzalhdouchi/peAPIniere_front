import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderPopup from './FormCommand'


const Home = () => {
  const [plantes, setPlantes] = useState([]);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Récupérer l'ID de l'utilisateur si nécessaire
          // const userResponse = await axios.get('http://127.0.0.1:8000/api/user');
          // setUserId(userResponse.data.id);
        }

        const response = await axios.get('http://127.0.0.1:8000/api/plante');
        setPlantes(response.data); 
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes:', error);
      }
    };

    fetchData();
  }, []);

  const handleOrderClick = (plante) => {
    setSelectedPlante(plante);
    setShowOrderPopup(true);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Raleway', sans-serif", backgroundColor: '#f0fdf4' }}>
      {/* Header */}
      <header className="leaf-pattern text-white py-6 bg-green-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">PéAPInière</h1>
          <p className="text-green-100">Catalogue de plantes</p>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1534710961216-75c88202f43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Collection de plantes d'intérieur"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Découvrez notre collection de plantes</h1>
            <p className="text-xl text-white mb-8">Des plantes uniques pour embellir votre intérieur</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
              Explorer la collection
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Nos plantes vedettes</h2>
          <div className="w-24 h-1 bg-green-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plantes.map((plante) => (
            <div key={plante.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={`http://127.0.0.1:8000/storage/${plante.images}`} 
                  alt={plante.nomPlante} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{plante.nomPlante}</h2>
                <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">{plante.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-600 font-bold">{plante.ptrc} €</span>
                  <button 
                    onClick={() => handleOrderClick(plante)}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Commande
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Order Popup */}
      {showOrderPopup && selectedPlante && (
        <OrderPopup 
          plante={selectedPlante} 
          onClose={() => setShowOrderPopup(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Home;