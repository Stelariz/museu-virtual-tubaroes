# Tutorial: publicar o Museu Virtual dos Tubarões no GitHub e no GitHub Pages

Guia para quem **nunca usou Git**. Siga na ordem. Tempo estimado: 40 a 60 minutos (o envio dos arquivos 3D pode demorar alguns minutos).

> **Antes de qualquer envio, conclua o [`CHECKLIST_PUBLICACAO.md`](CHECKLIST_PUBLICACAO.md).** Há pendências de licença (música e quatro modelos 3D) que precisam ser resolvidas **antes** de o repositório ficar público.

---

## Conceitos básicos (leia uma vez)

| Palavra | O que significa, em linguagem simples |
| :-- | :-- |
| **Git** | Programa instalado no seu computador que registra o histórico do projeto (as “versões”). |
| **GitHub** | Site onde o projeto fica guardado online e pode ser compartilhado. |
| **Repositório** | A pasta do projeto + todo o seu histórico. |
| **Commit** | Uma “fotografia” do projeto naquele momento, com uma mensagem que descreve a mudança. |
| **Push** | Enviar os commits do seu computador para o GitHub. |
| **GitHub Pages** | Serviço gratuito do GitHub que transforma o repositório em um site, com um link que qualquer pessoa pode abrir. |
| **Terminal** | Janela onde você digita comandos e aperta `Enter`. Dica: no terminal do Windows, **clicar com o botão direito cola** o texto copiado. |

**Substituições:** em todo o tutorial, `SEU-USUARIO` é o seu nome de usuário do GitHub, e `URL_DO_REPOSITORIO` é o endereço do repositório que você vai copiar no passo B6.

---

## Parte A — Preparação

### A1. Criar uma conta no GitHub (se ainda não tiver)

1. Acesse <https://github.com/signup> e crie a conta (e-mail, senha, nome de usuário). Confirme o e-mail.
2. **Privacidade do e-mail (recomendado):** em *Settings → Emails*, marque **Keep my email addresses private**. O GitHub mostrará um e-mail do tipo `1234567+SEU-USUARIO@users.noreply.github.com`. Use esse endereço no passo A4 para não expor seu e-mail pessoal nos commits públicos.

### A2. Instalar o Git

1. Acesse <https://git-scm.com/download/win> e baixe o instalador (*64-bit Git for Windows Setup*).
2. Abra o instalador e clique em **Next** nas telas, **mantendo as opções recomendadas**. Só preste atenção em duas delas:
   - *Choosing the default editor used by Git*: escolha **Visual Studio Code** (se tiver) ou **Notepad**. Evite o *Vim*, que é difícil para iniciantes.
   - *Adjusting your PATH environment*: deixe a opção recomendada (**Git from the command line and also from 3rd-party software**).
3. Clique em **Install** e depois em **Finish**.

### A3. Verificar se o Git foi instalado

1. Abra o menu Iniciar, digite **cmd** e abra o **Prompt de Comando**.
2. Digite e pressione `Enter`:

   ```bash
   git --version
   ```

3. Deve aparecer algo como `git version 2.45.0.windows.1`. Se aparecer *“não é reconhecido como um comando”*, feche o terminal e abra outro; se continuar, reinicie o computador.

### A4. Configurar seu nome e e-mail no Git

Isso só precisa ser feito **uma vez** no computador. Esses dados aparecem nos commits.

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

(Use o e-mail `…@users.noreply.github.com` do passo A1, se ativou a privacidade.) Para conferir:

```bash
git config --global --list
```

### A5. Organizar a pasta final do museu

1. Descompacte o arquivo `museu-virtual-tubaroes.zip`.
2. Coloque a pasta em um local simples, por exemplo `C:\Projetos\museu-virtual-tubaroes`. **Evite** pastas sincronizadas (OneDrive, Google Drive): com muitos arquivos grandes elas deixam tudo lento.
3. Entre na pasta e confira que o `index.html` está **diretamente** nela. O correto é:

   ```text
   C:\Projetos\museu-virtual-tubaroes\index.html     ✔
   C:\Projetos\museu-virtual-tubaroes\models\...     ✔
   ```

   e **não** `…\museu-virtual-tubaroes\museu-virtual-tubaroes\index.html` (pasta dentro de pasta).
