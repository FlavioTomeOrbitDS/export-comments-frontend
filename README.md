## Orbit Export Comments Frontend

## Descrição do Projeto:
---

O Orbit Export Comments é um web app que se recebe uma lista no formato .xlsx do usuário e utiliza a API Export Comments para extrair os comentários de cada link de rede social informado.

O frontend deste projeto foi gerado utilizando o Angular CLI na versão 13.3.1.

O site gerado pelo projeto possui 3 páginas:

1. A página de login, na qual o login é feito por meio de um usuário jpreviamente cadastrado.
2. A página principal consiste em um text input botão para que o usuário realize o upload de um arquivo no formato .xlsx contento uma lista de urls de redes sociais das quais serão exportados os comentários. Assim que o usuário faz o upload do arquivo, um botão para iniciar o processo de exportação é mostrado ao usuário.
3. A terceira e última página é mostrada assim que o usuário inicia a operação de exportação. Essa página mostra o status dos downloads e informa quando a operação é finalizada, mostrando um botão para que o usuário retorne à página principal.

## Instalação e Configuração
---
### Pré-requisitos

Para executar este projeto, é necessário ter o seguinte software instalado em sua máquina:

* Node.js (v14.18.1 ou superior)
* Angular CLI (v13.0.4 ou superior)

### Instalação
1. Clone o repositório do projeto no seu computador.
```
  git clone https://github.com/FlavioTomeOrbitDS/export-comments-frontend
```

2. Abra o terminal ou prompt de comando e navegue até o diretório raiz do projeto.
```
 ...\export-comments-frontend>
```
3. Execute o comando npm install para instalar todas as dependências do projeto.
```
 ...\export-comments-frontend>npm install
```

## Executando o projeto
---
Para executar o projeto, execute o comando ng serve na raiz do projeto. Em seguida, abra o navegador e acesse http://localhost:4200/ para visualizar a página de login.
