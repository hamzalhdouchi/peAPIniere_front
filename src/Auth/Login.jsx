import { React, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


const Login = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role_id: 1
            });
            console.log('fhjfdhhjdfhvdfjh');
            
            console.log("form submitted", response);
            
    
            
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire :");
        }
    };

    const handelSubmitLogin = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await axios.post("http://localhost:8000/api/login", formData);
            console.log(response);
            const token = response.data.token;
        const user = response.data.user.id;
            sessionStorage.setItem('token',token);
            sessionStorage.setItem('user',user);
            
                Swal.fire({
                    icon: "success",
                    title: response.data.message,
                    text: "Bienvenue sur votre tableau de bord",
                    timer: 2000,
                    showConfirmButton: false,
                });
               
          } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                text: "Invalid credentials",
                timer: 2000,
                showConfirmButton: false,
              });
          }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="bg-green-50 min-h-screen flex items-center justify-center p-4 plant-bg">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-200 relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-green-500 rounded-full opacity-20"></div>
                
                <div className="leaf-pattern p-8 text-center relative overflow-hidden">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-200/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinejoin="round">
                            <path d="M12 2v8"></path>
                            <path d="M4.93 10.93a8 8 0 1 0 14.14 0"></path>
                            <path d="M12 18.93c-1.97 0-3.8-.53-5.38-1.45"></path>
                            <path d="M12 18.93c1.97 0 3.8-.53 5.38-1.45"></path>
                            <path d="M6 8.4c.89.86 2.56 1.6 6 1.6s5.11-.74 6-1.6"></path>
                            <path d="M12 10c-4.27 0-6-1.42-6-1.42"></path>
                            <path d="M12 10c4.27 0 6-1.42 6-1.42"></path>
                        </svg>
                    </div>
                    <h1 className="text-white text-3xl font-bold">PéAPInière</h1>
                    <p className="text-green-100 mt-2 text-lg">Gérez vos plantes en toute simplicité</p>
                    
                    <div className="absolute -bottom-6 -left-6 w-12 h-12 transform rotate-45">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)">
                            <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path>
                            <path d="M5 19.5C5 14.5 9.5 10 14.5 10c1.5 0 3 .5 4.5 1.5"></path>
                            <path d="M12 19c0-3.5 2.5-6 6-6 2 0 3.5.5 4 1"></path>
                        </svg>
                    </div>
                    <div className="absolute -top-6 -right-6 w-12 h-12 transform -rotate-45">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)">
                            <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path>
                            <path d="M5 19.5C5 14.5 9.5 10 14.5 10c1.5 0 3 .5 4.5 1.5"></path>
                            <path d="M12 19c0-3.5 2.5-6 6-6 2 0 3.5.5 4 1"></path>
                        </svg>
                    </div>
                </div>
                
                <div className="flex border-b border-green-100">
                    <button 
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-4 px-6 text-center font-medium focus:outline-none transition-colors duration-300 ${activeTab === 'login' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
                    >
                        Connexion
                    </button>
                    <button 
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 py-4 px-6 text-center font-medium focus:outline-none transition-colors duration-300 ${activeTab === 'signup' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
                    >
                        Inscription
                    </button>
                </div>
                
                {activeTab === 'login' && (
                    <div id="signin-content" className="p-6 relative z-10">
                        <form onSubmit={handelSubmitLogin}>
                            <div className="mb-4">
                                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="email" 
                                        id="signin-email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                        placeholder="Votre email" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                    <a href="#" className="text-xs text-green-600 hover:text-green-500">Mot de passe oublié?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        id="signin-password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                        placeholder="Votre mot de passe" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <input type="checkbox" id="remember" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
                            </div>
                            
                            <button type="submit" 
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 shadow-lg shadow-green-500/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Se connecter
                            </button>
                        </form>
                        
                        <div className="relative flex items-center mt-8">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Ou continuer avec
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                                </svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.991,3.657,9.128,8.438,9.878v-6.987h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.988C18.343,21.128,22,16.991,22,12z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>
                )}
                
                {activeTab === 'signup' && (
                    <div id="signup-content" className="p-6 relative z-10">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                        placeholder="Votre nom" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="email" 
                                        id="signup-email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                        placeholder="Votre email" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        id="signup-password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                        placeholder="Créez un mot de passe" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        id="confirm-password" 
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                        placeholder="Confirmez votre mot de passe" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-start mb-6">
                                <div className="flex items-center h-5">
                                    <input type="checkbox" id="terms" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" required />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-700">J'accepte les <a href="#" className="text-green-600 hover:text-green-500">conditions d'utilisation</a> et la <a href="#" className="text-green-600 hover:text-green-500">politique de confidentialité</a></label>
                                </div>
                            </div>
                            
                            <button type="submit" 
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 shadow-lg shadow-green-500/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                S'inscrire
                            </button>
                        </form>
                        
                        <div className="relative flex items-center mt-8">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Ou s'inscrire avec
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                                </svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.991,3.657,9.128,8.438,9.878v-6.987h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.988C18.343,21.128,22,16.991,22,12z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="px-6 py-4 bg-green-50 border-t border-green-100 text-center relative">
                    <div className="absolute left-4 -top-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                        PéAPInière &copy; {new Date().getFullYear()} - Cultivez votre jardin numérique
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;