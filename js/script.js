import { hortas } from './data.js';
import page from 'page';

// Inicialização do mapa
const map = L.map('map', {
  scrollWheelZoom: false
}).setView([-23.550520, -46.633308], 13);

// Adiciona o tile layer do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Ícones personalizados para cada tipo de horta
const icons = {
  comunitaria: L.divIcon({
    html: '<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-neutral-light"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>',
    className: 'custom-div-icon'
  }),
  educativa: L.divIcon({
    html: '<div class="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-neutral-light"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></div>',
    className: 'custom-div-icon'
  }),
  terapeutica: L.divIcon({
    html: '<div class="w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center text-neutral-light"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div>',
    className: 'custom-div-icon'
  })
};

// Array para armazenar os marcadores
let markers = [];

// Função para criar o conteúdo do popup
const createPopupContent = (horta) => `
  <div class="p-4 min-w-[280px] md:min-w-[300px]">
    <h3 class="font-bold text-lg mb-2 text-neutral-dark">${horta.nome}</h3>
    <img src="${horta.imagem}" alt="${horta.nome}" class="w-full h-40 object-cover rounded-lg mb-3">
    <p class="text-neutral-dark mb-2">${horta.endereco}</p>
    <p class="text-sm mb-3 text-neutral-dark">${horta.descricao}</p>
    <p class="text-sm text-neutral-dark mb-3">
      <strong>Horário:</strong> ${horta.horarioFuncionamento}
    </p>
    <div class="flex gap-2 flex-col sm:flex-row">
      <button onclick="showHortaDetails(${horta.id})" class="flex-1 bg-primary text-neutral-light px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
        Ver Detalhes
      </button>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${horta.latitude},${horta.longitude}" 
         target="_blank"
         class="flex-1 bg-neutral-dark text-neutral-light px-4 py-2 rounded-lg text-sm hover:bg-neutral-dark/80 transition-colors no-underline text-center">
        Como Chegar
      </a>
    </div>
  </div>
`;

// Função para adicionar marcadores ao mapa
const addMarkers = (hortasToShow = hortas) => {
  // Limpa marcadores existentes
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Adiciona novos marcadores
  hortasToShow.forEach(horta => {
    const marker = L.marker([horta.latitude, horta.longitude], {
      icon: icons[horta.tipo]
    })
      .bindPopup(createPopupContent(horta))
      .addTo(map);
    markers.push(marker);
  });

  // Ajusta o zoom para mostrar todos os marcadores se houver resultados
  if (hortasToShow.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds(), { padding: [50, 50] });
  }
};