4. Abra o `README.md` em um editor (Bloco de Notas ou VS Code) e preencha os campos marcados com **[PREENCHER]** (autoria, professor, semestre). Faça o mesmo no `CREDITOS.md` (dados da música).
5. **Não** copie para esta pasta o pacote `modelos-restritos-uso-local.zip` se for enviar os arquivos de outra forma que não seja o Git (veja o aviso abaixo).

> ⚠️ **Aviso importante:** o arquivo `.gitignore` impede que o **Git** envie os quatro modelos com licença restrita. Mas, se você enviar arquivos **arrastando-os para o site do GitHub** (upload pelo navegador), o `.gitignore` **não** é aplicado. Por isso, use sempre os comandos deste tutorial e **nunca** arraste a pasta inteira para o site se os modelos restritos estiverem nela.

### A6. Abrir o terminal na pasta correta

Todos os comandos Git precisam ser executados **dentro da pasta do projeto**.

1. Abra a pasta `museu-virtual-tubaroes` no **Explorador de Arquivos** (a que contém o `index.html`).
2. Clique na **barra de endereço** (onde aparece `C:\Projetos\museu-virtual-tubaroes`), apague o texto, digite `cmd` e pressione `Enter`.
3. O terminal abre já nessa pasta. A linha do terminal deve terminar assim:

   ```text
   C:\Projetos\museu-virtual-tubaroes>
   ```

4. Confirme com o comando abaixo: a lista deve mostrar `index.html`, `README.md`, `models`, `lib`, `audio`…

   ```bash
   dir
   ```

(Alternativas: no Windows 11, botão direito dentro da pasta → **Abrir no Terminal**; ou, com o Git instalado, botão direito → **Git Bash Here**.)

### A7. Teste final no seu computador (recomendado)

Antes de publicar, abra o museu por um servidor local para ter certeza de que está tudo certo. Veja a seção *Como executar o projeto localmente* do [`README.md`](../README.md) (resumo: `python -m http.server 8000` e abrir `http://localhost:8000`). Lembre: **abrir o `index.html` com duplo clique não funciona** (os modelos 3D não carregam).

> Sem os 4 modelos restritos, o pequeno quadro de status do museu mostrará **“falhou: …”** para eles. É esperado na versão pública.

---

## Parte B — Criar o repositório no GitHub

1. Acesse <https://github.com> e faça login.
2. Clique no botão **+** (canto superior direito) e em **New repository**.
3. Em **Repository name**, digite exatamente: `museu-virtual-tubaroes`
4. (Opcional) Em **Description**, escreva: *Museu virtual 3D sobre tubarões e conservação dos oceanos — projeto acadêmico, FATEC São Carlos.*
5. Marque **Public** (público).
6. **Não marque** nenhuma destas opções: *Add a README file*, *Add .gitignore*, *Choose a license*. O seu projeto **já tem** esses arquivos; se o GitHub criar outros, haverá conflito no primeiro envio.
7. Clique em **Create repository**.
8. Na página seguinte (*Quick setup*), com a opção **HTTPS** selecionada, **copie a URL**, que tem este formato:

   ```text
   https://github.com/SEU-USUARIO/museu-virtual-tubaroes.git
   ```

   Guarde-a: ela é o `URL_DO_REPOSITORIO` dos próximos comandos.

---

## Parte C — Enviar o projeto pelo Git

Execute os comandos **na pasta do projeto** (passo A6), **um de cada vez**, apertando `Enter` e esperando terminar.

**1. Iniciar o repositório local**

```bash
git init
```

Cria uma pasta oculta `.git` que passa a guardar o histórico. Resposta esperada: *Initialized empty Git repository in …*

**2. Marcar todos os arquivos para o próximo commit**

```bash
git add .
```

O ponto (`.`) significa “tudo desta pasta”. O Git respeita o `.gitignore`. Podem aparecer avisos *“LF will be replaced by CRLF”*: são normais e inofensivos.

**3. Conferir o que será enviado (importante)**

