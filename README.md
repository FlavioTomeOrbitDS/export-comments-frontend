## Orbit Export Comments Frontend

## Descrição do Projeto:
---

O Orbit Export Comments é um web app que se recebe uma lista no formato .xlsx do usuário e utiliza a API Export Comments para extrair os comentários de cada link de rede social informado.

O frontend deste projeto foi gerado utilizando o Framework Angular na versão 13.3.1.

O site gerado pelo projeto possui 3 páginas:

  1. A página de login, na qual o login é feito por meio de um usuário jpreviamente cadastrado.
  2. A página principal consiste em um text input botão para que o usuário realize o upload de um arquivo no formato .xlsx contento uma lista de urls de redes sociais das quais serão exportados os comentários. Assim que o usuário faz o upload do arquivo, um botão para iniciar o processo de exportação é mostrado ao usuário.
  3. A terceira e última página é mostrada assim que o usuário inicia a operação de exportação. Essa página mostra o status dos downloads e informa quando a operação é finalizada, mostrando um botão para que o usuário retorne à página principal.

## Páginas da Aplicação
---
### Login page:
![Login Export Comments](https://user-images.githubusercontent.com/115179333/226722490-5d4ff1b1-21cd-4a5f-87b7-78140e36089c.png)

### Index Page:
![Index Export Commentspng](https://user-images.githubusercontent.com/115179333/226722701-543d2bbf-7a11-4c3d-b00e-4aacfd1925ec.png)

### Exporting Page:
1. Fazendo Download:
![exporting](https://user-images.githubusercontent.com/115179333/226722809-26ab4162-05ca-4cfc-b44f-02f11ec4ea3c.png)
2. Download Finalizado:
![exported](https://user-images.githubusercontent.com/115179333/226726119-028830c4-453f-4c13-8f53-f5feb3a6ce3b.png)

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
1. Para executar o projeto, execute o comando ng serve na raiz do projeto.
```
 ...\export-comments-frontend>ng serve
```

2. Em seguida, abra o navegador e acesse http://localhost:4200/ para visualizar a página de login.

## Estrutura do Projeto
---
```
.
├── src/
│   ├── app/
│   │   ├── components/                  # Componentes reutilizáveis em toda a aplicação
│   │   ├── app-routing.module.ts        # Definição das rotas da aplicação
│   │   ├── app.component.html          # Template principal da aplicação
│   │   ├── app.component.ts            # Código do componente principal da aplicação
│   │   └── app.module.ts                # Definição dos módulos da aplicação
│   ├── assets/                          # Arquivos estáticos
```

## Deploy da aplicação no Google Firebase
---
O Google Firebase é uma plataforma de desenvolvimento de aplicativos móveis e web que oferece diversos serviços, incluindo hospedagem de sites estáticos. Para realizar o deploy da aplicação Angular no Firebase, siga os passos abaixo:

1. Crie uma conta no Google Firebase e faça o login no console do Firebase.

2. Crie um novo projeto no Firebase e configure o serviço de hospedagem seguindo as instruções do console.

3. No terminal, execute o comando npm run build para gerar a versão de produção da aplicação. Isso criará uma pasta dist na raiz do projeto com os arquivos otimizados para produção.
```
...\export-comments-frontend>npm run build
```

4. Instale a ferramenta Firebase CLI globalmente na sua máquina com o seguinte comando:
```
...\export-comments-frontend>npm install -g firebase-tools
```
5. Inicie o processo de login com o Firebase CLI executando o comando firebase login. Siga as instruções na tela para autenticar sua conta.

6. No terminal, navegue até a pasta dist criada no passo 3 e execute o comando firebase init. Isso iniciará um processo de configuração do Firebase Hosting para o projeto.
```
...\export-comments-frontend\dist>firebase init
```
7. Siga as instruções na tela para configurar o Firebase Hosting. Quando perguntado sobre qual pasta deve ser usada como diretório público, informe a pasta **dist**.

8. Após a conclusão da configuração, execute o comando firebase deploy para realizar o deploy da aplicação no Firebase Hosting.
```
...\export-comments-frontend>firebase deploy
```

9. Após o deploy ser concluído, a aplicação Angular estará disponível no URL fornecido pelo Firebase Hosting.

Dessa forma, você pode realizar o deploy da aplicação Angular no serviço de hospedagem do Google Firebase. Vale lembrar que é importante seguir as instruções com cuidado e garantir que todas as configurações estejam corretas antes de realizar o deploy.
