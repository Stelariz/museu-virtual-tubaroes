# Museu Virtual dos Tubarões

## Como abrir (IMPORTANTE)
Os modelos 3D só carregam por um servidor local. **Não abra o index.html com duplo clique** (Firefox e Chrome bloqueiam por CORS e os modelos "somem").
1. Descompacte a pasta.
2. Abra um terminal dentro dela e rode `python -m http.server 8000` (ou, no VS Code, a extensão Live Server > "Go Live").
3. Acesse `http://localhost:8000` (Chrome ou Edge recomendados).
Não precisa de internet: o three.js está em `lib/`.

## Qualidade gráfica e FPS
Botão **⚙ Gráficos** (canto inferior esquerdo): Alta / Média / Baixa e "Mostrar FPS". Veja DESEMPENHO.md.
URL: `?quality=baixa`, `?quality=media`, `?quality=alta`, `?quality=auto` (ignora a escolha salva), `&fps=1` (mostra o contador).

## Música
Veja `audio/LEIA-ME.txt` (arquivo esperado: `audio/musica-ambiente.mp3` ou `.ogg`). Botão 🎵 liga/desliga; 🔊 silencia tudo.

## Outros parâmetros
`?q=1` (mais corais; o padrão é 0.5), `?undulate=0` (desliga deformações por shader dos animais e das redes).

## Estrutura
- `index.html` — museu | `edu.js` — conteúdo educativo e posições dos pontos | `perf.js` — qualidade e recorte
- `fauna.js` — animais | `pollution.js` — lixo, barril, redes, barco | `lib/` — three.js r128
- `models/` — sharks, corals, fauna, boat, nets, trash | `audio/` — música
- Documentos: DESEMPENHO.md, ANALISE_MOBILE_E_PUBLICACAO.md

## Tubarões descobertos (contador)
- Painel "🦈 Tubarões descobertos: n/8" com barra de progresso, na coluna esquerda da interface (abaixo do quadro de pontos).
- Cada espécie conta uma única vez, ao abrir a ficha do tubarão (ids em `SHARKS`: great_white, hammerhead, whale_shark, tiger, angel, goblin, basking, megamouth). Pontos educativos e outros animais não contam.
- O progresso é salvo no navegador (localStorage, chave `museu.tubaroes.descobertos`); "reiniciar progresso" (com confirmação) apaga somente essa chave.
- Ao chegar a 8/8 aparece, uma única vez e depois que a ficha fecha, a mensagem "Explorador dos Oceanos!".
- Para testar do zero em outro momento: use "reiniciar progresso" ou abra uma janela anônima.