```bash
git status
```

Os arquivos aparecem em verde (*Changes to be committed*). Agora confirme que os **quatro modelos restritos NÃO estão na lista**:

```bash
git ls-files | findstr /i "conch coral_pillar fishing_boat"
git ls-files models/trash
```

- O primeiro comando **não deve mostrar nada**.
- O segundo deve mostrar **somente** `models/trash/barrel.glb`.

Se algum arquivo restrito aparecer, **pare** e consulte o [`CHECKLIST_PUBLICACAO.md`](CHECKLIST_PUBLICACAO.md) antes de continuar.

**4. Criar o commit (a “fotografia” inicial)**

```bash
git commit -m "Publicação inicial do Museu Virtual dos Tubarões"
```

Se aparecer *“Author identity unknown”*, volte ao passo A4.

**5. Nomear a branch principal como `main`**

```bash
git branch -M main
```

(A *branch* é uma linha de histórico; `main` é o nome padrão usado pelo GitHub.)

**6. Conectar a pasta ao repositório do GitHub**

```bash
git remote add origin URL_DO_REPOSITORIO
```

Troque `URL_DO_REPOSITORIO` pela URL copiada no passo B8. Exemplo:

```bash
git remote add origin https://github.com/SEU-USUARIO/museu-virtual-tubaroes.git
```

(*origin* é só o apelido do endereço remoto.)

**7. Enviar para o GitHub**

```bash
git push -u origin main
```

- Na primeira vez, o Windows abrirá uma janela do **Git Credential Manager** pedindo para entrar no GitHub: escolha **Sign in with your browser** e autorize no navegador.
- Se pedir **senha**, o GitHub **não aceita a senha da conta**: use um *Personal Access Token* (veja “Problemas de autenticação”, na Parte F).
- O envio pode levar **vários minutos** (são ~150 MB). Aparecerá algo como `Writing objects: 100% …`. **Não feche** a janela até voltar o cursor do terminal.
- Resposta esperada no final: *`branch 'main' set up to track 'origin/main'`*.

**8. Conferir no site**

Atualize a página do repositório no navegador (`F5`). Os arquivos e o `README.md` devem aparecer.

> ❗ **Não use `git push --force`** para resolver erros. Esse comando sobrescreve o histórico remoto e pode apagar trabalho. Se algo falhar, veja a Parte F.

---

## Parte D — Publicar no GitHub Pages

1. No repositório, clique na aba **Settings** (Configurações).
2. No menu da esquerda, clique em **Pages**.
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
4. Em **Branch**, selecione **main** e, ao lado, a pasta **/ (root)**.
5. Clique em **Save**.
6. Aguarde de 1 a 10 minutos (a primeira publicação costuma ser a mais demorada). Você pode acompanhar na aba **Actions** (um fluxo chamado *pages build and deployment* ficará verde quando terminar).
7. Volte a *Settings → Pages*: aparecerá a mensagem **“Your site is live at …”** com o endereço, no formato:

   ```text
   https://SEU-USUARIO.github.io/museu-virtual-tubaroes/
   ```

8. **Teste:** abra o endereço, clique em **Mergulhar** e confira os modelos, os painéis e a música. Na primeira visita o carregamento demora (~150 MB).
9. **Atualize o README:** troque o marcador do link em *Como acessar o museu online* pelo endereço real (veja a Parte E para enviar a mudança).

---

## Parte E — Atualizações futuras

Sempre que alterar algum arquivo do projeto (por exemplo, o `README.md`), faça, na pasta do projeto:

```bash
git status
```
Mostra o que mudou (arquivos em vermelho = ainda não marcados).

```bash
git add .
```
Marca as mudanças.

```bash
git commit -m "Descrição curta da atualização"
```
Cria o commit. Exemplo de mensagem: `Adiciona link do GitHub Pages ao README`.

```bash
git push
```
Envia para o GitHub. Depois do primeiro `push -u`, basta `git push`.

**Ver o site atualizado:** o GitHub Pages leva alguns minutos para publicar, e o navegador guarda cópias antigas (*cache*). Para forçar a atualização:

- **`Ctrl + F5`** (ou `Ctrl + Shift + R`) na página do museu; ou
- abrir em **janela anônima/privada**; ou
- acrescentar ao endereço um parâmetro, como `…/museu-virtual-tubaroes/?v=2`.

> Dica: evite refazer commits de arquivos `.glb`/`.mp3` sem necessidade: cada versão fica guardada no histórico e o repositório vai crescendo.

---

## Parte F — Solução de problemas

### Modelos 3D que não carregam / “o museu abre sem os animais”
- **Você abriu o `index.html` com duplo clique** (endereço `file:///…`)? O navegador bloqueia a leitura dos arquivos (erro de CORS no Console). **Solução:** use um servidor local (README) ou o endereço do GitHub Pages.
- Veja a causa exata: aperte **F12** → aba **Console** (erros) e **Rede/Network** (arquivos que deram 404).
- Na versão pública, é **esperado** que o quadro de status mostre *“falhou: …”* para o coral-pilar, a concha, o barco e os resíduos (modelos não distribuídos por licença).

### Caminhos incorretos e erros 404
- O GitHub Pages **diferencia maiúsculas de minúsculas**: `Models/` é diferente de `models/`. Os nomes do projeto estão todos em minúsculas; não renomeie arquivos.
- Mantenha a estrutura: `index.html` na **raiz**, com `lib/`, `models/` e `audio/` ao lado.
- Todos os caminhos do museu são **relativos** (não começam com `/`), então funcionam em `…github.io/museu-virtual-tubaroes/`.
- Erro 404 ao abrir o site: a pasta de publicação precisa ser **/ (root)** e o `index.html` precisa estar na raiz; confira o nome do repositório e do usuário no endereço.
- Um erro 404 para `favicon.ico` aparece no Console e é **inofensivo** (o museu não tem ícone de aba).

### A música não toca
- Os navegadores só permitem áudio **após um clique**: clique em **Mergulhar** na tela inicial.
- Olhe a legenda do painel de som: *“Música: arquivo musica-ambiente.mp3”* (arquivo carregado) ou *“trilha gerada (nenhum arquivo em audio/)”* (arquivo ausente).
- O arquivo deve se chamar exatamente `audio/musica-ambiente.mp3` (cuidado com **extensão duplicada**, como `.mp3.mp3`, que acontece quando o Windows esconde extensões). Para ver as extensões: Explorador de Arquivos → *Exibir → Mostrar → Extensões de nomes de arquivos*.
- Confira se o botão 🎵 e os controles de volume estão ligados e se o som do navegador/computador não está mudo.

