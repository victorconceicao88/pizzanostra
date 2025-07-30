import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBalanceScale,
  FaGavel,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaChevronLeft,
  FaTimes,
} from 'react-icons/fa';
import { GiScrollQuill } from 'react-icons/gi';

const Termos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-red-600 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GiScrollQuill className="text-3xl" />
              <h1 className="text-2xl sm:text-3xl font-bold">Termos de Utilização</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <FaChevronLeft />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          </div>
          <p className="mt-2 opacity-90">Versão em vigor desde: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="prose prose-green max-w-none">
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaBalanceScale className="mr-2 text-green-600" />
                Aceitação dos Termos
              </h2>
              <p className="text-gray-600 mb-4">
                Ao aceder e utilizar o programa de fidelização Pizza Nostra, o utilizador declara aceitar e cumprir os presentes Termos de Utilização e a nossa Política de Privacidade.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaGavel className="mr-2 text-green-600" />
                Regras do Programa
              </h2>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>O programa é pessoal e intransmissível</li>
                  <li>Selos são atribuídos apenas a pedidos concluídos e pagos</li>
                  <li>1 selo por cada 15 € gastos (arredondado por defeito)</li>
                  <li>Prémios devem ser resgatados no momento da compra</li>
                  <li>Não acumulável com outras campanhas ou promoções</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2 text-red-600" />
                Condutas Proibidas
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-red-100 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-red-700 mb-2">Fraude</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <FaTimes className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      Criação de múltiplas contas
                    </li>
                    <li className="flex items-start">
                      <FaTimes className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      Manipulação de selos ou transacções
                    </li>
                    <li className="flex items-start">
                      <FaTimes className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      Utilização de contas de terceiros
                    </li>
                  </ul>
                </div>
                <div className="bg-white border border-red-100 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-red-700 mb-2">Abuso</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <FaTimes className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      Comportamento desrespeitoso com colaboradores
                    </li>
                    <li className="flex items-start">
                      <FaTimes className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      Tentativas de manipular o sistema
                    </li>
                    <li className="flex items-start">
                      <FaTimes className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      Uso comercial não autorizado do programa
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaClipboardCheck className="mr-2 text-green-600" />
                Disposições Gerais
              </h2>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-red-700 mb-1">Alterações</h3>
                    <p className="text-gray-600">
                      A Pizza Nostra poderá modificar estes Termos a qualquer momento, mediante aviso prévio de 30 dias por meios adequados.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-red-700 mb-1">Rescisão</h3>
                    <p className="text-gray-600">
                      Reservamo-nos o direito de suspender ou eliminar contas que violem estes Termos sem aviso prévio.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-red-700 mb-1">Jurisdição</h3>
                    <p className="text-gray-600">
                      Estes Termos são regidos pela legislação portuguesa. Qualquer litígio será resolvido nos tribunais portugueses.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Contacto</h2>
              <p className="text-gray-600">
                Em caso de dúvidas ou questões relacionadas com estes Termos, contacte-nos através do e-mail: <span className="font-medium">marcioferreira169@gmail.com</span>
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 sm:px-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-2 sm:mb-0">
              © {new Date().getFullYear()} Pizza Nostra. Todos os direitos reservados.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-green-600 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              <FaChevronLeft className="mr-2" />
              Voltar ao Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Termos;
