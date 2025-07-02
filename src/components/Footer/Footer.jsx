import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaRegClock } from 'react-icons/fa';
import pisaprojeto from '../../assets/pisaprojeto.jpg';

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
        {/* Container principal: texto à esquerda, imagem à direita em TODAS as telas */}
        <div className="flex flex-row justify-between items-start w-full">
          {/* Informações do restaurante (alinhadas à esquerda) */}
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold mb-4">Pizza Nostra</h3>
            <div className="space-y-2">
              <p className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                <span>Rua das Ondas, V3, edificio Solmonte, loja 4, Praia da Rocha Portimão</span>
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2" />
                +351 282 046 810
              </p>
              <p className="flex items-center">
                <FaRegClock className="mr-2" />
                Horário de funcionamento: 19:00 – 00h
              </p>
            </div>
          </div>

          {/* Imagem da torre (alinhada à direita) */}
          <div className="flex-shrink-0 w-[40%] max-w-xs">
            <img
              src={pisaprojeto}
              alt="Torre de Pisa"
              className="w-full h-auto max-h-60 object-contain rounded-lg ml-6 "
            />
          </div>
        </div>

        {/* Rodapé (centralizado e abaixo do conteúdo) */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Pizza Nostra. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;