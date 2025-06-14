import page from 'page';

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

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Calendar season buttons
  const seasonButtons = document.querySelectorAll('[onclick^="toggleCalendarioMes"]');
  seasonButtons.forEach(button => {
    button.removeAttribute('onclick');
    button.addEventListener('click', () => {
      const season = button.textContent.trim().toLowerCase();
      toggleCalendarioMes(season);
    });
  });

  // Newsletter form
  const newsletterForm = document.querySelector('form');
  if (newsletterForm) {
    newsletterForm.removeAttribute('onsubmit');
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  // Initialize first tab and season
  switchTab('primeiros-passos');
  toggleCalendarioMes('primavera');
});

// Função para alternar tabs
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
  document.getElementById(tabId).classList.remove('hidden');
  
  // Ativa a tab selecionada
  document.querySelector(`[data-tab="${tabId}"]`).classList.remove('bg-primary/10', 'text-primary');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('bg-primary', 'text-neutral-light');
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