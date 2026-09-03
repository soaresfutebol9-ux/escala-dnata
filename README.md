# Escala — Operações de Pátio (PWA)

Este pacote transforma o app que você usava dentro do Claude num site
independente, instalável no celular, com os dados salvos num banco de
dados na nuvem (Firebase) — assim toda a equipe vê a mesma escala,
em tempo real, em qualquer aparelho.

## O que é o Firebase?

É um serviço gratuito do Google para hospedar dados na nuvem. Antes,
o app salvava os dados usando um recurso interno do Claude
(`window.storage`), que só existe dentro do Claude. Fora do Claude,
o app precisa de um banco de dados próprio — o Firestore (parte do
Firebase) faz esse papel, de graça para o volume de dados desse app.

Nenhum passo aqui envolve programação — é só clicar, copiar e colar.

---

## Passo 1 — Criar o projeto no Firebase

1. Acesse **https://console.firebase.google.com** e faça login com uma
   conta Google.
2. Clique em **"Criar um projeto"** (ou "Add project").
3. Dê um nome, por exemplo `escala-patio`. Pode desativar o Google
   Analytics (não é necessário para este app).
4. Clique em **Criar projeto** e aguarde.

## Passo 2 — Criar o banco de dados (Firestore)

1. No menu lateral do projeto, vá em **Build → Firestore Database**.
2. Clique em **"Criar banco de dados"**.
3. Escolha a localização mais próxima (ex: `southamerica-east1` — São
   Paulo) e clique em Avançar.
4. Em **modo de segurança**, escolha **"Iniciar no modo de teste"**.
5. Depois de criado, vá na aba **"Regras"** (Rules) e substitua o
   conteúdo por:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   Clique em **Publicar**.

   ⚠️ **Importante:** o modo de teste padrão do Firebase expira
   sozinho em 30 dias e bloqueia tudo depois disso — a regra acima
   substitui o modo de teste por uma regra permanente. Como você
   pediu um app sem login, qualquer pessoa que descobrir a URL do
   banco poderia ler ou alterar os dados. Para uma escala interna de
   equipe isso é um risco baixo, mas é bom saber que ele existe. Se um
   dia quiser adicionar um login simples, é só avisar.

## Passo 3 — Pegar as chaves de configuração

1. No menu lateral, clique na engrenagem ⚙️ → **"Configurações do
   projeto"**.
2. Role até **"Seus apps"** e clique no ícone **`</>`** (Web) para
   criar um app da Web.
3. Dê um apelido (ex: `escala-web`) e clique em **Registrar app**.
   Não precisa marcar a opção de Hosting.
4. O Firebase vai mostrar um bloco de código com `const
   firebaseConfig = { ... }`. Copie **só o conteúdo entre chaves**.
5. Abra o arquivo **`firebase-config.js`** deste pacote e substitua o
   objeto de exemplo pelos valores copiados. O arquivo final deve
   ficar parecido com:

   ```js
   window.firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "escala-patio-xxxxx.firebaseapp.com",
     projectId: "escala-patio-xxxxx",
     storageBucket: "escala-patio-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

6. Salve o arquivo.

## Passo 4 — Subir os arquivos no GitHub Pages

1. Crie uma conta em **https://github.com** se ainda não tiver.
2. Crie um repositório novo (botão **New repository**), por exemplo
   `escala-patio`. Pode deixar como **público**.
3. Envie todos os arquivos desta pasta para o repositório:
   - `index.html`
   - `firebase-config.js` (já com suas chaves)
   - `manifest.json`
   - `service-worker.js`
   - pasta `icons/` (com os 3 arquivos `.png`)

   O jeito mais simples: na página do repositório, clique em
   **"Add file" → "Upload files"** e arraste tudo (mantendo a pasta
   `icons`).
4. Vá em **Settings → Pages** (barra lateral do repositório).
5. Em **"Branch"**, selecione `main` e a pasta `/ (root)`, depois
   clique em **Save**.
6. Aguarde 1–2 minutos. O GitHub vai te dar um link do tipo:
   `https://SEU-USUARIO.github.io/escala-patio/`

Esse já é o app funcionando, instalável e compartilhável com a
equipe.

## Passo 5 (opcional) — Domínio próprio (ex: escaladopatio.com)

1. Registre o domínio em qualquer registrador (ex: Registro.br, se
   for `.com.br`, ou Namecheap/GoDaddy para `.com`).
2. No painel do domínio, crie os registros DNS apontando para o
   GitHub Pages (o GitHub explica os valores exatos em
   **Settings → Pages → Custom domain** depois que você digitar o
   domínio ali).
3. Em **Settings → Pages → Custom domain**, digite seu domínio e
   salve. Aguarde a propagação (pode levar algumas horas).

---

## Instalando no celular

Depois que o site estiver no ar (via GitHub Pages ou domínio
próprio):

- **Android (Chrome):** abra o link → menu (⋮) → **"Instalar app"** /
  **"Adicionar à tela inicial"**.
- **iPhone (Safari):** abra o link → botão de compartilhar →
  **"Adicionar à Tela de Início"**.

O app abre em tela cheia, com ícone próprio, como um app nativo — e
os dados continuam sincronizados entre todos os aparelhos.

## Atualizando o app no futuro

Sempre que eu (ou você) alterar `index.html`, basta subir o arquivo
novo no GitHub (substituindo o antigo) e, no `service-worker.js`,
trocar o número em `CACHE_VERSION` (ex: de `'v1'` para `'v2'`) — isso
garante que o celular das pessoas baixe a versão atualizada em vez de
ficar preso numa versão antiga guardada em cache.
