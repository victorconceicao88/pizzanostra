// Áreas de entrega melhoradas
export const deliveryAreas = {
  "Zona 1": {
    bairros: {
      pt: ["Portimão (Freguesia)", "Praia da Rocha", "Alto do Quintão", "Vale de França", "Fojo", "Bemposta", "Quinta do Amparo", "Chão das Donas", "Encosta da Marina", "Cabeço do Mocho"],
      en: ["Portimão (Parish)", "Praia da Rocha", "Alto do Quintão", "Vale de França", "Fojo", "Bemposta", "Quinta do Amparo", "Chão das Donas", "Encosta da Marina", "Cabeço do Mocho"],
      es: ["Portimão (Parroquia)", "Praia da Rocha", "Alto do Quintão", "Vale de França", "Fojo", "Bemposta", "Quinta do Amparo", "Chão das Donas", "Encosta da Marina", "Cabeço do Mocho"]
    },
    ceps: ["8500", "8501"], // Prefixos de CEP para Zona 1
    taxa: 2.00,
    color: "bg-blue-100",
    borderColor: "border-blue-300",
    textColor: "text-blue-800"
  },
  "Zona 2": {
    bairros: {
      pt: ["Ma Partilha", "Alvor", "Ladeira do Vau", "Palheiros", "Parchal"],
      en: ["Ma Partilha", "Alvor", "Ladeira do Vau", "Palheiros", "Parchal"],
      es: ["Ma Partilha", "Alvor", "Ladeira do Vau", "Palheiros", "Parchal"]
    },
    ceps: ["8502", "8503"], // Prefixos de CEP para Zona 2
    taxa: 2.00,
    color: "bg-green-100",
    borderColor: "border-green-300",
    textColor: "text-green-800"
  },
  "Zona 3": {
    bairros: {
      pt: ["Penina (Igreja)", "Ferragudo", "Mexilhoeira da Carregação", "Bela Vista", "Montes de Alvor", "Estômbar"],
      en: ["Penina (Church)", "Ferragudo", "Mexilhoeira da Carregação", "Bela Vista", "Montes de Alvor", "Estômbar"],
      es: ["Penina (Iglesia)", "Ferragudo", "Mexilhoeira da Carregação", "Bela Vista", "Montes de Alvor", "Estômbar"]
    },
    ceps: ["8504", "8505"], // Prefixos de CEP para Zona 3
    taxa: 3.00,
    color: "bg-amber-100",
    borderColor: "border-amber-300",
    textColor: "text-amber-800"
  }
};

// Mapeamento de CEPs para bairros (Portimão, Portugal)
const cepToBairro = {
  '8500': 'Portimão (Freguesia)',
  '8501': 'Praia da Rocha',
  '8502': 'Alvor',
  '8503': 'Ferragudo',
  '8504': 'Mexilhoeira da Carregação',
  '8505': 'Parchal',
  '8506': 'Ma Partilha',
  '8507': 'Ladeira do Vau',
  '8508': 'Palheiros',
  '8509': 'Penina (Igreja)',
  '8510': 'Bela Vista',
  '8511': 'Montes de Alvor',
  '8512': 'Estômbar',
  '8513': 'Alto do Quintão',
  '8514': 'Vale de França',
  '8515': 'Fojo',
  '8516': 'Bemposta',
  '8517': 'Quinta do Amparo',
  '8518': 'Chão das Donas',
  '8519': 'Encosta da Marina',
  '8520': 'Cabeço do Mocho'
};

