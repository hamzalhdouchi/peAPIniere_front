import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [stats, setStats] = useState([
    { id: 1, name: 'En attente', value: 0, icon: 'clock', color: 'green' },
    { id: 2, name: 'En préparation', value: 0, icon: 'refresh', color: 'blue' },
    { id: 3, name: 'Prêtes à livrer', value: 0, icon: 'check', color: 'green' },
    { id: 4, name: 'Total commandes', value: 0, icon: 'document', color: 'gray' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/orders');
        const allOrders = response.data;
        console.log(allOrders);
        
        
        // Filter orders by status
        const pendingOrders = allOrders.filter(order => order.status === 'pending');
        const preparationOrders = allOrders.filter(order => order.status === 'preparation');
        const readyOrders = allOrders.filter(order => order.status === 'ready');
        
        // Update stats
        setStats([
          { ...stats[0], value: pendingOrders.length },
          { ...stats[1], value: preparationOrders.length },
          { ...stats[2], value: readyOrders.length },
          { ...stats[3], value: allOrders.length }
        ]);
        
        setOrders(allOrders);
        setReadyOrders(readyOrders);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    };

    fetchData();
  }, []);

  const handlePrepareOrder = async (orderId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/orders`);
      
      console.log(response);
      
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'preparation' } : order
      );
      
      setOrders(updatedOrders);
      
      // Update stats
      const pendingOrders = updatedOrders.filter(order => order.status === 'pending');
      const preparationOrders = updatedOrders.filter(order => order.status === 'preparation');
      const readyOrders = updatedOrders.filter(order => order.status === 'ready');
      
      setStats([
        { ...stats[0], value: pendingOrders.length },
        { ...stats[1], value: preparationOrders.length },
        { ...stats[2], value: readyOrders.length },
        stats[3]
      ]);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, {
        status: newStatus
      });
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, status: newStatus} : order
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };
  
  const updateOrderAcceptance = async (orderId, newAcceptance) => {
    try {
      await axios.put(`/api/orders/${orderId}/acceptance`, {
        acciptaion: newAcceptance
      });
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, accepted: newAcceptance} : order
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'acceptation:", error);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}`, {
        status: 'delivered'
      });
      
      // Update local state
      const updatedReadyOrders = readyOrders.filter(order => order.id !== orderId);
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'delivered' } : order
      );
      
      setReadyOrders(updatedReadyOrders);
      setOrders(updatedOrders);
      
      // Update stats
      const readyOrdersCount = updatedReadyOrders.length;
      
      setStats([
        stats[0],
        stats[1],
        { ...stats[2], value: readyOrdersCount },
        stats[3]
      ]);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparation':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'preparation':
        return 'En préparation';
      case 'ready':
        return 'Prête à livrer';
      case 'delivered':
        return 'Livrée';
      default:
        return status;
    }
  };

  const getAcceptanceText = (accepted) => {
    return accepted ? (
      <span className="text-green-500 font-medium">Acceptée</span>
    ) : (
      <span className="text-red-500 font-medium">Refusée</span>
    );
  };

  const filteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        return orders.filter(order => order.status === 'pending');
      case 'preparation':
        return orders.filter(order => order.status === 'preparation');
      case 'ready':
        return orders.filter(order => order.status === 'ready');
      case 'delivered':
        return orders.filter(order => order.status === 'delivered');
      default:
        return orders;
    }
  };

  const tabs = [
    { id: 'all', name: 'Toutes les commandes' },
    { id: 'pending', name: 'En attente' },
    { id: 'preparation', name: 'En préparation' },
    { id: 'ready', name: 'Prêtes à livrer' },
    { id: 'delivered', name: 'Livrées' }
  ];

  const navItems = [
    { name: 'Tableau de bord', icon: 'home', active: true },
    { name: 'Commandes', icon: 'shopping-bag' },
    { name: 'Statistiques', icon: 'chart-bar' },
    { name: 'Produits', icon: 'plus' },
    { name: 'Clients', icon: 'users' },
    { name: 'Paramètres', icon: 'cog' }
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        );
      case 'shopping-bag':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        );
      case 'chart-bar':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        );
      case 'plus':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        );
      case 'users':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        );
      case 'cog':
        return (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </>
        );
      case 'clock':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      case 'refresh':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        );
      case 'check':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        );
      case 'document':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-green-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex flex-col w-full max-w-xs bg-white">
            <div className="flex items-center justify-center h-16 px-4 bg-green-600">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="ml-2 text-xl font-bold text-white">PéAPInière</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to="#"
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.active ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <svg
                      className={`mr-3 h-5 w-5 ${item.active ? 'text-green-500' : 'text-gray-400'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {getIcon(item.icon)}
                    </svg>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white shadow-lg">
          <div className="flex items-center justify-center h-16 px-4 bg-green-600">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">PéAPInière</span>
            </div>
          </div>
          <div className="flex flex-col flex-grow px-4 py-6 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Marie Dupont</p>
                <p className="text-xs text-gray-500">Employé</p>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to="#"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    item.active ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${item.active ? 'text-white' : 'text-gray-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {getIcon(item.icon)}
                  </svg>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
              <svg className="mr-3 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="ml-3 flex items-center">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="ml-1 text-xl font-bold text-gray-800">PéAPInière</span>
                </div>
              </div>
              <div className="flex-1 px-4 flex justify-center lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">Rechercher</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Rechercher une commande..."
                      type="search"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <span className="sr-only">Voir les notifications</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-green-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Stats cards */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 bg-${stat.color}-100 rounded-md p-3`}>
                          <svg className={`h-6 w-6 text-${stat.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {getIcon(stat.icon)}
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {stat.name}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {stat.value}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Orders table */}
              <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Commandes récentes
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plante
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantité
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acceptation
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders().map(order => (
                        <tr key={order.id}>
                        {/* ... autres colonnes ... */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* Bouton pour changer le statut */}
                            {order.status === 'pending' && (
                              <button 
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                                onClick={() => updateOrderStatus(order.id, 'in_preparation')}
                              >
                                Préparer
                              </button>
                            )}
                            {order.status === 'in_preparation' && (
                              <button 
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                              >
                                Marquer comme livré
                              </button>
                            )}

                            {/* Boutons pour l'acceptation */}
                            {order.accepted === 'refsuer' && (
                              <button 
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                                onClick={() => updateOrderAcceptance(order.id, 'accepte')}
                              >
                                Accepter
                              </button>
                            )}
                            {order.accepted === 'accepte' && (
                              <button 
                                className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                                onClick={() => updateOrderAcceptance(order.id, 'refsuer')}
                              >
                                Refuser
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Ready to deliver section */}
              {readyOrders.length > 0 && (
                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Commandes prêtes à livrer
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {readyOrders.length} commande{readyOrders.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Client
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plante
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantité
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date de préparation
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {readyOrders.map(order => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {order.customer?.name || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {order.customer?.email || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.plant?.name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">ID: {order.plant?.id || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.updated_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  onClick={() => handleMarkAsDelivered(order.id)}
                                >
                                  Marquer comme livrée
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;