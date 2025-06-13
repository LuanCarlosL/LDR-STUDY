document.addEventListener('DOMContentLoaded', function() {
    // Preenche os estados
    preencherEstados();
    
    // Configura as validações em tempo real
    configurarValidacoesTempoReal();
    
    // Validação do formulário no submit

    function configurarValidacoesTempoReal() {
        // Validação do CPF
        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            if (value.length > 11) {
                value = value.substring(0, 11);
                return; // Impede digitação adicional
            }
            
            // Formatação automática
            let formattedValue = '';
            if (value.length > 0) {
                formattedValue = value.substring(0, 3);
            }
            if (value.length > 3) {
                formattedValue += '.' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formattedValue += '.' + value.substring(6, 9);
            }
            if (value.length > 9) {
                formattedValue += '-' + value.substring(9, 11);
            }
            
            e.target.value = formattedValue;
            
            // Validação
            if (value.length === 11) {
                limparErro(cpfInput);
            } else if (value.length > 0) {
                mostrarErro(cpfInput, 'O CPF deve ter exatamente 11 dígitos');
            }
        });

        cpfInput.addEventListener('keydown', function(e) {
            // Permite apenas: números, backspace, delete, tab, setas
            if (!/[0-9]|Backspace|Delete|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Validação da Data de Nascimento
        const dataInput = document.getElementById('data-nascimento');
        dataInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2 && value.length <= 4) {
                value = value.replace(/^(\d{2})/, '$1/');
            } else if (value.length > 4) {
                value = value.replace(/^(\d{2})(\d{2})/, '$1/$2/');
            }
            
            e.target.value = value.substring(0, 10);
            
            if (value.length >= 8) {
                validarDataNascimento(e.target);
            }
        });

        // Validação do Telefone
        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            let formattedValue = '';
            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 2);
            }
            if (value.length > 2) {
                formattedValue += ') ' + value.substring(2, 7);
            }
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 11);
            }
            
            e.target.value = formattedValue;
            
            if (value.length === 11) {
                limparErro(telefoneInput);
            } else if (value.length > 0) {
                mostrarErro(telefoneInput, 'O telefone deve ter exatamente 11 dígitos (DDD + número)');
            }
        });

        // Validação da Senha
        const senhaInput = document.getElementById('senha');
        senhaInput.addEventListener('input', function(e) {
            if (e.target.value.length > 0 && e.target.value.length < 8) {
                mostrarErro(senhaInput, 'A senha deve ter pelo menos 8 caracteres');
            } else {
                limparErro(senhaInput);
            }
        });
    }

    function validarDataNascimento(input) {
        const value = input.value;
        const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        
        if (!regexData.test(value)) {
            mostrarErro(input, 'Formato inválido (DD/MM/AAAA)');
            return false;
        }
        
        const [, dia, mes, ano] = value.match(regexData);
        const data = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        
        if (
            data.getDate() != dia || 
            data.getMonth() != mes - 1 || 
            data.getFullYear() != ano ||
            data > hoje
        ) {
            mostrarErro(input, 'Data inválida ou futura');
            return false;
        }
        
        limparErro(input);
        return true;
    }

    function mostrarErro(input, mensagem) {
        limparErro(input);
        
        const divErro = document.createElement('div');
        divErro.className = 'error-message';
        divErro.textContent = mensagem;
        divErro.style.color = '#dc3545';
        divErro.style.fontSize = '0.875rem';
        divErro.style.marginTop = '5px';
        
        input.classList.add('error');
        input.parentNode.appendChild(divErro);
    }

    function limparErro(input) {
        input.classList.remove('error');
        const erro = input.parentNode.querySelector('.error-message');
        if (erro) erro.remove();
    }

function validarFormulario() {
    let valido = true;
    
    // Valida CPF
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        mostrarErro(document.getElementById('cpf'), 'O CPF deve ter exatamente 11 dígitos');
        valido = false;
    }
    
    // Valida Data
    if (!validarDataNascimento(document.getElementById('data-nascimento'))) {
        valido = false;
    }
    
    // Valida Telefone
    const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
    if (telefone.length !== 11) {
        mostrarErro(document.getElementById('telefone'), 'O telefone deve ter exatamente 11 dígitos (DDD + número)');
        valido = false;
    }
    
    // Valida Senha
    const senha = document.getElementById('senha').value;
    if (senha.length < 8) {  // Alterado para 8 caracteres para corresponder ao backend
        mostrarErro(document.getElementById('senha'), 'A senha deve ter pelo menos 8 caracteres');
        valido = false;
    }
    
    // Valida Confirmação de Senha
    if (senha !== document.getElementById('confirmar-senha').value) {
        mostrarErro(document.getElementById('confirmar-senha'), 'As senhas não coincidem');
        valido = false;
    }
    
    return valido;
}

    function preencherEstados() {
        const estados = [
            { sigla: 'AC', nome: 'Acre' },
            { sigla: 'AL', nome: 'Alagoas' },
            { sigla: 'AP', nome: 'Amapá' },
            { sigla: 'AM', nome: 'Amazonas' },
            { sigla: 'BA', nome: 'Bahia' },
            { sigla: 'CE', nome: 'Ceará' },
            { sigla: 'DF', nome: 'Distrito Federal' },
            { sigla: 'ES', nome: 'Espírito Santo' },
            { sigla: 'GO', nome: 'Goiás' },
            { sigla: 'MA', nome: 'Maranhão' },
            { sigla: 'MT', nome: 'Mato Grosso' },
            { sigla: 'MS', nome: 'Mato Grosso do Sul' },
            { sigla: 'MG', nome: 'Minas Gerais' },
            { sigla: 'PA', nome: 'Pará' },
            { sigla: 'PB', nome: 'Paraíba' },
            { sigla: 'PR', nome: 'Paraná' },
            { sigla: 'PE', nome: 'Pernambuco' },
            { sigla: 'PI', nome: 'Piauí' },
            { sigla: 'RJ', nome: 'Rio de Janeiro' },
            { sigla: 'RN', nome: 'Rio Grande do Norte' },
            { sigla: 'RS', nome: 'Rio Grande do Sul' },
            { sigla: 'RO', nome: 'Rondônia' },
            { sigla: 'RR', nome: 'Roraima' },
            { sigla: 'SC', nome: 'Santa Catarina' },
            { sigla: 'SP', nome: 'São Paulo' },
            { sigla: 'SE', nome: 'Sergipe' },
            { sigla: 'TO', nome: 'Tocantins' }
        ];
        
        const selectEstado = document.getElementById('estado');
        selectEstado.innerHTML = '<option value="" disabled selected>Selecione seu estado</option>';
        
        estados.sort((a, b) => a.nome.localeCompare(b.nome));
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.sigla;
            option.textContent = `${estado.sigla} - ${estado.nome}`;
            selectEstado.appendChild(option);
        });
    }
});