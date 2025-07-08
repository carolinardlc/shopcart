import React from 'react';
import Container from '@/components/Container';
import { footerData } from '@/constants/data';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">ShopCart</h3>
            <p className="text-gray-400">
              Tu plataforma de compras inteligente con tecnología avanzada para una experiencia única.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {footerData.map((item) => (
                <li key={item.title}>
                  <a href={item.href} className="text-gray-400 hover:text-white">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Características</h4>
            <ul className="space-y-2">
              <li><a href="/lifestyle" className="text-gray-400 hover:text-white">Filtros de Estilo de Vida</a></li>
              <li><a href="/visual-scanner" className="text-gray-400 hover:text-white">Escáner Visual</a></li>
              <li><a href="/voice-navigation" className="text-gray-400 hover:text-white">Navegación por Voz</a></li>
              <li><a href="/emotions" className="text-gray-400 hover:text-white">Gestión de Emociones</a></li>
              <li><a href="/storycart" className="text-gray-400 hover:text-white">StoryCart</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-2 text-gray-400">
              <p>Email: info@shopcart.com</p>
              <p>Teléfono: +51 123 456 789</p>
              <p>Dirección: Lima, Perú</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ShopCart. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer