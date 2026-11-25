# Checklist antes de tornar o repositório público

Marque cada item (`[x]`) antes de publicar. Os itens da seção 1 são **bloqueios**: não publique antes de resolvê-los.

---

## 1. Bloqueios (licenças e direitos autorais)

### 1.1 Quatro modelos 3D que não podem ser redistribuídos

Os metadados gravados pelo Sketchfab dentro dos próprios arquivos mostram que **quatro modelos têm licenças que não permitem publicá-los** em um repositório público
(detalhes e links em [`../CREDITOS.md`](../CREDITOS.md)):

| Arquivo | Licença nos metadados | Problema |
| :-- | :-- | :-- |
| `models/corals/coral_pillar.glb` | CC BY-NC-ND 4.0 | **ND = sem obras derivadas.** O arquivo foi otimizado (adaptado), então não pode ser distribuído modificado. |
| `models/fauna/conch.glb` | CC BY-NC-ND 4.0 | Idem. |
| `models/boat/fishing_boat.glb` | Sketchfab Standard | Não é Creative Commons; em geral não autoriza redistribuir os arquivos do modelo. |
| `models/trash/trash.glb` | Sketchfab Standard | Idem. |

- [ ] **Decidi o que fazer com eles.** Opções: **(a)** manter fora do repositório (já está assim no pacote preparado e no `.gitignore`) e usá-los só no seu computador, com o pacote `modelos-restritos-uso-local.zip`; **(b)** pedir **autorização por escrito** ao autor (mensagem pelo Sketchfab) para publicar; **(c)** substituí-los por modelos com licença **CC BY** (posso ajudar numa próxima etapa).
- [ ] Rodei `git ls-files | findstr /i "conch coral_pillar fishing_boat"` e **nada apareceu**; `git ls-files models/trash` mostra **só `barrel.glb`**.
- [ ] Não enviei arquivos pelo site do GitHub (upload por arrastar), porque ele ignora o `.gitignore`.

> Observação: a licença “Sketchfab Standard” e os termos do Sketchfab podem mudar; leia os termos atuais em <https://sketchfab.com/licenses> antes de decidir.

### 1.2 Música (Suno AI)

A faixa `audio/musica-ambiente.mp3` foi gerada com o Suno AI. **As regras dependem do plano usado no momento da geração** e podem mudar com o tempo. Antes de publicá-la:

- [ ] Descobri **qual plano** eu tinha quando gerei a faixa (gratuito ou pago) e a **data** da geração.
- [ ] Li os **Termos de Serviço atuais** do Suno e a página de licenciamento/FAQ do plano correspondente: <https://suno.com> (procure *Terms of Service* e *Pricing/FAQ*).
- [ ] Verifiquei: **quem detém os direitos** da faixa; se o uso **público/online** é permitido; se há restrição a **uso comercial** (em geral, planos gratuitos têm restrições); se há exigência de **atribuição/crédito** (por exemplo, indicar que foi criada com Suno).
- [ ] Guardei **prints/links** das regras e do histórico de geração (a prova de qual plano eu tinha).
- [ ] Preenchi a tabela da música em [`../CREDITOS.md`](../CREDITOS.md) (plano, data, link/ID, termos verificados em…). **Não** usei rótulos como “royalty-free” sem confirmação.
- [ ] Conferi as **etiquetas (metadados) do MP3** — hoje o título é “Tranquil Depths” e o artista é “Stelaris” — e confirmei que estão corretas para o crédito que quero dar.
- [ ] **Se não puder redistribuir a faixa:** removi o `#` da linha `# audio/musica-ambiente.mp3` no `.gitignore` (antes do primeiro `git add .`). O museu continua funcionando, com uma trilha ambiente gerada pelo navegador.

### 1.3 Autoria, instituição e licença do código

- [ ] Preenchi **autoria, professor(a) e semestre** no `README.md` (campos **[PREENCHER]**).
- [ ] Se o trabalho foi **em grupo**, todos os autores concordam em publicar.
- [ ] Perguntei ao professor/coordenação se a **instituição tem regras** sobre publicação de trabalhos acadêmicos e sobre propriedade intelectual.
- [ ] Li [`LICENCAS.md`](LICENCAS.md) e **decidi a licença do código** (ou decidi, conscientemente, não definir uma por enquanto). **Não há licença MIT automática** neste repositório.

---

