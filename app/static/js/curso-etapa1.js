document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-curso');

  // 1. CARREGAR DADOS SALVOS (se estiver voltando da Etapa 2)
  if (sessionStorage.getItem('voltandoDaEtapa2')) {
    const cursoSalvo = JSON.parse(localStorage.getItem('cursoBasico')) || {};
    
    // Preenche os campos do formulário
    document.getElementById('titulo').value = cursoSalvo.titulo || '';
    document.getElementById('area').value = cursoSalvo.area || '';
    document.getElementById('nivel').value = cursoSalvo.nivel || '';
    document.getElementById('duracao').value = cursoSalvo.duracao || '';
    document.getElementById('descricao').value = cursoSalvo.descricao || '';
    
    sessionStorage.removeItem('voltandoDaEtapa2'); // Limpa a flag
  }

  // 2. VALIDAÇÃO DO CAMPO DE DURAÇÃO (bloqueia letras)
  document.getElementById('duracao').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (this.value < 1) this.value = 1; // Garante valor mínimo de 1
  });

  // 3. SUBMIT DO FORMULÁRIO
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (!document.getElementById('titulo').value || 
        !document.getElementById('area').value || 
        !document.getElementById('nivel').value || 
        !document.getElementById('duracao').value) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Cria objeto com os dados
    const curso = {
      titulo: document.getElementById('titulo').value,
      area: document.getElementById('area').value,
      nivel: document.getElementById('nivel').value,
      duracao: document.getElementById('duracao').value,
      descricao: document.getElementById('descricao').value,
      capa: document.getElementById('capa').files[0]?.name || null
    };

    // 4. SALVAMENTO E NAVEGAÇÃO
    localStorage.setItem('cursoBasico', JSON.stringify(curso));
    
    // Mantém os módulos se existirem
    const cursoCompleto = JSON.parse(localStorage.getItem('cursoCompleto')) || {};
    if (cursoCompleto.modulos) {
      curso.modulos = cursoCompleto.modulos;
      localStorage.setItem('cursoCompleto', JSON.stringify(curso));
    }

    sessionStorage.setItem('indoParaEtapa2', 'true');
    window.location.href = 'curso-etapa2.html';
  });
});