### Arquivos maiores que os limites do GitHub
- O GitHub **bloqueia arquivos acima de 100 MB** (e avisa a partir de 50 MB). **Nenhum arquivo do projeto passa de 20 MB.**
- Se um dia acrescentar um arquivo grande e o `push` for recusado (*“exceeds GitHub's file size limit of 100.00 MB”*) logo no **primeiro envio**, apague a pasta oculta `.git`, remova o arquivo grande e refaça os passos da Parte C.
- O site do GitHub Pages também tem limite de tamanho (cerca de 1 GB) e de tráfego mensal; o museu usa ~150 MB.

### Problemas de autenticação
- *“Authentication failed”* / *“Password authentication is not supported”*: o GitHub não aceita a senha da conta no Git. Use o login pelo navegador (Git Credential Manager) ou um **Personal Access Token**: no GitHub, *Settings → Developer settings → Personal access tokens* → gerar um token com permissão de escrita no conteúdo do repositório; use-o **no lugar da senha**. **Nunca** publique o token em arquivos do projeto, nem compartilhe.
- *“Permission denied” / erro 403*: você pode estar logado em **outra conta**. No Windows: Painel de Controle → *Gerenciador de Credenciais → Credenciais do Windows* → remova as entradas `github.com` e tente o `git push` de novo.

### Erros ao executar o `git push`
| Mensagem | O que significa / o que fazer |
| :-- | :-- |
| `fatal: not a git repository` | O terminal **não está na pasta do projeto**. Refaça o passo A6. |
| `Author identity unknown` | Faltou configurar nome/e-mail (passo A4). |
| `src refspec main does not match any` | Ainda não existe commit. Rode `git add .` e `git commit -m "…"`; depois `git push -u origin main`. |
| `remote origin already exists` | Já existe um endereço configurado. Use `git remote set-url origin URL_DO_REPOSITORIO` (substituindo a URL). |
| `Updates were rejected … remote contains work that you do not have locally` | O repositório online tem algo que o seu não tem (provavelmente você marcou *Add a README* no GitHub). Rode `git pull origin main --allow-unrelated-histories`; se abrir um editor para a mensagem de mesclagem, salve e feche; depois `git push`. **Não use `--force`.** |
| `Could not resolve host: github.com` | Sem internet ou rede bloqueada (a rede da escola pode bloquear). Tente outra rede. |
| `RPC failed; HTTP 408/500` ou `the remote end hung up unexpectedly` | Envio grande demais de uma vez. Rode `git config --global http.postBuffer 524288000` e tente `git push` de novo; se persistir, envie em partes (por exemplo, `git add models/sharks`, `git commit -m "Tubarões"`, `git push`, e assim por diante com as outras pastas). |
| `nothing to commit, working tree clean` | Não há mudanças novas para enviar. |

### O GitHub Pages mostra uma versão antiga
1. Veja na aba **Actions** se a publicação terminou (ícone verde).
2. Espere alguns minutos; depois use **`Ctrl + F5`**, uma janela anônima ou `?v=2` no endereço.
3. Confirme em *Settings → Pages* que a fonte é **main / (root)** e que o commit mais recente aparece no repositório.

### Diferença entre abrir o `index.html` diretamente e usar HTTP
Abrir o arquivo com duplo clique usa o protocolo `file://`: o navegador **proíbe** a página de ler outros arquivos do disco (modelos `.glb`, música), por segurança. Em um servidor — local (`http://localhost:8000`) ou o GitHub Pages (`https://…`) — a leitura é permitida. Por isso o museu **só funciona completo via HTTP/HTTPS**.

---

## Parte G — QR Code e compartilhamento

O QR Code é apenas uma forma de codificar o **endereço do GitHub Pages**. Quem escanear com a câmera do celular abre o museu no navegador, **sem instalar nada e sem localhost**.

1. Copie o endereço do museu (`https://SEU-USUARIO.github.io/museu-virtual-tubaroes/`).
2. Em um gerador gratuito de QR Code (pesquise por *gerador de QR code gratuito*), cole o endereço e gere a imagem. Prefira geradores que **não exijam cadastro** e que criem QR Code **estático** (os “dinâmicos” podem expirar ou virar serviço pago).
3. Baixe a imagem em **alta resolução** (PNG ou SVG).
4. **Teste** o QR Code com pelo menos dois celulares antes de imprimir ou divulgar. Ao imprimir, deixe um tamanho de pelo menos 3 × 3 cm, com bom contraste e margem em branco ao redor.
5. Se quiser, guarde a imagem em `docs/imagens/` e inclua no README (veja `docs/imagens/LEIA-ME.md`).

**Sobre celulares — leia com atenção:**

- O museu **não foi otimizado nem testado em dispositivos móveis**; não há garantia de funcionamento perfeito. Só existe um botão “avançar” para toque (não há joystick nem controles completos).
- Cada visita baixa cerca de **150 MB**: use **Wi-Fi**. Aparelhos mais simples podem travar ou fechar a página por falta de memória.
- Em celulares, o museu seleciona automaticamente a qualidade **Baixa**.
- Antes de divulgar para turmas, **teste em 2 ou 3 celulares reais** (um Android e um iPhone). Veja as recomendações em [`ANALISE_MOBILE_E_PUBLICACAO.md`](ANALISE_MOBILE_E_PUBLICACAO.md).

---

## Resumo rápido dos comandos

```bash
# Uma única vez, no computador
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Primeira publicação (na pasta do projeto)
git init
git add .
git status
git commit -m "Publicação inicial do Museu Virtual dos Tubarões"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main

# Atualizações futuras
git status
git add .
git commit -m "Descrição da atualização"
git push
```