## 2. Créditos

- [ ] Li [`../CREDITOS.md`](../CREDITOS.md) inteiro: ele foi **gerado a partir dos metadados dos arquivos 3D**, e prevalecem sobre a lista preliminar.
- [ ] Conferi se cada autor está listado com título, autor, licença e link.
- [ ] Entendi que modelos **CC BY-NC** (DigitalLife3D: martelo, tubarão-baleia e as duas tartarugas) só podem ser usados **sem fins comerciais**.

### Divergências encontradas entre a lista preliminar de créditos e os arquivos

| Item | Lista preliminar | Arquivo (metadados) | Ação |
| :-- | :-- | :-- | :-- |
| `conch.glb` | “Filamentous Horse Conch”, RISD Nature Lab, CC BY 4.0 | “horse conch”, University of South Florida Libraries, **CC BY-NC-ND 4.0** | Prevaleceu o arquivo; modelo **não publicado** |
| `square_net.glb` | “Fishing-net-1”, noahlunaa | “Square Net”, **HenryMead** | Prevaleceu o arquivo |
| `great_white.glb` | Link `…realistic-white-shark-f2dc12…` | Link de origem `…realistic-shark-e913e5…` | Usado o link do arquivo |
| `coral_aurora`, `coral_lazulight` | Ausentes | Brian Trepanier, CC BY 4.0 | Incluídos em `CREDITOS.md` |
| `coral_pillar.glb` | Ausente | CC BY-NC-ND 4.0 | **Não publicado** |
| `fishing_boat.glb`, `trash.glb` | Ausentes | Sketchfab Standard | **Não publicados** |
| `barrel.glb` | Ausente | Merle Palk, CC BY 4.0 | Incluído |
| Pastas | `models/reef/`, `models/threats/`, `assets/audio/ambient.mp3` | Reais: `models/corals/`, `models/nets/`, `models/trash/`, `audio/musica-ambiente.mp3` | Usadas as pastas reais (não foram renomeadas, pois o código depende delas) |
| Texto geral | “conformidade com CC BY 4.0 / CC BY-NC” | Há também CC BY-NC-ND e Sketchfab Standard | Texto corrigido |

---

## 3. Privacidade e segurança

- [ ] Ativei o **e-mail privado** no GitHub e usei o e-mail `…@users.noreply.github.com` no Git (tutorial, passo A1/A4).
- [ ] Não há **senhas, tokens, chaves ou dados pessoais** em nenhum arquivo (nada disso foi encontrado no código; revise os textos que você mesmo editar).
- [ ] Capturas de tela que vou incluir **não mostram** dados pessoais (e-mails, abas com informações privadas, nome de usuário do computador).
- [ ] Meu token do GitHub (se usei um) **não** está salvo em arquivos da pasta.

---

## 4. Verificações técnicas

- [ ] Testei o museu **no meu computador, por servidor local** (não por duplo clique): as 5 regiões, uma ficha de tubarão, um ponto educativo, o contador, a música e o menu de qualidade.
- [ ] A estrutura de pastas está intacta (`index.html` na raiz, ao lado de `lib/`, `models/`, `audio/`, `docs/`) e **não há** pasta duplicada.
- [ ] Nomes de arquivos **não foram alterados** (o GitHub Pages diferencia maiúsculas de minúsculas).
- [ ] O repositório tem cerca de **154 MB**, nenhum arquivo passa de **50 MB** (o maior tem ~19 MB), então não há risco com o limite de 100 MB por arquivo.
- [ ] Rodei `git status` antes do commit e a lista está como esperado.
- [ ] Depois de publicar: abri o endereço do GitHub Pages em **outro navegador** e, se possível, em **outro computador**, e testei com `Ctrl + F5`.
- [ ] Entendi que o **celular não foi testado** e que o carregamento é pesado (~150 MB).

---

## 5. Depois de publicar

- [ ] Troquei o marcador do link no `README.md` pelo endereço real do GitHub Pages e enviei a atualização (`git add .`, `git commit`, `git push`).
- [ ] Criei e **testei** o QR Code com pelo menos dois celulares.
- [ ] Adicionei capturas de tela em `docs/imagens/` (opcional) e descomentei as linhas de imagem no `README.md`.
- [ ] Se escolhi uma licença para o código, adicionei o arquivo `LICENSE` e atualizei a seção *Licenças* do `README.md`.
