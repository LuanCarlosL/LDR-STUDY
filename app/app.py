from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os
import re
from datetime import datetime
import unicodedata

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui_use_uma_chave_real_em_producao'

# Configurações
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Criar diretório de uploads se não existir
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_cpf(cpf):
    """Validação de CPF (formato e dígitos verificadores)"""
    cpf = ''.join(filter(str.isdigit, cpf))
    
    if len(cpf) != 11:
        return False
    
    # Verifica dígitos repetidos (ex: 111.111.111-11)
    if len(set(cpf)) == 1:
        return False
    
    # Cálculo do primeiro dígito verificador
    soma = 0
    for i in range(9):
        soma += int(cpf[i]) * (10 - i)
    resto = 11 - (soma % 11)
    digito1 = resto if resto < 10 else 0
    
    # Cálculo do segundo dígito verificador
    soma = 0
    for i in range(10):
        soma += int(cpf[i]) * (11 - i)
    resto = 11 - (soma % 11)
    digito2 = resto if resto < 10 else 0
    
    return int(cpf[9]) == digito1 and int(cpf[10]) == digito2

def validate_phone(phone):
    """Validação de telefone brasileiro"""
    phone = ''.join(filter(str.isdigit, phone))
    # Verifica se tem 10 (fixo) ou 11 (celular) dígitos
    return len(phone) in (10, 11)

def validate_password(password):
    """Validação de senha forte"""
    if len(password) < 8:
        return False, "A senha deve ter pelo menos 8 caracteres"
    if not re.search(r"[A-Z]", password):
        return False, "A senha deve conter pelo menos uma letra maiúscula"
    if not re.search(r"[a-z]", password):
        return False, "A senha deve conter pelo menos uma letra minúscula"
    if not re.search(r"[0-9]", password):
        return False, "A senha deve conter pelo menos um número"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "A senha deve conter pelo menos um caractere especial"
    return True, "Senha válida"

