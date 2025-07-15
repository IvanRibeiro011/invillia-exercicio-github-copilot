# API de Atividades da Escola Secundária Mergington

Uma aplicação extremamente simples usando FastAPI que permite aos estudantes visualizar e se inscrever em atividades extracurriculares.

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Como começar](#como-começar)
- [Endpoints da API](#endpoints-da-api)
- [Modelo de Dados](#modelo-de-dados)
- [Exemplos de Uso](#exemplos-de-uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Desenvolvimento](#desenvolvimento)
- [Contribuição](#contribuição)

## ✨ Funcionalidades

- Visualizar todas as atividades extracurriculares disponíveis
- Inscrever-se em atividades
- Validação automática de capacidade das atividades
- Interface de documentação interativa (Swagger UI)
- Validação de dados com Pydantic
- Tratamento de erros HTTP apropriado

## 🏗️ Arquitetura

A aplicação segue uma arquitetura simples baseada em FastAPI:

- **Framework**: FastAPI para criação da API REST
- **Validação**: Pydantic para validação de dados
- **Documentação**: Swagger UI e ReDoc gerados automaticamente
- **Armazenamento**: Em memória (dados voláteis)
- **Servidor**: Uvicorn como servidor ASGI

## 🚀 Como começar

### Pré-requisitos

- Python 3.7+
- pip

### Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd invillia-exercicio-github-copilot
   ```

2. Instale as dependências:
   ```bash
   pip install fastapi uvicorn
   ```

### Execução

1. Execute a aplicação:
   ```bash
   python app.py
   ```

2. Acesse a aplicação:
   - **API Base**: http://localhost:8000
   - **Documentação Swagger**: http://localhost:8000/docs
   - **Documentação ReDoc**: http://localhost:8000/redoc

## 🔌 Endpoints da API

| Método | Endpoint                                                          | Descrição                                                                  |
| ------ | ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| GET    | `/activities`                                                     | Obter todas as atividades com detalhes e número atual de participantes     |
| POST   | `/activities/{activity_name}/signup?email=student@mergington.edu` | Inscrever-se em uma atividade                                              |

### Detalhes dos Endpoints

#### GET /activities
Retorna todas as atividades disponíveis com informações completas.

**Resposta:**
```json
{
  "atividade_name": {
    "description": "Descrição da atividade",
    "schedule": "Horário da atividade",
    "max_participants": 20,
    "current_participants": 15,
    "enrolled_students": ["email1@mergington.edu", "email2@mergington.edu"]
  }
}
```

#### POST /activities/{activity_name}/signup
Inscreve um estudante em uma atividade específica.

**Parâmetros:**
- `activity_name` (path): Nome da atividade
- `email` (query): Email do estudante

**Respostas:**
- `200`: Inscrição realizada com sucesso
- `400`: Atividade lotada
- `404`: Atividade não encontrada

## 📊 Modelo de Dados

A aplicação utiliza um modelo de dados simples com identificadores claros:

### 1. Atividades
Usa o nome da atividade como identificador único:

```python
{
    "activity_name": {
        "description": str,           # Descrição da atividade
        "schedule": str,             # Horários de funcionamento
        "max_participants": int,     # Número máximo de participantes
        "enrolled_students": list    # Lista de e-mails dos inscritos
    }
}
```

### 2. Estudantes
Usa o e-mail como identificador único:

```python
{
    "email@mergington.edu": {
        "name": str,        # Nome completo do estudante
        "year": int         # Ano escolar (1-12)
    }
}
```

**⚠️ Importante**: Todos os dados são armazenados em memória, portanto serão perdidos quando o servidor for reiniciado.

## 💡 Exemplos de Uso

### Listar todas as atividades

```bash
curl -X GET "http://localhost:8000/activities"
```

### Inscrever-se em uma atividade

```bash
curl -X POST "http://localhost:8000/activities/Drama Club/signup?email=joao.silva@mergington.edu"
```

### Usando Python requests

```python
import requests

# Listar atividades
response = requests.get("http://localhost:8000/activities")
activities = response.json()

# Inscrever-se em atividade
signup_response = requests.post(
    "http://localhost:8000/activities/Drama Club/signup",
    params={"email": "joao.silva@mergington.edu"}
)
```

## 📁 Estrutura do Projeto

```
invillia-exercicio-github-copilot/
├── src/
│   ├── app.py              # Aplicação principal FastAPI
│   └── README.md           # Documentação do projeto
└── ...
```

## 🛠️ Desenvolvimento

### Configuração do Ambiente de Desenvolvimento

1. Instale dependências de desenvolvimento:
   ```bash
   pip install fastapi uvicorn python-multipart
   ```

2. Execute em modo de desenvolvimento:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

### Testando a API

Acesse http://localhost:8000/docs para usar a interface interativa do Swagger UI e testar os endpoints diretamente no navegador.

### Melhorias Futuras

- [ ] Implementar persistência de dados (banco de dados)
- [ ] Adicionar autenticação e autorização
- [ ] Implementar testes automatizados
- [ ] Adicionar logging estruturado
- [ ] Implementar cache para melhor performance
- [ ] Adicionar validações mais robustas
- [ ] Implementar paginação para listas grandes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é parte de um exercício educacional da Invillia.

---

**Desenvolvido com** ❤️ **usando FastAPI e GitHub Copilot**