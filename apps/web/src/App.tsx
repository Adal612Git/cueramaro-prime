import React, { useState, useEffect } from 'react';
import './index.css'; // Cambiado de App.css a index.css

// Mock data - después se reemplaza con API real
const productosIniciales = [
  { id: 1, nombre: "Rib Eye", precio: 450, imagen: "/placeholder-carne.jpg", descripcion: "Corte premium marmoleado" },
  { id: 2, nombre: "Arrachera", precio: 380, imagen: "/placeholder-carne.jpg", descripcion: "Perfecta para asar" },
  { id: 3, nombre: "Filete", precio: 520, imagen: "/placeholder-carne.jpg", descripcion: "Ternera de primera calidad" },
  { id: 4, nombre: "Costilla", precio: 320, imagen: "/placeholder-carne.jpg", descripcion: "Corte con hueso" },
];

function App() {
  const [productos] = useState(productosIniciales);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setCargando(false), 1000);
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => [...prev, { ...producto, id: Date.now() }]);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + item.precio, 0);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando Cuerámaro Prime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-700">🥩 Cuerámaro Prime</h1>
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">v1.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                  {carrito.length} items
                </span>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Cortes Premium de Calidad</h2>
          <p className="text-xl opacity-90 mb-8">La mejor carne directamente a tu mesa</p>
          <button className="bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Ver Catálogo Completo
          </button>
        </div>
      </section>

      {/* Catálogo de Productos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Nuestros Cortes Destacados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map(producto => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-red-200 flex items-center justify-center">
                <span className="text-red-600 font-semibold">🖼️ Imagen de {producto.nombre}</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg text-gray-900">{producto.nombre}</h4>
                <p className="text-gray-600 text-sm mt-1">{producto.descripcion}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-bold text-red-700">${producto.precio}/kg</span>
                  <button 
                    onClick={() => agregarAlCarrito(producto)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Carrito Lateral */}
      {carrito.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-6 max-w-sm border">
          <h4 className="font-bold text-lg mb-4">🛒 Tu Carrito</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {carrito.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-sm text-gray-600">${item.precio}</p>
                </div>
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${totalCarrito}</span>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 transition">
              Finalizar Compra
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Cuerámaro Prime - Sistema de Gestión Carniceria</p>
          <p className="text-gray-400 text-sm mt-2">Desarrollado con ❤️ para tu negocio</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
