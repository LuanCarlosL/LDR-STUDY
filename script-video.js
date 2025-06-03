document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os cards de aula
    const lessonCards = document.querySelectorAll('.lesson-card');
    const videoTitle = document.querySelector('.lesson-title');
    
    // Adiciona evento de clique para cada card
    lessonCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove a classe 'active' de todos os cards
            lessonCards.forEach(c => c.classList.remove('active'));
            
            // Adiciona a classe 'active' apenas ao card clicado
            this.classList.add('active');
            
            // Atualiza o título da aula no player de vídeo
            const lessonName = this.querySelector('h4').textContent;
            videoTitle.textContent = lessonName;
            
            // Marca como concluído
            const icon = this.querySelector('.fa-check-circle');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.classList.remove('incomplete-icon');
                icon.classList.add('completed-icon');
            }
        });
    });
    
    // Navegação entre módulos
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleNumber = document.querySelector('.module-number');
    const moduleTitle = document.querySelector('.current-module');
    
    prevBtn.addEventListener('click', function() {
        let module = parseInt(moduleNumber.textContent);
        if (module > 1) {
            moduleNumber.textContent = module - 1;
            updateModuleContent(module - 1);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        let module = parseInt(moduleNumber.textContent);
        moduleNumber.textContent = module + 1;
        updateModuleContent(module + 1);
    });
    
    function updateModuleContent(moduleNumber) {
        // Atualiza o título do módulo
        moduleTitle.textContent = `Módulo ${moduleNumber} - ${getModuleTitle(moduleNumber)}`;
        
        // Resetar o progresso ao mudar de módulo
        lessonCards.forEach(card => {
            card.classList.remove('active');
            const icon = card.querySelector('.fa-check-circle');
            if (icon) {
                icon.classList.remove('fas', 'completed-icon');
                icon.classList.add('far', 'incomplete-icon');
            }
        });
        
        // Ativa a primeira aula do novo módulo
        if (lessonCards.length > 0) {
            lessonCards[0].classList.add('active');
            videoTitle.textContent = lessonCards[0].querySelector('h4').textContent;
        }
    }
    
    function getModuleTitle(moduleNumber) {
        const titles = {
            1: 'Primeiro Contato',
            2: 'Fundamentos HTML',
            3: 'Introdução ao CSS',
            4: 'JavaScript Básico'
        };
        return titles[moduleNumber] || 'Novo Módulo';
    }
    
    // Simula um player de vídeo (em uma implementação real, substitua por um player verdadeiro)
    const playBtn = document.querySelector('.fa-play').closest('.control-btn');
    playBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-play')) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            // Aqui você iniciaria o vídeo
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            // Aqui você pausaria o vídeo
        }
    });
});