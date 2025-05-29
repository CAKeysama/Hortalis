import page from 'page';

// Mobile Navigation Functions
window.toggleMobileNav = () => {
  const mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
};

window.closeMobileNav = () => {
  const mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
};

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.querySelector('.hamburger');
  
  if (mobileNav?.classList.contains('active') && 
      !mobileNav.contains(e.target) && 
      !hamburger.contains(e.target)) {
    closeMobileNav();
  }
});

// Calendário de Plantio - Dados
const calendarioPlantio = {
  primavera: {
    meses: ['Setembro', 'Outubro', 'Novembro'],
    plantas: {
      'Setembro': ['Tomate', 'Pimentão', 'Berinjela'],
      'Outubro': ['Abobrinha', 'Pepino', 'Melancia'],
      'Novembro': ['Milho', 'Feijão', 'Quiabo']
    }
  },
  verao: {
    meses: ['Dezembro', 'Janeiro', 'Fevereiro'],
    plantas: {
      'Dezembro': ['Alface', 'Rúcula', 'Agrião'],
      'Janeiro': ['Cenoura', 'Beterraba', 'Rabanete'],
      'Fevereiro': ['Couve', 'Brócolis', 'Repolho']
    }
  },
  outono: {
    meses: ['Março', 'Abril', 'Maio'],
    plantas: {
      'Março': ['Espinafre', 'Acelga', 'Chicória'],
      'Abril': ['Cebolinha', 'Salsa', 'Coentro'],
      'Maio': ['Alho', 'Cebola', 'Alho-poró']
    }
  },
  inverno: {
    meses: ['Junho', 'Julho', 'Agosto'],
    plantas: {
      'Junho': ['Ervilha', 'Fava', 'Grão-de-bico'],
      'Julho': ['Batata', 'Mandioca', 'Inhame'],
      'Agosto': ['Nabo', 'Couve-flor', 'Repolho']
    }
  }
};

// Função para alternar tabs with mobile optimization
const switchTab = (tabId) => {
  // Oculta todos os conteúdos
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  // Remove a classe ativa de todas as tabs
  document.querySelectorAll('.tab-button').forEach(tab => {
    tab.classList.remove('bg-primary', 'text-neutral-light');
    tab.classList.add('bg-primary/10', 'text-primary');
  });
  
  // Mostra o conteúdo selecionado
  const selectedContent = document.getElementById(tabId);
  if (selectedContent) {
    selectedContent.classList.remove('hidden');
    
    // Scroll into view on mobile
    if (window.innerWidth <= 768) {
      selectedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  // Ativa a tab selecionada
  const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
  if (selectedTab) {
    selectedTab.classList.remove('bg-primary/10', 'text-primary');
    selectedTab.classList.add('bg-primary', 'text-neutral-light');
  }
};

// Função para alternar o calendário
const toggleCalendarioMes = (estacao) => {
  const calendario = document.getElementById('calendario-plantio');
  calendario.innerHTML = '';
  
  const dados = calendarioPlantio[estacao];
  
  dados.meses.forEach(mes => {
    const plantas = dados.plantas[mes];
    const mesElement = document.createElement('div');
    mesElement.className = 'calendar-month';
    mesElement.innerHTML = `
      <div class="calendar-month-header">
        ${mes}
      </div>
      <div class="calendar-month-content">
        ${plantas.map(planta => `
          <span class="plant-tag">${planta}</span>
        `).join('')}
      </div>
    `;
    calendario.appendChild(mesElement);
  });
};

// Função para inscrição na newsletter
const handleNewsletterSubmit = (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  
  // Aqui você adicionaria a lógica para salvar o email
  alert('Inscrição realizada com sucesso!');
  event.target.reset();
};

// Exporta as funções para uso global
window.switchTab = switchTab;
window.toggleCalendarioMes = toggleCalendarioMes;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// Inicializa a primeira tab e estação
document.addEventListener('DOMContentLoaded', () => {
  switchTab('primeiros-passos');
  toggleCalendarioMes('primavera');
});