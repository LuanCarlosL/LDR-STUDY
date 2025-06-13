// 1. TEMPLATES
const moduloTemplate = (numeroModulo) => `
  <div class="modulo" data-modulo-id="${Date.now()}">
    <div class="modulo-header">
      <h3>Módulo ${numeroModulo}</h3>
      <div class="modulo-header-actions">
        <button class="toggle-btn" title="Minimizar/Maximizar">−</button>
        <button class="remove-btn remove-modulo-btn" title="Remover módulo">×</button>
      </div>
    </div>
    <div class="modulo-content">
      <label>Nome do Módulo</label>
      <input type="text" class="modulo-nome" placeholder="Ex: Introdução ao Python" required />
      
      <div class="topicos-container">
        <!-- Tópicos serão adicionados aqui -->
      </div>
      
      <button class="btn btn-secondary add-topico-btn">+ Novo Tópico</button>
    </div>
  </div>
`;

const topicoTemplate = (numeroTopico) => `
  <div class="topico" data-topico-id="${Date.now()}">
    <div class="topico-header">
      <span><strong>Tópico ${numeroTopico}</strong></span>
      <div class="modulo-header-actions">
        <button class="toggle-btn" title="Minimizar/Maximizar">−</button>
        <button class="remove-btn remove-topico-btn" title="Remover tópico">×</button>
      </div>
    </div>
    <div class="topico-content">
      <label>Nome do Tópico</label>
      <input type="text" class="topico-nome" placeholder="Ex: Instalando o Python" required />
      
      <label>Vídeo (upload)</label>
      <input type="file" class="topico-video" accept="video/*" />
      
      <label>Descrição do Tópico</label>
      <textarea class="topico-descricao" placeholder="Breve descrição do que será abordado..."></textarea>
      
      <label>Duração Estimada (em minutos)</label>
      <input type="number" class="topico-duracao" min="1" placeholder="Ex: 10" />
    </div>
  </div>
`;

// 2. FUNÇÕES PRINCIPAIS
function atualizarNumerosModulos() {
  document.querySelectorAll('.modulo').forEach((modulo, index) => {
    modulo.querySelector('h3').textContent = `Módulo ${index + 1}`;
    modulo.querySelectorAll('.topico').forEach((topico, topicoIndex) => {
      topico.querySelector('.topico-header span').innerHTML = 
        `<strong>Tópico ${topicoIndex + 1}</strong>`;
    });
  });
}

function adicionarModulo() {
  const modulosContainer = document.getElementById('modulos-container');
  const numeroModulo = modulosContainer.children.length + 1;
  modulosContainer.insertAdjacentHTML('beforeend', moduloTemplate(numeroModulo));
  
  const modulo = modulosContainer.lastElementChild;
  
  // Configura eventos do módulo
  modulo.querySelector('.toggle-btn').addEventListener('click', (e) => {
    modulo.classList.toggle('minimizado');
    e.target.textContent = modulo.classList.contains('minimizado') ? '+' : '−';
  });
  
  modulo.querySelector('.remove-modulo-btn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja remover este módulo e todos os seus tópicos?')) {
      modulo.remove();
      atualizarNumerosModulos();
    }
  });
  
  modulo.querySelector('.add-topico-btn').addEventListener('click', () => {
    adicionarTopico(modulo);
  });
  
  return modulo;
}

function adicionarTopico(modulo) {
  const topicosContainer = modulo.querySelector('.topicos-container');
  const numeroTopico = topicosContainer.children.length + 1;
  topicosContainer.insertAdjacentHTML('beforeend', topicoTemplate(numeroTopico));
  
  const topico = topicosContainer.lastElementChild;
  
  // Configura eventos do tópico
  topico.querySelector('.toggle-btn').addEventListener('click', (e) => {
    topico.classList.toggle('minimizado');
    e.target.textContent = topico.classList.contains('minimizado') ? '+' : '−';
  });
  
  topico.querySelector('.remove-topico-btn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja remover este tópico?')) {
      topico.remove();
      atualizarNumerosModulos();
    }
  });
  
  return topico;
}

function salvarCurso() {
  const curso = JSON.parse(localStorage.getItem('cursoBasico')) || {};
  const modulos = [];
  
  document.querySelectorAll('.modulo').forEach(moduloEl => {
    const modulo = {
      nome: moduloEl.querySelector('.modulo-nome').value,
      topicos: []
    };
    
    moduloEl.querySelectorAll('.topico').forEach(topicoEl => {
      modulo.topicos.push({
        nome: topicoEl.querySelector('.topico-nome').value,
        descricao: topicoEl.querySelector('.topico-descricao').value,
        duracao: topicoEl.querySelector('.topico-duracao').value,
        
      });
    });
    
    modulos.push(modulo);
  });
  
  // Salva dados completos
  curso.modulos = modulos;
  localStorage.setItem('cursoCompleto', JSON.stringify(curso));
  alert('Curso salvo com sucesso!');
}

// 3. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se veio da Etapa 1
  const cursoBasico = JSON.parse(localStorage.getItem('cursoBasico'));
  if (!cursoBasico) {
    alert("Complete a Etapa 1 primeiro!");
    window.location.href = "curso-etapa1.html";
    return;
  }

  // Preenche resumo
  document.getElementById("resumo-titulo").textContent = cursoBasico.titulo;
  document.getElementById("resumo-area").textContent = cursoBasico.area;
  document.getElementById("resumo-nivel").textContent = cursoBasico.nivel;
  document.getElementById("resumo-duracao").textContent = `${cursoBasico.duracao} horas`;
  document.getElementById("resumo-descricao").textContent = cursoBasico.descricao;

  // Carrega módulos existentes ou inicia novo
  const cursoCompleto = JSON.parse(localStorage.getItem('cursoCompleto'));
  if (cursoCompleto?.modulos?.length > 0) {
    cursoCompleto.modulos.forEach(modulo => {
      const novoModulo = adicionarModulo();
      novoModulo.querySelector('.modulo-nome').value = modulo.nome;
      
      // Remove tópico padrão vazio
      novoModulo.querySelector('.topico')?.remove();
      
      // Adiciona tópicos salvos
      modulo.topicos.forEach(topico => {
        const novoTopic = adicionarTopico(novoModulo);
        novoTopic.querySelector('.topico-nome').value = topico.nome;
        novoTopic.querySelector('.topico-descricao').value = topico.descricao;
        novoTopic.querySelector('.topico-duracao').value = topico.duracao;
      });
    });
  } else {
    adicionarModulo(); // Módulo inicial vazio
  }

  // Event Listeners
  document.getElementById('add-modulo-btn').addEventListener('click', adicionarModulo);
  document.getElementById('salvar-curso-btn').addEventListener('click', salvarCurso);
  
  // Botão Voltar
  document.querySelector('.btn-voltar').addEventListener('click', (e) => {
    e.preventDefault();
    salvarCurso(); // Salva antes de voltar
    sessionStorage.setItem('voltandoDaEtapa2', 'true');
    window.location.href = 'curso-etapa1.html';
  });
});