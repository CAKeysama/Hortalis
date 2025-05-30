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

// Função para alternar tabs com suporte a teclado
const switchTab = (tabId) => {
  // Oculta todos os conteúdos
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
    content.setAttribute('aria-hidden', 'true');
  });
  
  // Remove a classe ativa de todas as tabs
  document.querySelectorAll('.tab-button').forEach(tab => {
    tab.classList.remove('bg-primary', 'text-neutral-light');
    tab.classList.add('bg-primary/10', 'text-primary');
    tab.setAttribute('aria-selected', 'false');
  });
  
  // Mostra o conteúdo selecionado
  const selectedContent = document.getElementById(tabId);
  selectedContent.classList.remove('hidden');
  selectedContent.setAttribute('aria-hidden', 'false');
  
  // Ativa a tab selecionada
  const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
  selectedTab.classList.remove('bg-primary/10', 'text-primary');
  selectedTab.classList.add('bg-primary', 'text-neutral-light');
  selectedTab.setAttribute('aria-selected', 'true');
};

// Função para alternar o calendário com animação suave
const toggleCalendarioMes = (estacao) => {
  const calendario = document.getElementById('calendario-plantio');
  
  // Adiciona classe para fade out
  calendario.style.opacity = '0';
  
  // Atualiza o conteúdo após a animação de fade out
  setTimeout(() => {
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
            <span class="plant-tag" role="button" tabindex="0">${planta}</span>
          `).join('')}
        </div>
      `;
      calendario.appendChild(mesElement);
    });
    
    // Adiciona classe para fade in
    calendario.style.opacity = '1';
  }, 200);
};

// Função para inscrição na newsletter com validação
const handleNewsletterSubmit = (event) => {
  event.preventDefault();
  const emailInput = event.target.email;
  const email = emailInput.value;
  
  if (!email) {
    showError('Por favor, insira seu email.');
    return;
  }
  
  if (!isValidEmail(email)) {
    showError('Por favor, insira um email válido.');
    return;
  }
  
  // Simulação de envio bem-sucedido
  showSuccess('Inscrição realizada com sucesso!');
  event.target.reset();
};

// Funções auxiliares
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const showError = (message) => {
  alert(message); // Em produção, usar um componente de toast ou modal
};

const showSuccess = (message) => {
  alert(message); // Em produção, usar um componente de toast ou modal
};

// Event Listeners para acessibilidade
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa a primeira tab
  switchTab('primeiros-passos');
  toggleCalendarioMes('primavera');
  
  // Adiciona suporte a teclado para tags de plantas
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target;
      if (target.classList.contains('plant-tag')) {
        e.preventDefault();
        target.click();
      }
    }
  });
  
  // Adiciona listeners para botões de estação
  const seasonButtons = document.querySelectorAll('[onclick*="toggleCalendarioMes"]');
  seasonButtons.forEach(button => {
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
});

// Exporta as funções para uso global
window.switchTab = switchTab;
window.toggleCalendarioMes = toggleCalendarioMes;
window.handleNewsletterSubmit = handleNewsletterSubmit;