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

    // ----- ATENÇÃO: PERSONALIZE A LÓGICA DE URL ABAIXO -----
    // Ajuste esta seção para que os nomes dos arquivos HTML correspondam aos seus.
    let pageUrl;
    const courseFileMapping = {
        'python': 'python_details.html', // Exemplo: substitua pelo nome real
        'ia': 'artificial_intelligence_course.html', // Exemplo
        'cpp': 'cpp_programming.html', // Exemplo
        'frontend': 'front_end.html', // Verifique se 'front_end.html' é o nome correto
        'redes': 'computer_networks.html', // Exemplo
        'backend': 'backend_services.html' // Exemplo
    };

    if (courseFileMapping[courseIdentifier]) {
        pageUrl = courseFileMapping[courseIdentifier];
    } else {
        console.error('ERRO CRÍTICO: URL não mapeada para o curso:', courseIdentifier, 'no objeto courseFileMapping.');
        alert('Desculpe, a página para este curso não foi encontrada. Verifique a configuração no arquivo script.js (courseFileMapping).');
        return;
    }
    // ----- FIM DA SEÇÃO DE PERSONALIZAÇÃO DE URL -----

    console.log(`Redirecionamento para o curso: "${friendlyCourseName}", Identificador: "${courseIdentifier}", URL Gerada: "${pageUrl}"`);
    window.location.href = pageUrl;
}

// Este listener executa o código quando o HTML da página estiver completamente carregado.
document.addEventListener('DOMContentLoaded', function () {

    // Lógica de Login (para index.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) { // Verifica se o formulário de login existe na página atual
        const emailInput = document.getElementById('email-input');
        const passwordInput = document.getElementById('password-input');
        const errorMessageElement = document.getElementById('error-message');
        const FAKE_EMAIL = "LDRSTUDY@gmail.com";
        const FAKE_PASSWORD = "12345678";

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (email === FAKE_EMAIL && password === FAKE_PASSWORD) {
                errorMessageElement.textContent = "";
                // Redireciona para a página de cursos após o login
                window.location.href = 'cursos.html';
            } else {
                errorMessageElement.textContent = "Email ou senha inválidos.";
                if(passwordInput) passwordInput.value = "";
            }
        });
    }

    // Lógica da Seção de Pagamento (para index.html)
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    const cardDetailsDiv = document.querySelector('#payment-section .pl-6.hidden'); // Div dos detalhes do cartão
    const mainPayButton = document.querySelector('#payment-section .bg-purple-600.text-white'); // Botão principal de pagar no resumo
    const paymentCardRadio = document.getElementById('payment-card');
    const paymentBoletoRadio = document.getElementById('payment-boleto');
    const paymentPaypalRadio = document.getElementById('payment-paypal');

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