def normalize_text(text):
    """Normaliza texto removendo acentos e caracteres especiais"""
    return unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('ASCII')

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        telefone TEXT NOT NULL,
        endereco TEXT NOT NULL,
        cidade TEXT NOT NULL,
        estado TEXT NOT NULL,
        foto_perfil TEXT,
        biografia TEXT,
        data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP,
        ativo BOOLEAN DEFAULT 1
    )
    ''')
    
    # Tabela para cursos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        area TEXT NOT NULL,
        nivel TEXT NOT NULL,
        duracao INTEGER NOT NULL,
        descricao TEXT NOT NULL,
        capa TEXT,
        usuario_id INTEGER,
        data_criacao TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
    ''')
    
    # Tabela para módulos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS modulos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        curso_id INTEGER,
        nome TEXT NOT NULL,
        ordem INTEGER NOT NULL,
        FOREIGN KEY (curso_id) REFERENCES cursos(id)
    )
    ''')
    
    # Tabela para tópicos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS topicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modulo_id INTEGER,
        nome TEXT NOT NULL,
        descricao TEXT,
        duracao INTEGER,
        video_path TEXT,
        ordem INTEGER NOT NULL,
        FOREIGN KEY (modulo_id) REFERENCES modulos(id)
    )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Rotas principais
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cursos')
def cursos():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('cursos.html')

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro-usuario.html')

# Rotas para criação de cursos
@app.route('/curso-etapa1')
def curso_etapa1():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('curso-etapa1.html')

@app.route('/curso-etapa2')
def curso_etapa2():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    
    # Verifica se veio da etapa 1
    if 'curso_id' not in session:
        flash('Complete a Etapa 1 primeiro!', 'warning')
        return redirect(url_for('curso_etapa1'))
    
    return render_template('curso-etapa2.html')

# Rotas para páginas de cursos específicos
@app.route('/front_end')
def front_end():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('front_end.html')

@app.route('/python_details')
def python_details():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('python_details.html')

@app.route('/artificial_intelligence')
def artificial_intelligence():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('artificial_intelligence.html')

@app.route('/cpp_programming')
def cpp_programming():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('cpp_programming.html')

@app.route('/computer_networks')
def computer_networks():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('computer_networks.html')

@app.route('/backend_services')
def backend_services():
    if 'usuario_id' not in session:
        flash('Por favor, faça login para acessar esta página', 'warning')
        return redirect(url_for('index'))
    return render_template('backend_services.html')

# API para salvar curso (etapa 1)
@app.route('/api/salvar-curso-etapa1', methods=['POST'])
def salvar_curso_etapa1():
    if 'usuario_id' not in session:
        return jsonify({'success': False, 'message': 'Não autenticado'}), 401
    
    data = request.get_json()
    
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        cursor.execute('''
        INSERT INTO cursos (titulo, area, nivel, duracao, descricao, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['titulo'],
            data['area'],
            data['nivel'],
            data['duracao'],
            data['descricao'],
            session['usuario_id']
        ))
        
        curso_id = cursor.lastrowid
        conn.commit()
        session['curso_id'] = curso_id
        
        return jsonify({
            'success': True,
            'curso_id': curso_id,
            'redirect': url_for('curso_etapa2')
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

# API para salvar módulos e tópicos (etapa 2)
@app.route('/api/salvar-curso-etapa2', methods=['POST'])
def salvar_curso_etapa2():
    if 'usuario_id' not in session or 'curso_id' not in session:
        return jsonify({'success': False, 'message': 'Não autenticado ou curso não iniciado'}), 401
    
    data = request.get_json()
    
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Salvar módulos
        for modulo in data['modulos']:
            cursor.execute('''
            INSERT INTO modulos (curso_id, nome, ordem)
            VALUES (?, ?, ?)
            ''', (
                session['curso_id'],
                modulo['nome'],
                modulo['ordem']
            ))
            
            modulo_id = cursor.lastrowid
            
            # Salvar tópicos
            for topico in modulo['topicos']:
                cursor.execute('''
                INSERT INTO topicos (modulo_id, nome, descricao, duracao, ordem)
                VALUES (?, ?, ?, ?, ?)
                ''', (
                    modulo_id,
                    topico['nome'],
                    topico['descricao'],
                    topico['duracao'],
                    topico['ordem']
                ))
        
        conn.commit()
        session.pop('curso_id', None)
        
        return jsonify({
            'success': True,
            'message': 'Curso salvo com sucesso!',
            'redirect': url_for('cursos')
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

# Rotas de autenticação
@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email').strip().lower()
    senha = request.form.get('senha')  # Alterado de 'password' para 'senha'
    
    if not email or not senha:
        flash('Por favor, preencha todos os campos', 'error')
        return redirect(url_for('index'))   
    
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT id, senha, ativo FROM usuarios WHERE email = ?', (email,))
        usuario = cursor.fetchone()
        
        if not usuario:
            flash('E-mail não cadastrado', 'error')
            return redirect(url_for('index'))
        
        if not usuario[2]:  # Verifica se a conta está ativa
            flash('Sua conta está desativada. Entre em contato com o suporte.', 'warning')
            return redirect(url_for('index'))
        
        if check_password_hash(usuario[1], senha):
            session['usuario_id'] = usuario[0]
            session.permanent = True
            flash('Login realizado com sucesso!', 'success')
            return redirect(url_for('cursos'))
        else:
            flash('Senha incorreta', 'error')
            return redirect(url_for('index'))
    
    except Exception as e:
        app.logger.error(f'Erro durante login: {str(e)}')
        flash('Ocorreu um erro durante o login. Tente novamente.', 'error')
        return redirect(url_for('index'))
    
    finally:
        conn.close()

@app.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    try:
        # Obter e sanitizar dados
        nome = normalize_text(request.form.get('nome', '').strip())
        data_nascimento = request.form.get('data-nascimento', '').strip()
        email = request.form.get('email', '').strip().lower()
        senha = request.form.get('senha', '')
        confirmar_senha = request.form.get('confirmar-senha', '')
        cpf = request.form.get('cpf', '').strip()
        telefone = request.form.get('telefone', '').strip()
        endereco = request.form.get('endereco', '').strip()
        cidade = request.form.get('cidade', '').strip()
        estado = request.form.get('estado', '').strip()
        biografia = request.form.get('biografia', '').strip()
        
        # Validações básicas
        if not all([nome, data_nascimento, email, senha, confirmar_senha, cpf, telefone, endereco, cidade, estado]):
            flash('Por favor, preencha todos os campos obrigatórios', 'error')
            return redirect(url_for('cadastro'))
        
        # Validação de e-mail
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            flash('Por favor, insira um e-mail válido', 'error')
            return redirect(url_for('cadastro'))
        
        # Validação de senha
        is_valid, msg = validate_password(senha)
        if not is_valid:
            flash(msg, 'error')
            return redirect(url_for('cadastro'))
        
        if senha != confirmar_senha:
            flash('As senhas não coincidem', 'error')
            return redirect(url_for('cadastro'))
        
        # Validação de data de nascimento
        try:
            nascimento = datetime.strptime(data_nascimento, '%d/%m/%Y')
            idade = (datetime.now() - nascimento).days // 365
            if idade < 12:
                flash('Você deve ter pelo menos 12 anos para se cadastrar', 'error')
                return redirect(url_for('cadastro'))
        except ValueError:
            flash('Formato de data inválido. Use DD/MM/AAAA', 'error')
            return redirect(url_for('cadastro'))
        
        # Validação de CPF
        if not validate_cpf(cpf):
            flash('CPF inválido. Verifique o número digitado', 'error')
            return redirect(url_for('cadastro'))
        
        # Validação de telefone
        if not validate_phone(telefone):
            flash('Telefone inválido. Verifique o número digitado', 'error')
            return redirect(url_for('cadastro'))
        
        # Processar foto de perfil
        foto_perfil = None
        if 'foto' in request.files:
            file = request.files['foto']
            if file.filename != '':
                if not allowed_file(file.filename):
                    flash('Tipo de arquivo não permitido. Use apenas imagens (PNG, JPG, JPEG, GIF)', 'error')
                    return redirect(url_for('cadastro'))
                
                filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                # Verificar se o arquivo é uma imagem válida
                try:
                    from PIL import Image
                    Image.open(filepath).verify()
                except:
                    os.remove(filepath)
                    flash('A imagem enviada é inválida ou está corrompida', 'error')
                    return redirect(url_for('cadastro'))
                
                foto_perfil = filename
        
        # Hash da senha
        senha_hash = generate_password_hash(senha)
        
        # Inserir no banco de dados
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
            INSERT INTO usuarios (
                nome, data_nascimento, email, senha, cpf, telefone, 
                endereco, cidade, estado, foto_perfil, biografia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                nome, data_nascimento, email, senha_hash, cpf, telefone,
                endereco, cidade, estado, foto_perfil, biografia
            ))
            conn.commit()
            
            # Logar o usuário automaticamente
            usuario_id = cursor.lastrowid
            session['usuario_id'] = usuario_id
            session.permanent = True
            
            flash('Cadastro realizado com sucesso! Bem-vindo(a)!', 'success')
            return redirect(url_for('cursos'))
        
        except sqlite3.IntegrityError as e:
            if 'email' in str(e):
                flash('Este e-mail já está cadastrado', 'error')
            elif 'cpf' in str(e):
                flash('Este CPF já está cadastrado', 'error')
            else:
                flash('Erro ao cadastrar usuário. Por favor, tente novamente.', 'error')
            return redirect(url_for('cadastro'))
        
        finally:
            conn.close()
    
    except Exception as e:
        app.logger.error(f'Erro durante cadastro: {str(e)}')
        flash('Ocorreu um erro inesperado durante o cadastro. Por favor, tente novamente.', 'error')
        return redirect(url_for('cadastro'))

@app.route('/logout')
def logout():
    session.clear()
    flash('Você foi desconectado com sucesso', 'info')
    return redirect(url_for('index'))

@app.errorhandler(413)
def request_entity_too_large(error):
    flash('O arquivo enviado é muito grande. O tamanho máximo permitido é 2MB.', 'error')
    return redirect(url_for('cadastro'))

if __name__ == '__main__':
    app.run(debug=True)