// script.js - Lógica do site do visitante

// Elementos DOM
const casaTitulo = document.getElementById('casa-titulo');
const casaSubtitulo = document.getElementById('casa-subtitulo');
const statusBadge = document.getElementById('status-badge');
const chamarBtn = document.getElementById('chamar-btn');
const confirmationModal = document.getElementById('confirmation-modal');
const modalMessage = document.getElementById('modal-message');
const closeModalBtn = document.getElementById('close-modal');

// Dados da casa (extraídos da URL)
let casaId = 'DESCONHECIDA';
let casaTipo = 'casa';
let casaNome = 'Casa';

// Cores para os tipos
const tipoCores = {
    'casa': { cor: '#4361ee', texto: 'Casa', icone: 'fa-home' },
    'predio': { cor: '#8b5cf6', texto: 'Prédio', icone: 'fa-building' }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Extrai parâmetros da URL
    extrairParametrosURL();
    
    // Configura a interface
    configurarInterface();
    
    // Configura eventos
    configurarEventos();
    
    // Simula carregamento
    simularCarregamento();
});

// Extrai parâmetros da URL
function extrairParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtém o ID da casa (ex: ?casa=CASA_123)
    const casaParam = urlParams.get('casa');
    
    if (casaParam) {
        casaId = casaParam;
        
        // Tenta extrair tipo do ID (CASA_ ou PREDIO_)
        if (casaParam.toLowerCase().includes('predio')) {
            casaTipo = 'predio';
            casaNome = 'Prédio';
        } else {
            casaTipo = 'casa';
            casaNome = 'Casa';
        }
        
        // Tenta extrair número (última parte após _)
        const partes = casaParam.split('_');
        if (partes.length > 1) {
            const numero = partes[partes.length - 1];
            if (!isNaN(numero)) {
                casaNome += ` ${numero}`;
            }
        }
    }
}

// Configura a interface com os dados
function configurarInterface() {
    const tipoInfo = tipoCores[casaTipo] || tipoCores.casa;
    
    // Atualiza título
    casaTitulo.textContent = `Chamando: ${casaNome}`;
    casaSubtitulo.textContent = `ID: ${casaId}`;
    
    // Atualiza status badge
    statusBadge.innerHTML = `
        <i class="fas fa-circle" style="color: ${tipoInfo.cor}"></i>
        <span>${tipoInfo.texto} - Disponível</span>
    `;
    statusBadge.style.borderColor = tipoInfo.cor;
    statusBadge.style.backgroundColor = `${tipoInfo.cor}15`; // 15 = 0.09 opacidade
    
    // Atualiza ícone do card de informação
    const cardIcon = document.querySelector('.info-card .card-icon i');
    cardIcon.className = `fas ${tipoInfo.icone}`;
    
    // Habilita botão após carregamento
    setTimeout(() => {
        chamarBtn.disabled = false;
        chamarBtn.innerHTML = '<i class="fas fa-phone"></i><span>CHAMAR MORADOR</span>';
    }, 1500);
}

// Configura eventos
function configurarEventos() {
    // Botão chamar morador
    chamarBtn.addEventListener('click', function() {
        if (!chamarBtn.disabled) {
            enviarChamada();
        }
    });
    
    // Fechar modal
    closeModalBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    // Fechar modal clicando fora
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Tecla ESC fecha modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirmationModal.style.display === 'flex') {
            confirmationModal.style.display = 'none';
        }
    });
}

// Simula carregamento inicial
function simularCarregamento() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        
        if (progress <= 100) {
            casaTitulo.textContent = `Carregando ${progress}%...`;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            configurarInterface();
        }
    }, 200);
}

// Simula envio de chamada
function enviarChamada() {
    // Desabilita botão durante o processo
    chamarBtn.disabled = true;
    chamarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>ENVIANDO...</span>';
    
    // Simula delay de rede
    setTimeout(() => {
        // Sucesso!
        mostrarModalSucesso();
        
        // Reabilita botão após 3 segundos
        setTimeout(() => {
            chamarBtn.disabled = false;
            chamarBtn.innerHTML = '<i class="fas fa-phone"></i><span>CHAMAR NOVAMENTE</span>';
        }, 3000);
        
        // Log para console (apenas desenvolvimento)
        console.log(`Chamada enviada para: ${casaNome} (${casaId})`);
        console.log('Horário:', new Date().toLocaleTimeString());
        
        // Aqui seria onde enviaríamos para um backend real
        // fetch('/api/chamada', { method: 'POST', body: JSON.stringify({casaId}) })
        
    }, 1500);
}

// Mostra modal de sucesso
function mostrarModalSucesso() {
    const horario = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    modalMessage.textContent = `Chamada para ${casaNome} enviada com sucesso!`;
    
    // Adiciona detalhes extras
    const detalhes = document.querySelector('.modal-details');
    if (detalhes) {
        detalhes.innerHTML = `
            <p>✅ Notificação enviada para o morador</p>
            <p>🕒 Horário: ${horario}</p>
            <p>📱 Ele receberá um alerta no aplicativo</p>
        `;
    }
    
    // Mostra modal com animação
    confirmationModal.style.display = 'flex';
    
    // Feedback visual no botão original
    const originalBackground = chamarBtn.style.background;
    chamarBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    chamarBtn.innerHTML = '<i class="fas fa-check"></i><span>CHAMADA ENVIADA!</span>';
    
    // Restaura após 2 segundos
    setTimeout(() => {
        chamarBtn.style.background = originalBackground;
    }, 2000);
}

// Função para simular diferentes cenários (para teste)
function simularTeste(tipo) {
    switch(tipo) {
        case 'sucesso':
            enviarChamada();
            break;
        case 'erro':
            // Simula erro de rede
            chamarBtn.disabled = true;
            chamarBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>ERRO DE CONEXÃO</span>';
            chamarBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            setTimeout(() => {
                chamarBtn.disabled = false;
                chamarBtn.innerHTML = '<i class="fas fa-phone"></i><span>TENTAR NOVAMENTE</span>';
                chamarBtn.style.background = 'linear-gradient(135deg, #4361ee, #3a0ca3)';
            }, 3000);
            break;
    }
}

// Para desenvolvimento: adiciona console.log dos dados
console.log('=== INTERFONE VISITANTE ===');
console.log('URL completa:', window.location.href);
console.log('Casa ID:', casaId);
console.log('Casa Tipo:', casaTipo);
console.log('Casa Nome:', casaNome);
console.log('======================');