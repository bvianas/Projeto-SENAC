![Banner da Plataforma de Monitoramento de Hábitos](https://raw.githubusercontent.com/bvianas/Projeto-SENAC/main/monitor-habitos/backend/public/images/banner-readme.md.png)


## 📌 Visão Geral

O projeto busca oferecer uma solução para o acompanhamento diário de hábitos, focando na experiência do usuário e na facilidade de uso. Atualmente, o sistema conta com estrutura inicial para cadastro de usuários e hábitos.

## 🎯 Objetivo

Desenvolver uma aplicação web com frontend em HTML, CSS e JavaScript e backend em Node.js que permita:
- Cadastro e gerenciamento de usuários
- Cadastro de hábitos personalizados
- Organização inicial da estrutura de backend e frontend

## 💻 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Ferramentas**: Postman, VS Code

## 🧩 Funcionalidades Implementadas

- Estrutura de backend com Express.js
- Cadastro de usuários (rotas e controllers)
- Servidor Node.js configurado
- Interface inicial com HTML/CSS

## 📁 Estrutura do Projeto

```bash
monitor-habitos/
├── backend/                           # Backend da aplicação
│   ├── controllers/                   # Lógica dos controladores
│   ├── middleware/                    # Middlewares personalizados (ex: autenticação)
│   ├── models/                        # Modelos de dados (ex: usuário, hábitos)
│   ├── node_modules/                  # Dependências do Node.js
│   ├── public/                        # Arquivos públicos (acessíveis no navegador)
│   │   ├── css/                       # Estilos CSS da aplicação
│   │   ├── images/                    # Imagens usadas no projeto (ex: banner)
│   │   └── script/                    # Scripts e páginas HTML
│   │       ├── dashboard.js
│   │       ├── login.js
│   │       ├── register.js
│   │       ├── dashboard.html
│   │       ├── index.html
│   │       ├── login.html
│   │       └── register.html
│   ├── routes/                        # Arquivos de definição de rotas da API
│   │   ├── habit.js
│   │   └── user.js
├── README.md                          # Documentação do projeto


```
## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Antes de começar, é preciso ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/) (opcional, para clonar o repositório)
- Um editor de código, como [Visual Studio Code](https://code.visualstudio.com/)
- Um navegador (ex: Google Chrome)
- Ferramenta para testes de API, como [Postman](https://www.postman.com/)

---

### 📥 Passo a Passo

#### 1. Clone o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/bvianas/Projeto-SENAC.git
```

#### 2. Acesse a pasta do projeto
```bash
cd Projeto-SENAC
```
#### 3. Acesse o diretório do backend
```bash
cd monitor-habitos/backend
```
#### 4. Instale as dependências do projeto
```bash
npm install
```
#### 5. Inicie o servidor backend
```bash
node server.js
```

### Se tudo estiver correto, a seguinte mensagem aparecerá no terminal:

```bash
Servidor rodando em http://localhost:3000
```

## Referências 🛠️

| Tópicos | Descrição |
|--------|-----------|
|[Commits](https://github.com/iuricode/padroes-de-commits) | Padrões de commits |
|[README](https://blog.rocketseat.com.br/como-fazer-um-bom-readme/) | Como fazer um bom README |
|[Postman](https://www.postman.com/) | Plataforma para teste de API |




## Desenvolvido por: ✍️

 
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bvianas"><img src="https://avatars.githubusercontent.com/u/138331430?v=4" width="100px;" alt="Bianca Viana"/><br /><sub><b>Bianca Viana</b></sub></a><br />
      </td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/CarolineDidone"><img src="https://avatars.githubusercontent.com/u/134716920?v=4" width="100px;" alt="Caroline Didone"/><br /><sub><b>Caroline Didone</b></sub></a><br />
      </td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/lilianecardeal"><img src="https://avatars.githubusercontent.com/u/143633881?v=4" width="100px;" alt="Liliane Cardeal"/><br /><sub><b>Liliane Cardeal</b></sub></a><br />
      </td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/larissacara"><img src="https://avatars.githubusercontent.com/u/159551280?v=4" width="100px;" alt="Larissa Cara"/><br /><sub><b>Larissa Cara</b></sub></a><br />
      </td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Kawanamartins"><img src="https://avatars.githubusercontent.com/u/178830487?v=4" width="100px;" alt="Kawana Martins"/><br /><sub><b>Kawana Martins</b></sub></a><br />
      </td>
    </tr>
  </tdbody>
</table>

