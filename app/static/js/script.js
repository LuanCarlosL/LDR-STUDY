// Funções que precisam ser globais (acessíveis pelo onclick do HTML)
/**
 * Função para obter o nome amigável do curso.
 * @param {string} courseIdentifier - O identificador do curso (ex: 'python', 'ia').
 * @returns {string} O nome amigável do curso.
 */
function getCourseName(courseIdentifier) {
    const names = {
        'python': 'Python',
        'ia': 'Inteligência Artificial',
        'cpp': 'C++',
        'frontend': 'Front End',
        'redes': 'Redes',
        'backend': 'Back End'
    };
    return names[courseIdentifier] || courseIdentifier;
}

/**
 * Função principal para selecionar o curso e redirecionar para a página dedicada.
 * @param {string} courseIdentifier - O identificador do curso (ex: 'python').
 */
function selectCourse(courseIdentifier) {
    const friendlyCourseName = getCourseName(courseIdentifier);
    alert(`Você selecionou o curso de ${friendlyCourseName}. Redirecionando...`);

    // Usar as rotas do Flask através de URLs pré-definidas
    const courseUrls = {
        'python': '/python_details',
        'ia': '/artificial_intelligence',
        'cpp': '/cpp_programming',
        'frontend': '/front_end',
        'redes': '/computer_networks',
        'backend': '/backend_services'
    };

    if (courseUrls[courseIdentifier]) {
        window.location.href = courseUrls[courseIdentifier];
    } else {
        console.error('ERRO CRÍTICO: URL não mapeada para o curso:', courseIdentifier);
        alert('Desculpe, a página para este curso não foi encontrada.');
    }
}
// Este listener executa o código quando o HTML da página estiver completamente carregado.
document.addEventListener('DOMContentLoaded', function () {

// Lógica de Login (para index.html)
    // const loginForm = document.getElementById('loginForm');
    // if (loginForm) {
    //     const emailInput = document.getElementById('email-input');
    //     const passwordInput = document.getElementById('password-input');
    //     const errorMessageElement = document.getElementById('error-message');

    //     loginForm.addEventListener('submit', function(event) {
    //         // Limpa mensagens de erro anteriores
    //         errorMessageElement.textContent = "";
            
    //         // Validação básica do cliente
    //         if (!emailInput.value.trim() || !passwordInput.value.trim()) {
    //             event.preventDefault();
    //             errorMessageElement.textContent = "Por favor, preencha todos os campos.";
    //         }
    //         // Se estiver tudo ok, o formulário será enviado normalmente para o Flask
    //     });
    // }

    // Lógica da Seção de Pagamento (para index.html)
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    const cardDetailsDiv = document.querySelector('#payment-section .pl-6.hidden'); // Div dos detalhes do cartão
    const mainPayButton = document.querySelector('#payment-section .bg-purple-600.text-white'); // Botão principal de pagar no resumo
    const paymentCardRadio = document.getElementById('payment-card');
    const paymentBoletoRadio = document.getElementById('payment-boleto');
    const paymentPaypalRadio = document.getElementById('payment-paypal');
    const btnCadastro = document.getElementById("btn-cadastro");
    if (btnCadastro) {
        btnCadastro.addEventListener("click", function () {
            window.location.href = "/cadastro";
        });
    }

    function updateMainPayButtonText() {
        if (!mainPayButton) return;
        if (paymentCardRadio && paymentCardRadio.checked) {
            mainPayButton.textContent = 'Pagar com Cartão';
        } else if (paymentBoletoRadio && paymentBoletoRadio.checked) {
            mainPayButton.textContent = 'Pagar com Boleto Bancário';
        } else if (paymentPaypalRadio && paymentPaypalRadio.checked) {
            mainPayButton.textContent = 'Pagar com PayPal';
        }
    }

    if (paymentRadios.length > 0) { // Verifica se os elementos de pagamento existem
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (paymentCardRadio && paymentCardRadio.checked) {
                    if (cardDetailsDiv) cardDetailsDiv.classList.remove('hidden');
                } else {
                    if (cardDetailsDiv) cardDetailsDiv.classList.add('hidden');
                }
                updateMainPayButtonText(); // Atualiza o texto do botão principal também
            });
        });

        // Estado inicial dos botões e campos de pagamento
        if (mainPayButton) updateMainPayButtonText();
        if (paymentCardRadio && paymentCardRadio.checked) {
            if (cardDetailsDiv) cardDetailsDiv.classList.remove('hidden');
        } else {
            if (cardDetailsDiv) cardDetailsDiv.classList.add('hidden');
        }
    }

    // Lógica para os botões "Saiba mais" nos cards de curso (para cursos.html)
    const courseButtons = document.querySelectorAll('.course-card .btn');
    if (courseButtons.length > 0) { // Verifica se os botões de curso existem na página
        courseButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation(); // Impede que o onclick do card pai seja acionado também
                let courseIdentifier = null;
                for (const cls of this.classList) {
                    if (cls !== 'btn') {
                        courseIdentifier = cls;
                        break;
                    }
                }
                if (courseIdentifier) {
                    selectCourse(courseIdentifier); // Chama a função global
                } else {
                    console.error('ERRO: Não foi possível determinar o identificador do curso a partir do botão clicado. Classes:', this.classList);
                    alert('Erro interno: Não foi possível identificar o curso selecionado.');
                }
            });
        });
    }
});