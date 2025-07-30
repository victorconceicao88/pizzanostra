import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaRegClock, FaFacebook, FaInstagram, FaTripadvisor } from 'react-icons/fa';
import pisaprojeto from '../../assets/pisaprojeto.jpg';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-6 pb-6">
      {/* Linhas da bandeira italiana */}
      <div className="h-12 mb-6 flex flex-col gap-3">
        <div className="h-[3px] bg-green-600"></div>
        <div className="h-[3px] bg-white"></div>
        <div className="h-[3px] bg-red-600"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Container principal com imagem grande sempre à direita */}
        <div className="flex flex-row flex-nowrap justify-between items-start w-full">
          {/* Informações do restaurante */}
          <div className="flex-1 text-xs sm:text-sm md:text-base max-w-[55%] pr-2 sm:pr-4 md:pr-6">
            <h3 className="text-lg md:text-xl font-bold mb-3">Pizza Nostra</h3>
            <div className="space-y-2 leading-relaxed">
              <p className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Rua das Ondas, V3, edifício Solmonte, loja 4, Praia da Rocha Portimão
                </span>
              </p>
              <p className="flex items-center text-xs sm:text-sm">
                <FaPhone className="mr-2" />
                +351 282 046 810
              </p>
              <p className="flex items-center text-xs sm:text-sm">
                <FaRegClock className="mr-2" />
                Horário de funcionamento: 19:00 – 00h
              </p>
            </div>
          </div>

          {/* Imagem da torre grande encostada no canto direito */}
          <div className="w-[45%] sm:w-[50%] max-w-[400px] flex-shrink-0 -mr-4 sm:mr-0">
            <img
              src={pisaprojeto}
              alt="Torre de Pisa"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Social Media Icons - Centered for both mobile and desktop */}
        <div className="flex justify-center mt-6 space-x-6">
          <a href="https://www.facebook.com/share/19FHaGpuaT/?mibextid=wwXIfr" className="text-white hover:text-gray-300" target='blank'>
            <FaFacebook size={24} />
          </a>
          <a href="https://www.instagram.com/pizzanostrapt?igsh=MWx2NHRrdzhiMnRwNA==" className="text-white hover:text-gray-300" target='blank'>
            <FaInstagram size={24} />
          </a>
          <a href="https://www.tripadvisor.pt/Restaurant_Review-g189120-d16726589-Reviews-Pizza_Nostra_Portimao-Portimao_Faro_District_Algarve.html?m=69573" className="text-white hover:text-gray-300" target='blank'>
            <FaTripadvisor size={24} />
          </a>
        </div>

        {/* Links legais */}
        <div className="flex justify-center mt-4 space-x-4 text-xs sm:text-sm">
          <Link to="/politica" className="text-gray-400 hover:text-white">Política do Site</Link>
          <Link to="/termos" className="text-gray-400 hover:text-white">Termos e Condições</Link>
          <a href="https://www.livroreclamacoes.pt/Utilizador/AutenticacaoConsumidor" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-400 hover:text-white">
            Livro de Reclamações
          </a>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-xs md:text-sm">
          © {new Date().getFullYear()} Pizza Nostra. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;