// Dados do menu completo com traduções
export const menuData = {
  entradas: [
    {
      id: 'azeitonas',
      name: {
        pt: 'Azeitonas',
        en: 'Olives',
        es: 'Aceitunas'
      },
      price: 2.00,
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'pao-alho-simples',
      name: {
        pt: 'Pão de Alho Simples',
        en: 'Simple Garlic Bread',
        es: 'Pan de Ajo Simple'
      },
        category: "entradas",
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1608190003443-86ab7a5c6bce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'pao-alho-queijo',
      name: {
        pt: 'Pão de Alho com Queijo',
        en: 'Garlic Bread with Cheese',
        es: 'Pan de Ajo con Queso'
      },
      category: "entradas",
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'pao-alho-queijo-bacon',
      name: {
        pt: 'Pão de Alho com Queijo e Bacon',
        en: 'Garlic Bread with Cheese and Bacon',
        es: 'Pan de Ajo con Queso y Bacon'
      },
      category: "entradas",
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1601050690773-19a5b1b9a9ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ],
  
  petiscos: [
    {
      id: 'filezinho-acebolado',
      name: {
        pt: 'Filézinho Acebolado',
        en: 'Small Steak with Onions',
        es: 'Filete con Cebolla'
      },
      price: 10.00,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'batatas-fritas',
      name: {
        pt: 'Batatas Fritas',
        en: 'French Fries',
        es: 'Patatas Fritas'
      },
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'batata-gourmet',
      name: {
        pt: 'Batata Gourmet com Cheddar e Bacon',
        en: 'Gourmet Potatoes with Cheddar and Bacon',
        es: 'Patatas Gourmet con Cheddar y Bacon'
      },
      price: 8.00,
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'calabresa-acebolada',
      name: {
        pt: 'Calabresa Acebolada',
        en: 'Calabresa Sausage with Onions',
        es: 'Calabresa con Cebolla'
      },
      price: 10.00,
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    },
    {
      id: 'moelas',
      name: {
        pt: 'Moelas ao Molho com Fatias de Pão (Sexta-feira)',
        en: 'Gizzards in Sauce with Bread Slices (Friday)',
        es: 'Mollejas en Salsa con Rebanadas de Pan (Viernes)'
      },
      price: 10.00,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      available: [5] // Disponível apenas na sexta-feira (0=Domingo, 1=Segunda,..., 6=Sábado)
    }
  ],
  
  tradicionais: [
    {
       id: "margherita",
       name: { pt: "Margherita", en: "Margherita", es: "Margherita" },
       category: "tradicionais",
       sizes: { individual: 9.90, media: 12.90, familia: 15.90 },
      description: {
        pt: 'Molho de tomate, mussarela e manjericão fresco',
        en: 'Tomato sauce, mozzarella and fresh basil',
        es: 'Salsa de tomate, mozzarella y albahaca fresca'
      },
      
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      popular: true,
      rating: 4.8,
      ratingCount: 124
    },
    {
      id: 'calabria',
      name: {
        pt: 'Calábria',
        en: 'Calabria',
        es: 'Calabria'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, calabresa e cebola',
        en: 'Tomato sauce, mozzarella, calabresa sausage and onion',
        es: 'Salsa de tomate, mozzarella, calabresa y cebolla'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      popular: true,
      rating: 4.7,
      ratingCount: 98
    },
    {
      id: 'turim',
      name: {
        pt: 'Turim',
        en: 'Turin',
        es: 'Turín'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, presunto e champignon',
        en: 'Tomato sauce, mozzarella, ham and mushrooms',
        es: 'Salsa de tomate, mozzarella, jamón y champiñones'
      },
      sizes: { individual: 10.90, media: 15.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'milao',
      name: {
        pt: 'Milão',
        en: 'Milan',
        es: 'Milán'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, presunto, ovos e azeitonas',
        en: 'Tomato sauce, mozzarella, ham, eggs and olives',
        es: 'Salsa de tomate, mozzarella, jamón, huevos y aceitunas'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1542282811-943ef1a977c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
    },
    {
      id: 'atum',
      name: {
        pt: 'Atum',
        en: 'Tuna',
        es: 'Atún'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, atum e cebola',
        en: 'Tomato sauce, mozzarella, tuna and onion',
        es: 'Salsa de tomate, mozzarella, atún y cebolla'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80'
    },
    {
      id: 'hawai',
      name: {
        pt: 'Hawai',
        en: 'Hawaiian',
        es: 'Hawaiana'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, presunto e abacaxi',
        en: 'Tomato sauce, mozzarella, ham and pineapple',
        es: 'Salsa de tomate, mozzarella, jamón y piña'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80'
    },
    {
      id: 'bolonhesa',
      name: {
        pt: 'Bolonhesa',
        en: 'Bolognese',
        es: 'Boloñesa'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela e carne moída',
        en: 'Tomato sauce, mozzarella and ground beef',
        es: 'Salsa de tomate, mozzarella y carne molida'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'alentejana',
      name: {
        pt: 'Alentejana',
        en: 'Alentejo Style',
        es: 'Estilo Alentejo'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, linguiça alentejana e pimentão',
        en: 'Tomato sauce, mozzarella, Alentejo sausage and bell pepper',
        es: 'Salsa de tomate, mozzarella, linguiça alentejana y pimiento'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'americana',
      name: {
        pt: 'Americana',
        en: 'American',
        es: 'Americana'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, bacon, ovos e batata palha',
        en: 'Tomato sauce, mozzarella, bacon, eggs and potato sticks',
        es: 'Salsa de tomate, mozzarella, bacon, huevos y papas fritas'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1922&q=80'
    },
    
    {
      id: 'sorrento',
      name: {
        pt: 'Sorrento',
        en: 'Sorrento',
        es: 'Sorrento'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, bacon, champignon e catupiry',
        en: 'Tomato sauce, mozzarella, bacon, mushrooms and catupiry',
        es: 'Salsa de tomate, mozzarella, bacon, champiñones y catupiry'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'pepperoni',
      name: {
        pt: 'Pepperoni',
        en: 'Pepperoni',
        es: 'Pepperoni'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela e pepperoni',
        en: 'Tomato sauce, mozzarella and pepperoni',
        es: 'Salsa de tomate, mozzarella y pepperoni'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      popular: true
    },
    {
      id: 'frango-catupiry',
      name: {
        pt: 'Frango com Catupiry',
        en: 'Chicken with Catupiry',
        es: 'Pollo con Catupiry'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, frango desfiado e catupiry',
        en: 'Tomato sauce, mozzarella, shredded chicken and catupiry',
        es: 'Salsa de tomate, mozzarella, pollo desmenuzado y catupiry'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80',
      popular: true
    },
    {
      id: 'calabresa-catupiry',
      name: {
        pt: 'Calabresa com Catupiry',
        en: 'Calabresa with Catupiry',
        es: 'Calabresa con Catupiry'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, calabresa e catupiry',
        en: 'Tomato sauce, mozzarella, calabresa sausage and catupiry',
        es: 'Salsa de tomate, mozzarella, calabresa y catupiry'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    },
    {
      id: 'brocolos-bacon-catupiry',
      name: {
        pt: 'Brócolos com Bacon e Catupiry',
        en: 'Broccoli with Bacon and Catupiry',
        es: 'Brócoli con Bacon y Catupiry'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, brócolos, bacon e catupiry',
        en: 'Tomato sauce, mozzarella, broccoli, bacon and catupiry',
        es: 'Salsa de tomate, mozzarella, brócoli, bacon y catupiry'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80'
    },
    {
      id: 'capricciosa',
      name: {
        pt: 'Capricciosa',
        en: 'Capricciosa',
        es: 'Caprichosa'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, presunto, champignon, azeitonas e ovos',
        en: 'Tomato sauce, mozzarella, ham, mushrooms, olives and eggs',
        es: 'Salsa de tomate, mozzarella, jamón, champiñones, aceitunas y huevos'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1542282811-943ef1a977c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
    },
    {
      id: 'brasileira',
      name: {
        pt: 'Brasileira',
        en: 'Brazilian',
        es: 'Brasileña'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, frango, milho, ervilha e catupiry',
        en: 'Tomato sauce, mozzarella, chicken, corn, peas and catupiry',
        es: 'Salsa de tomate, mozzarella, pollo, maíz, guisantes y catupiry'
      },
      sizes: { individual: 13.90, media: 18.90, familia: 24.90 },
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80'
    },
    {
      id: 'nostra',
      name: {
        pt: 'Nostra',
        en: 'Nostra',
        es: 'Nostra'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, bacon, calabresa, ovos e cebola',
        en: 'Tomato sauce, mozzarella, bacon, calabresa sausage, eggs and onion',
        es: 'Salsa de tomate, mozzarella, bacon, calabresa, huevos y cebolla'
      },
      sizes: { individual: 13.90, media: 18.90, familia: 24.90 },
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80'
    },
    {
      id: 'quatro-queijos',
      name: {
        pt: 'Quatro Queijos',
        en: 'Four Cheeses',
        es: 'Cuatro Quesos'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, provolone, parmesão e gorgonzola',
        en: 'Tomato sauce, mozzarella, provolone, parmesan and gorgonzola',
        es: 'Salsa de tomate, mozzarella, provolone, parmesano y gorgonzola'
      },
      sizes: { individual: 13.90, media: 18.90, familia: 24.90 },
      image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      popular: true
    },
    {
      id: 'do-chefe',
      name: {
        pt: 'Do Chefe',
        en: "Chef's Special",
        es: 'Especial del Chef'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, presunto, champignon, bacon, calabresa e ovos',
        en: 'Tomato sauce, mozzarella, ham, mushrooms, bacon, calabresa sausage and eggs',
        es: 'Salsa de tomate, mozzarella, jamón, champiñones, bacon, calabresa y huevos'
      },
      sizes: { individual: 13.90, media: 18.90, familia: 24.90 },
      image: 'https://images.unsplash.com/photo-1542282811-943ef1a977c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
    },
    {
      id: 'carioca',
      name: {
        pt: 'Carioca',
        en: 'Carioca',
        es: 'Carioca'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, frango, milho, batata palha e catupiry',
        en: 'Tomato sauce, mozzarella, chicken, corn, potato sticks and catupiry',
        es: 'Salsa de tomate, mozzarella, pollo, maíz, papas fritas y catupiry'
      },
      sizes: { individual: 13.90, media: 18.90, familia: 24.90 },
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80'
    },
    {
      id: 'carbonara',
      name: {
        pt: 'Carbonara',
        en: 'Carbonara',
        es: 'Carbonara'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho branco, mussarela, bacon, ovos e parmesão',
        en: 'White sauce, mozzarella, bacon, eggs and parmesan',
        es: 'Salsa blanca, mozzarella, bacon, huevos y parmesano'
      },
      
      sizes: { individual: 11.90, media: 16.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1611273426858-450d0e9a0f36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    },
    {
      id: 'camarao-catupiry',
      name: {
        pt: 'Camarão com Catupiry',
        en: 'Shrimp with Catupiry',
        es: 'Camarones con Catupiry'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, camarão e catupiry',
        en: 'Tomato sauce, mozzarella, shrimp and catupiry',
        es: 'Salsa de tomate, mozzarella, camarones y catupiry'
      },
      sizes: { individual: 14.90, media: 19.90, familia: 25.90 },
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80'
    },
    {
      id: 'mediterranica',
      name: {
        pt: 'Mediterrânica',
        en: 'Mediterranean',
        es: 'Mediterránea'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, atum, cebola, azeitonas e pimentão',
        en: 'Tomato sauce, mozzarella, tuna, onion, olives and bell pepper',
        es: 'Salsa de tomate, mozzarella, atún, cebolla, aceitunas y pimiento'
      },
      sizes: { individual: 14.90, media: 19.90, familia: 25.90 },
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80'
    },
    {
      id: 'lombo-acebolado',
      name: {
        pt: 'Lombo Fumado Acebolado',
        en: 'Smoked Pork Loin with Onions',
        es: 'Lomo Ahumado con Cebolla'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, lombo fumado e cebola',
        en: 'Tomato sauce, mozzarella, smoked pork loin and onion',
        es: 'Salsa de tomate, mozzarella, lomo ahumado y cebolla'
      },
      sizes: { individual: 12.90, media: 17.90, familia: 23.90 },
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'lombo-catupiry',
      name: {
        pt: 'Lombo Fumado com Catupiry',
        en: 'Smoked Pork Loin with Catupiry',
        es: 'Lomo Ahumado con Catupiry'
      },
      category: "tradicionais",
      description: {
        pt: 'Molho de tomate, mussarela, lombo fumado e catupiry',
        en: 'Tomato sauce, mozzarella, smoked pork loin and catupiry',
        es: 'Salsa de tomate, mozzarella, lomo ahumado y catupiry'
      },
      sizes: { individual: 13.90, media: 18.90, familia: 24.90 },
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ],
  
  vegetarianas: [
    {
      id: 'cogumelos',
      name: {
        pt: 'Cogumelos',
        en: 'Mushrooms',
        es: 'Champiñones'
      },
      category: "vegetarianas",
      description: {
        pt: 'Molho de tomate, mussarela e cogumelos frescos',
        en: 'Tomato sauce, mozzarella and fresh mushrooms',
        es: 'Salsa de tomate, mozzarella y champiñones frescos'
      },
      sizes: { individual: 10.90, media: 15.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'brocolos-tomate-seco',
      name: {
        pt: 'Brócolos com Tomate Seco',
        en: 'Broccoli with Sun-Dried Tomatoes',
        es: 'Brócoli con Tomates Secos'
      },
      category: "vegetarianas",
      description: {
        pt: 'Molho de tomate, mussarela, brócolos e tomate seco',
        en: 'Tomato sauce, mozzarella, broccoli and sun-dried tomatoes',
        es: 'Salsa de tomate, mozzarella, brócoli y tomates secos'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 22.90 },
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80'
    },
    {
      id: 'vegetariana',
      name: {
        pt: 'Vegetariana',
        en: 'Vegetarian',
        es: 'Vegetariana'
      },
      category: "vegetarianas",
      description: {
        pt: 'Molho de tomate, mussarela, berinjela, abobrinha, pimentão e champignon',
        en: 'Tomato sauce, mozzarella, eggplant, zucchini, bell pepper and mushrooms',
        es: 'Salsa de tomate, mozzarella, berenjena, calabacín, pimiento y champiñones'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 22.90 },
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80'
    }
  ],
  
  hamburgueres: [
    {
      id: 'hamburger',
      name: {
        pt: 'Hamburger',
        en: 'Hamburger',
        es: 'Hamburguesa'
      },
      category: "hamburgueres",
      description: {
        pt: 'Pão Brioche, Carne 100% Vaca 120g, Alface, Tomate, Cebola, Pepino Pickles e Molho Especial',
        en: 'Brioche bread, 100% Beef 120g, Lettuce, Tomato, Onion, Pickles Cucumber and Special Sauce',
        es: 'Pan Brioche, Carne 100% Vaca 120g, Lechuga, Tomate, Cebolla, Pepinillos y Salsa Especial'
      },
      prices: {
        sandwich: 5.50,
        menu: 8.50
      },
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
      popular: true,
      rating: 4.9,
      ratingCount: 87
    },
    {
      id: 'cheese-burger',
      name: {
        pt: 'Cheese Burger',
        en: 'Cheese Burger',
        es: 'Hamburguesa con Queso'
      },
      category: "hamburgueres",
      description: {
        pt: 'Pão Brioche, Carne 100% Vaca 120g, Queijo, Alface, Tomate, Cebola, Pepino Pickles e Molho Especial',
        en: 'Brioche bread, 100% Beef 120g, Cheese, Lettuce, Tomato, Onion, Pickles Cucumber and Special Sauce',
        es: 'Pan Brioche, Carne 100% Vaca 120g, Queso, Lechuga, Tomate, Cebolla, Pepinillos y Salsa Especial'
      },
      prices: {
        sandwich: 6.50,
        menu: 9.50
      },
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
      popular: true
    },
    {
      id: 'cheese-bacon',
      name: {
        pt: 'Cheese Bacon',
        en: 'Cheese Bacon',
        es: 'Hamburguesa con Queso y Bacon'
      },
      category: "hamburgueres",
      description: {
        pt: 'Pão Brioche, Carne 100% Vaca 120g, Queijo, Bacon, Alface, Tomate, Cebola, Pepino Pickles e Molho Especial',
        en: 'Brioche bread, 100% Beef 120g, Cheese, Bacon, Lettuce, Tomato, Onion, Pickles Cucumber and Special Sauce',
        es: 'Pan Brioche, Carne 100% Vaca 120g, Queso, Bacon, Lechuga, Tomate, Cebolla, Pepinillos y Salsa Especial'
      },
      prices: {
        sandwich: 7.50,
        menu: 10.50
      },
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80'
    },
    {
      id: 'egg-cheese-bacon',
      name: {
        pt: 'Egg Cheese Bacon',
        en: 'Egg Cheese Bacon',
        es: 'Hamburguesa con Huevo, Queso y Bacon'
      },
      category: "hamburgueres",
      description: {
        pt: 'Pão Brioche, Carne 100% Vaca 120g, Queijo, Ovo, Bacon, Alface, Tomate, Cebola, Pepino Pickles e Molho Especial',
        en: 'Brioche bread, 100% Beef 120g, Cheese, Egg, Bacon, Lettuce, Tomato, Onion, Pickles Cucumber and Special Sauce',
        es: 'Pan Brioche, Carne 100% Vaca 120g, Queso, Huevo, Bacon, Lechuga, Tomate, Cebolla, Pepinillos y Salsa Especial'
      },
      prices: {
        sandwich: 8.50,
        menu: 11.50
      },
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80'
    },
    {
      id: 'x-tudo',
      name: {
        pt: 'X-Tudo',
        en: 'X-Everything',
        es: 'Hamburguesa Completa'
      },
      category: "hamburgueres",
      description: {
        pt: 'Pão Brioche, Carne 100% Vaca 120g, Queijo, Ovo, Bacon, Fiambre, Calabresa, Alface, Tomate, Cebola, Pepino Pickles e Molho Especial',
        en: 'Brioche bread, 100% Beef 120g, Cheese, Egg, Bacon, Ham, Sausage, Lettuce, Tomato, Onion, Pickles Cucumber and Special Sauce',
        es: 'Pan Brioche, Carne 100% Vaca 120g, Queso, Huevo, Bacon, Jamón, Salchicha, Lechuga, Tomate, Cebolla, Pepinillos y Salsa Especial'
      },
      prices: {
        sandwich: 10.50,
        menu: 13.50
      },
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
      popular: true
    },
    {
      id: 'big-nostra',
      name: {
        pt: 'Big Nostra',
        en: 'Big Nostra',
        es: 'Gran Nostra'
      },
      category: "hamburgueres",
      description: {
        pt: 'Pão Brioche, 2 Carnes 100% Vaca 120g cada, 2 Queijo, Ovo, Bacon, Fiambre, Alface, Tomate, Cebola, Pepino Pickles e Molho Especial',
        en: 'Brioche bread, 2 Meats 100% Beef 120g each, 2 Cheese, Egg, Bacon, Ham, Lettuce, Tomato, Onion, Pickles Cucumber and Special Sauce',
        es: 'Pan Brioche, 2 Carnes 100% Vaca 120g cada, 2 Queso, Huevo, Bacon, Jamón, Lechuga, Tomate, Cebolla, Pepinillos y Salsa Especial'
      },
      prices: {
        sandwich: 13.00,
        menu: 16.00
      },
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80'
    }
  ],
  
  doces: [
    {
      id: 'banana-canela',
      name: {
        pt: 'Banana com Canela',
        en: 'Banana with Cinnamon',
        es: 'Plátano con Canela'
      },
      description: {
        pt: 'Massa doce, banana, canela e açúcar',
        en: 'Sweet dough, banana, cinnamon and sugar',
        es: 'Masa dulce, plátano, canela y azúcar'
      },
      sizes: { individual: 10.90, media: 15.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'bananute',
      name: {
        pt: 'Bananute',
        en: 'Bananute',
        es: 'Bananute'
      },
      description: {
        pt: 'Massa doce, banana, chocolate e amendoim',
        en: 'Sweet dough, banana, chocolate and peanuts',
        es: 'Masa dulce, plátano, chocolate y maní'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 22.90 },
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'romeu-julieta',
      name: {
        pt: 'Romeu e Julieta',
        en: 'Romeo and Juliet',
        es: 'Romeo y Julieta'
      },
      description: {
        pt: 'Massa doce, queijo branco e goiabada',
        en: 'Sweet dough, white cheese and guava paste',
        es: 'Masa dulce, queso blanco y pasta de guayaba'
      },
      sizes: { individual: 10.90, media: 15.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'nutella',
      name: {
        pt: 'Nutella',
        en: 'Nutella',
        es: 'Nutella'
      },
      description: {
        pt: 'Massa doce, nutella e morangos frescos',
        en: 'Sweet dough, nutella and fresh strawberries',
        es: 'Masa dulce, nutella y fresas frescas'
      },
      sizes: { individual: 10.90, media: 15.90, familia: 20.90 },
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'banoffe',
      name: {
        pt: 'Banoffe',
        en: 'Banoffee',
        es: 'Banoffee'
      },
      description: {
        pt: 'Massa doce, banana, doce de leite e chantilly',
        en: 'Sweet dough, banana, dulce de leche and whipped cream',
        es: 'Masa dulce, plátano, dulce de leche y crema batida'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 22.90 },
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'rafaello',
      name: {
        pt: 'Rafaello',
        en: 'Rafaello',
        es: 'Rafaello'
      },
      description: {
        pt: 'Massa doce, creme de coco, amêndoas e chocolate branco',
        en: 'Sweet dough, coconut cream, almonds and white chocolate',
        es: 'Masa dulce, crema de coco, almendras y chocolate blanco'
      },
      sizes: { individual: 11.90, media: 16.90, familia: 22.90 },
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ],
  
  bordas: [
    {
      id: 'borda-catupiry',
      name: {
        pt: 'Borda Recheada - Catupiry',
        en: 'Stuffed Crust - Catupiry',
        es: 'Borde Relleno - Catupiry'
      },
      sizes: { individual: 4.00, media: 4.50, familia: 5.50 },
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80'
    },
    {
      id: 'borda-nutella',
      name: {
        pt: 'Borda Recheada - Nutella',
        en: 'Stuffed Crust - Nutella',
        es: 'Borde Relleno - Nutella'
      },
      sizes: { individual: 5.00, media: 5.50, familia: 6.50 },
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ],
  
  massas: [
    {
      id: 'spaghetti-bolonhesa',
      name: {
        pt: 'Spaghetti à Bolonhesa',
        en: 'Spaghetti Bolognese',
        es: 'Espagueti a la Boloñesa'
      },
      price: 9.90,
      image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'spaghetti-carbonara',
      name: {
        pt: 'Spaghetti à Carbonara',
        en: 'Spaghetti Carbonara',
        es: 'Espagueti a la Carbonara'
      },
      price: 9.90,
      image: 'https://images.unsplash.com/photo-1611273426858-450d0e9a0f36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    },
    {
      id: 'lasanha-carne',
      name: {
        pt: 'Lasanha de Carne',
        en: 'Beef Lasagna',
        es: 'Lasaña de Carne'
      },
      price: 11.90,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80'
    },
    {
      id: 'lasanha-frango',
      name: {
        pt: 'Lasanha de Frango',
        en: 'Chicken Lasagna',
        es: 'Lasaña de Pollo'
      },
      price: 11.90,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80'
    },
    {
      id: 'tagliatelle-carbonara',
      name: {
        pt: 'Tagliatelle à Carbonara',
        en: 'Tagliatelle Carbonara',
        es: 'Tagliatelle a la Carbonara'
      },
      price: 9.90,
      image: 'https://images.unsplash.com/photo-1611273426858-450d0e9a0f36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    },
    {
      id: 'tagliatelle-bolonhesa',
      name: {
        pt: 'Tagliatelle à Bolonhesa',
        en: 'Tagliatelle Bolognese',
        es: 'Tagliatelle a la Boloñesa'
      },
      price: 9.90,
      image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'fusilli-bolonhesa',
      name: {
        pt: 'Fusilli à Bolonhesa',
        en: 'Fusilli Bolognese',
        es: 'Fusilli a la Boloñesa'
      },
      price: 9.90,
      image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'nhoque-bolonhesa',
      name: {
        pt: 'Nhoque à Bolonhesa',
        en: 'Gnocchi Bolognese',
        es: 'Ñoquis a la Boloñesa'
      },
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ],
  
  todos: [
    {
      id: 'bitoque',
      name: {
        pt: 'Bitoque',
        en: 'Bitoque',
        es: 'Bitoque'
      },
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'parmegiana-frango',
      name: {
        pt: 'Parmegiana de Frango',
        en: 'Chicken Parmigiana',
        es: 'Parmesana de Pollo'
      },
      price: 14.90,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'parmegiana-vaca',
      name: {
        pt: 'Parmegiana de Vaca',
        en: 'Beef Parmigiana',
        es: 'Parmesana de Ternera'
      },
      price: 14.90,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'picanha-grelhada',
      name: {
        pt: 'Picanha Grelhada',
        en: 'Grilled Picanha',
        es: 'Picanha a la Parrilla'
      },
      price: 15.90,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'bife-acebolado',
      name: {
        pt: 'Bife Acebolado',
        en: 'Steak with Onions',
        es: 'Bistec con Cebolla'
      },
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'bife-cogumelos',
      name: {
        pt: 'Bife com Cogumelos',
        en: 'Steak with Mushrooms',
        es: 'Bistec con Champiñones'
      },
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'salsicha-toscana',
      name: {
        pt: 'Salsicha Toscana Acebolada',
        en: 'Tuscan Sausage with Onions',
        es: 'Salchicha Toscana con Cebolla'
      },
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    },
    {
      id: 'bifanas',
      name: {
        pt: 'Bifanas Acebolada',
        en: 'Pork Sandwiches with Onions',
        es: 'Bocadillos de Cerdo con Cebolla'
      },
      price: 13.00,
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
    }
  ],
  
  sobremesas: [
    {
      id: 'pudim-leite',
      name: {
        pt: 'Pudim de Leite Condensado',
        en: 'Condensed Milk Pudding',
        es: 'Flan de Leche Condensada'
      },
      price: 3.90,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'tiramisu',
      name: {
        pt: 'Tiramisu',
        en: 'Tiramisu',
        es: 'Tiramisú'
      },
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'mousse-limao',
      name: {
        pt: 'Mousse de Limão',
        en: 'Lemon Mousse',
        es: 'Mousse de Limón'
      },
      price: 3.90,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'mousse-maracuja',
      name: {
        pt: 'Mousse de Maracujá',
        en: 'Passion Fruit Mousse',
        es: 'Mousse de Maracuyá'
      },
      price: 3.90,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: 'mousse-chocolate',
      name: {
        pt: 'Mousse de Chocolate',
        en: 'Chocolate Mousse',
        es: 'Mousse de Chocolate'
      },
      price: 3.90,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    }
  ],
  
  bebidas: [
    {
      id: 'coca-cola',
      name: {
        pt: 'Coca-Cola lata 330ml',
        en: 'Coca-Cola can 330ml',
        es: 'Coca-Cola lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'coca-zero',
      name: {
        pt: 'Coca-Cola Zero lata 330ml',
        en: 'Coca-Cola Zero can 330ml',
        es: 'Coca-Cola Zero lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'fanta',
      name: {
        pt: 'Fanta lata 330ml',
        en: 'Fanta can 330ml',
        es: 'Fanta lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'guarana',
      name: {
        pt: 'Guaraná Antártica lata 330ml',
        en: 'Guaraná Antártica can 330ml',
        es: 'Guaraná Antártica lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: '7up',
      name: {
        pt: '7Up lata 330ml',
        en: '7Up can 330ml',
        es: '7Up lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'ice-tea-pessego',
      name: {
        pt: 'Ice Tea Pêssego lata 330ml',
        en: 'Peach Ice Tea can 330ml',
        es: 'Té Helado Melocotón lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'ice-tea-limao',
      name: {
        pt: 'Ice Tea Limão lata 330ml',
        en: 'Lemon Ice Tea can 330ml',
        es: 'Té Helado Limón lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'sumos-compal',
      name: {
        pt: 'Sumos Compal garrafa 200ml',
        en: 'Compal Juices bottle 200ml',
        es: 'Zumos Compal botella 200ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'agua-tonica',
      name: {
        pt: 'Água Tónica Schweppes lata 250ml',
        en: 'Schweppes Tonic Water can 250ml',
        es: 'Agua Tónica Schweppes lata 250ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'agua-pedras',
      name: {
        pt: 'Água das Pedras garrafa 250ml',
        en: 'Água das Pedras bottle 250ml',
        es: 'Agua das Pedras botella 250ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'agua-pedras-limao',
      name: {
        pt: 'Água das Pedras Limão garrafa 250ml',
        en: 'Água das Pedras Lemon bottle 250ml',
        es: 'Agua das Pedras Limón botella 250ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'agua-castello',
      name: {
        pt: 'Água Castello garrafa 250ml',
        en: 'Castello Water bottle 250ml',
        es: 'Agua Castello botella 250ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'agua-500ml',
      name: {
        pt: 'Água garrafa 500ml',
        en: 'Water bottle 500ml',
        es: 'Agua botella 500ml'
      },
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'somersby',
      name: {
        pt: 'Somersby lata 500ml',
        en: 'Somersby can 500ml',
        es: 'Somersby lata 500ml'
      },
      price: 3.90,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'cerveja-preta',
      name: {
        pt: 'Cerveja Preta Super Bock Stout lata 330ml',
        en: 'Super Bock Stout Beer can 330ml',
        es: 'Cerveza Negra Super Bock Stout lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'cerveja-super-bock',
      name: {
        pt: 'Cerveja Super Bock lata 330ml',
        en: 'Super Bock Beer can 330ml',
        es: 'Cerveza Super Bock lata 330ml'
      },
      price: 2.50,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'cerveja-sagres',
      name: {
        pt: 'Cerveja Sagres lata 330ml',
        en: 'Sagres Beer can 330ml',
        es: 'Cerveza Sagres lata 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'cerveja-brasil',
      name: {
        pt: 'Cerveja Skol ou Brahma lata 350ml (Brasil)',
        en: 'Skol or Brahma Beer can 350ml (Brazil)',
        es: 'Cerveza Skol o Brahma lata 350ml (Brasil)'
      },
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'cerveja-sem-alcool',
      name: {
        pt: 'Cerveja 0.0% sem álcool garrafa 330ml',
        en: '0.0% Alcohol-Free Beer bottle 330ml',
        es: 'Cerveza 0.0% sin alcohol botella 330ml'
      },
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'imperial',
      name: {
        pt: 'Imperial (fino) 200ml',
        en: 'Imperial (draft) 200ml',
        es: 'Imperial (caña) 200ml'
      },
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    },
    {
      id: 'caneca',
      name: {
        pt: 'Caneca 500ml',
        en: 'Pint 500ml',
        es: 'Caña 500ml'
      },
      price: 3.90,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    }
  ],
  sucos: [
    {
      id: 'suco-laranja',
      name: {
        pt: 'Suco de Laranja Natural',
        en: 'Natural Orange Juice',
        es: 'Zumo de Naranja Natural'
      },
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'suco-laranja-acerola',
      name: {
        pt: 'Suco de Laranja com Acerola',
        en: 'Orange and Acerola Juice',
        es: 'Zumo de Naranja con Acerola'
      },
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'suco-laranja-morango',
      name: {
        pt: 'Suco de Laranja com Morango',
        en: 'Orange and Strawberry Juice',
        es: 'Zumo de Naranja con Fresa'
      },
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
], 
  vinhos: [
    {
      id: 'vinho-tinto-monte-velho',
      name: {
        pt: 'Vinho Tinto Monte Velho garrafa 750ml',
        en: 'Monte Velho Red Wine bottle 750ml',
        es: 'Vino Tinto Monte Velho botella 750ml'
      },
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'vinho-branco-monte-velho',
      name: {
        pt: 'Vinho Branco Monte Velho garrafa 750ml',
        en: 'Monte Velho White Wine bottle 750ml',
        es: 'Vino Blanco Monte Velho botella 750ml'
      },
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'vinho-tinto-jp',
      name: {
        pt: 'Vinho Tinto JP (Bacalhoa) garrafa 750ml',
        en: 'JP Red Wine (Bacalhoa) bottle 750ml',
        es: 'Vino Tinto JP (Bacalhoa) botella 750ml'
      },
      price: 18.00,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'vinho-tinto-pinheiros',
      name: {
        pt: 'Vinho Tinto Monte de Pinheiros (Cartuxa) garrafa 750ml',
        en: 'Monte de Pinheiros Red Wine (Cartuxa) bottle 750ml',
        es: 'Vino Tinto Monte de Pinheiros (Cartuxa) botella 750ml'
      },
      price: 18.00,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'vinho-tinto-esteva',
      name: {
        pt: 'Vinho Tinto Esteva Casa Ferreirinha (Douro) garrafa 750ml',
        en: 'Esteva Red Wine Casa Ferreirinha (Douro) bottle 750ml',
        es: 'Vino Tinto Esteva Casa Ferreirinha (Douro) botella 750ml'
      },
      price: 18.00,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'vinho-tinto-casa',
      name: {
        pt: 'Vinho Tinto da casa jarra 500ml',
        en: 'House Red Wine jug 500ml',
        es: 'Vino Tinto de la casa jarra 500ml'
      },
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'vinho-branco-casa',
      name: {
        pt: 'Vinho Branco da casa Jarra 500ml',
        en: 'House White Wine jug 500ml',
        es: 'Vino Blanco de la casa jarra 500ml'
      },
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ]
};