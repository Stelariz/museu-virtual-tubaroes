# Imagens e capturas de tela

Esta pasta guarda as imagens usadas no `README.md` (capturas de tela, QR Code etc.). **Ela está vazia de propósito**: capture as imagens com o museu aberto no seu computador.

## Como tirar capturas de tela (Windows)

1. Abra o museu por um servidor local e, se quiser a melhor aparência, use a qualidade **Alta** (botão ⚙ Gráficos) e a janela do navegador maximizada.
2. Posicione a câmera e aperte **`Windows + Shift + S`**; selecione a área (ou a tela inteira).
3. Abra o **Paint** ou outro editor, cole (`Ctrl + V`) e salve como **PNG** (ou JPG).

## Sugestões de capturas

| Nome sugerido | O que mostrar |
| :-- | :-- |
| `01-descoberta.png` | Visão inicial da região Descoberta, com a interface |
| `02-ficha-tubarao.png` | Um tubarão com o painel da ficha da espécie aberto |
| `03-diversidade.png` | Região Diversidade com tubarões nadando |
| `04-ecossistema.png` | Recife com cardumes, tartarugas etc. |
| `05-ameacas.png` | Região Ameaças (redes, barril, plásticos) |
| `06-conservacao.png` | Região Conservação |
| `07-contador.png` | Painel “Tubarões descobertos” |
| `qr-code.png` | QR Code do GitHub Pages (opcional) |

## Boas práticas

- Salve em `docs/imagens/` com **nomes sem espaços, acentos ou maiúsculas** (o GitHub Pages diferencia maiúsculas de minúsculas).
- Mantenha cada imagem **abaixo de ~1 MB** (use JPG ou reduza a resolução, por exemplo 1600 px de largura).
- **Não mostre dados pessoais** (abas do navegador com e-mail, nome de usuário do Windows, favoritos).
- Capturas contêm modelos de terceiros: mantenha os créditos em [`../../CREDITOS.md`](../../CREDITOS.md).

## Como incluir no README

No `README.md` há um bloco **comentado** com exemplos. Remova as marcas `<!--` e `-->` e ajuste os nomes. A sintaxe de imagem é:

```markdown
![Descrição curta da imagem](docs/imagens/01-descoberta.png)
```

Depois, envie ao GitHub: `git add .`, `git commit -m "Adiciona capturas de tela"`, `git push`.
