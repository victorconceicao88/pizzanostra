import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaUserEdit, FaDatabase, FaChevronLeft ,FaCheckCircle } from 'react-icons/fa';
import { GiPadlock } from 'react-icons/gi';

const Politica = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GiPadlock className="text-3xl" />
              <h1 className="text-2xl sm:text-3xl font-bold">Política de Privacidade</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <FaChevronLeft />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          </div>
          <p className="mt-2 opacity-90">Última atualização: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="prose prose-blue max-w-none">
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaShieldAlt className="mr-2 text-blue-600" />
                Introdução
              </h2>
              <p className="text-gray-600 mb-4">
                Na Pizza Nostra, levamos a sua privacidade a sério. Esta política explica como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nosso programa de fidelidade.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaDatabase className="mr-2 text-blue-600" />
                Dados que Coletamos
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Informações de conta:</strong> Nome, e-mail, telefone e data de nascimento</li>
                  <li><strong>Dados de transações:</strong> Histórico de pedidos e valor gasto</li>
                  <li><strong>Dados de fidelidade:</strong> Selos acumulados e prêmios resgatados</li>
                  <li><strong>Dados técnicos:</strong> Endereço IP, tipo de dispositivo e dados de cookies</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaLock className="mr-2 text-blue-600" />
                Como Usamos Seus Dados
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-blue-700 mb-2">Finalidades Principais</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                   <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      Gerenciar sua conta e programa de fidelidade
                    </li>
                    <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      Processar pedidos e resgates
                    </li>
                    <li className="flex items-start">
                     <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      Enviar comunicações relevantes
                    </li>
                  </ul>
                </div>
                <div className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-blue-700 mb-2">Finalidades Secundárias</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      Melhorar nossos serviços
                    </li>
                    <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      Prevenir fraudes e abusos
                    </li>
                    <li className="flex items-start">
                   <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      Análises estatísticas
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUserEdit className="mr-2 text-blue-600" />
                Seus Direitos
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Acesso e Correção</h3>
                    <p className="text-gray-600">Você pode acessar e atualizar seus dados a qualquer momento através da sua conta.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Exclusão</h3>
                    <p className="text-gray-600">Pode solicitar a exclusão de seus dados, sujeito a restrições legais.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Portabilidade</h3>
                    <p className="text-gray-600">Tem direito a receber seus dados em formato estruturado.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Oposição</h3>
                    <p className="text-gray-600">Pode opor-se ao tratamento para fins de marketing direto.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Alterações à Política</h2>
              <p className="text-gray-600">
                Reservamo-nos o direito de atualizar esta política periodicamente. Alterações significativas serão comunicadas através dos nossos canais oficiais.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-2 sm:mb-0">
              © {new Date().getFullYear()} Pizza Nostra. Todos os direitos reservados.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
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

export default Politica;