// Função para buscar hortas
const searchHortas = (searchTerm) => {
  const searchResults = document.getElementById('searchResults');
  const noResults = document.getElementById('noResults');
  const suggestions = document.getElementById('suggestions');
  const resultsCount = document.getElementById('resultsCount');
  
  if (!searchTerm.trim()) {
    searchResults.classList.add('hidden');
    noResults.classList.add('hidden');
    addMarkers();
    return;
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  const filteredHortas = hortas.filter(horta => {
    // Busca nos alimentos da horta
    const hasFood = horta.alimentos.some(alimento => 
      alimento.nome.toLowerCase().includes(normalizedSearch) ||
      alimento.tipo.toLowerCase().includes(normalizedSearch)
    );
    
    // Busca no nome e descrição da horta
    const hasInName = horta.nome.toLowerCase().includes(normalizedSearch);
    const hasInDescription = horta.descricao.toLowerCase().includes(normalizedSearch);
    
    return hasFood || hasInName || hasInDescription;
  });

  // Atualiza a UI com os resultados
  if (filteredHortas.length > 0) {
    searchResults.classList.remove('hidden');
    noResults.classList.add('hidden');
    resultsCount.textContent = filteredHortas.length;
    addMarkers(filteredHortas);
  } else {
    searchResults.classList.add('hidden');
    noResults.classList.remove('hidden');
    
    // Gera sugestões de alimentos disponíveis
    const allFoods = [...new Set(hortas.flatMap(h => 
      h.alimentos.map(a => a.nome)
    ))];
    const randomSuggestions = allFoods
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .join(', ');
    
    suggestions.textContent = randomSuggestions;
    addMarkers([]); // Limpa os marcadores
  }
};

// Função para mostrar detalhes da horta em um modal
const showHortaDetails = (id) => {
  const horta = hortas.find(h => h.id === id);
  if (!horta) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal-content bg-neutral-light">
      <button class="modal-close" onclick="closeModal(this)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="relative">
        <div class="h-48 md:h-80 overflow-hidden">
          <img src="${horta.imagem}" alt="${horta.nome}" class="w-full h-full object-cover">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-dark/80 to-transparent p-4 md:p-8">
            <h1 class="text-2xl md:text-4xl font-bold text-neutral-light mb-2">${horta.nome}</h1>
            <div class="flex items-center text-neutral-light gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p class="text-base md:text-lg">${horta.endereco}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 md:p-8">
        <div class="bg-primary/5 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <div class="flex items-start gap-4">
            <div class="p-3 bg-primary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v2m0 16v2M4 12H2m20 0h-2m-2.05-6.95l-1.41 1.41M5.46 18.54l-1.41 1.41m0-14l1.41 1.41m11.13 11.13l1.41 1.41M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-neutral-dark mb-1">Horário de Funcionamento</h2>
              <p class="text-neutral-dark">${horta.horarioFuncionamento}</p>
            </div>
          </div>
        </div>

        <div class="mb-6 md:mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-8 w-1 bg-primary rounded-full"></div>
            <h2 class="text-xl md:text-2xl font-bold text-neutral-dark">Sobre a Horta</h2>
          </div>
          <p class="text-base md:text-lg text-neutral-dark leading-relaxed">${horta.descricao}</p>
        </div>
        
        <div class="mb-6 md:mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="h-8 w-1 bg-primary rounded-full"></div>
            <h2 class="text-xl md:text-2xl font-bold text-neutral-dark">Alimentos Cultivados</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            ${horta.alimentos.map(alimento => `
              <div class="bg-neutral-light rounded-xl shadow-lg overflow-hidden border border-primary/10">
                <div class="h-36 md:h-48 overflow-hidden">
                  <img src="${alimento.imagem}" alt="${alimento.nome}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
                </div>
                <div class="p-3 md:p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">${alimento.tipo}</span>
                  </div>
                  <h3 class="font-bold text-lg text-neutral-dark mb-2">${alimento.nome}</h3>
                  <p class="text-sm text-neutral-dark">${alimento.descricao}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="flex gap-4 mt-6 md:mt-8">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${horta.latitude},${horta.longitude}" 
             target="_blank"
             class="w-full bg-primary text-neutral-light px-4 md:px-6 py-3 md:py-4 rounded-xl hover:bg-primary-dark transition-colors no-underline text-center font-semibold flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 .553-.894L9 2m0 18v-18m0 18l6-3m-6-15l6-3m-6 0L3 5m6-3l12 6-12 6-12-6 12-6z"/>
            </svg>
            Como Chegar
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);
  setTimeout(() => modalOverlay.classList.add('active'), 10);
};

// Função para fechar o modal
const closeModal = (button) => {
  const modalOverlay = button.closest('.modal-overlay');
  modalOverlay.classList.remove('active');
  setTimeout(() => modalOverlay.remove(), 300);
};

// Função para alternar a visibilidade do conteúdo do FAQ
const toggleFaq = (button) => {
  const content = button.nextElementSibling;
  const icon = button.querySelector('svg');
  
  content.classList.toggle('hidden');
  icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
};

// Adiciona as funções ao objeto window para acesso global
window.showHortaDetails = showHortaDetails;
window.closeModal = closeModal;
window.toggleFaq = toggleFaq;

// Inicializa os marcadores
addMarkers();

// Configura o campo de busca
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
  searchHortas(e.target.value);
});

// Inicializa o roteamento
page();