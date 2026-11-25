# Desempenho — Dell Latitude 5400 (Intel UHD 620)

## O que foi encontrado (versão anterior)
Medição por contagem, sem GPU real (não são FPS): a cena desenhava **~13,3 milhões de triângulos por quadro em qualquer ponto**
(11,5 M da cena + 1,7 M da passada de sombras) e ~300 chamadas de desenho, porque corais e rochas instanciados eram sempre
desenhados, mesmo atrás da câmera ou muito longe. As texturas somavam ~1 GB de memória de vídeo (três tubarões têm texturas de 4096 px).
Uma GPU integrada compartilha a memória RAM e tem pouca largura de banda; esses dois pontos são os prováveis motivos do lag.

## O que foi feito (nada foi removido; os modelos continuam todos no pacote)
- **Recorte por células e por distância** (`perf.js`): corais, rochas, algas, lixo e redes foram divididos em células de 48 m, cada uma com
  esfera de visibilidade; só as visíveis e próximas são desenhadas. Cardumes, fauna e tubarões também ficam ocultos fora do campo de visão/distância.
- **Densidade por qualidade**: Média/Baixa desenham menos instâncias (remove instâncias inteiras, de forma uniforme).
- **Sombras**: Alta = atual; Média = mapa 1024; Baixa = desligadas.
- **Resolução interna**: Alta até 1,75×; Média 1,0×; Baixa 0,75× (com ajuste dinâmico automático entre 0,55× e o valor-base se o FPS cair).
- **Efeitos**: raios de sol 16/10/5, partículas 2400/1400/600, cáusticas desligadas na Baixa, neblina um pouco mais densa na Baixa
  (esconde o corte de distância), animais secundários simultâneos limitados (pesados: ilimitado/6/3), cardumes com 100%/75%/50% dos peixes.
- **Texturas** (na carga): Média/Baixa limitam a 1024 px (e 512 px para fauna/corais/lixo na Baixa).
- **Animações**: esqueletos distantes rodam a cada 2 quadros; animais fora de vista/distância não são atualizados; marcadores de pontos educativos atualizam a cada 2 quadros.
- **Antisserrilhado** desligado na Baixa (só vale ao recarregar a página).

## Estimativas medidas por contagem (triângulos desenhados por quadro, incluindo sombras)
| Ponto de vista | Antes | Alta | Média | Baixa |
|---|---|---|---|---|
| Início | 13,2 M | 2,3 M | 1,4 M | 0,7 M |
| R2 – tubarões | 13,5 M | 0,5 M | 0,5 M | 0,3 M |
| R3 – recife | 13,5 M | 2,6 M | 1,8 M | 1,0 M |
| R4 – lixo | 13,4 M | 1,4 M | 0,9 M | 0,7 M |
| R5 – conservação | 13,3 M | 4,6 M | 2,5 M | 0,9 M |

Memória de texturas na GPU (estimada): Alta ≈ 1030 MB · Média ≈ 390 MB · Baixa ≈ 190 MB.
**Não foi possível medir FPS**: isso depende da sua máquina. Nenhum resultado de FPS foi inventado; os números acima só mostram a redução de carga.

## Qualidade inicial automática
Ordem: `?quality=` na URL → escolha salva no navegador → detecção da GPU (Intel/integrada ou celular → Baixa; NVIDIA/AMD dedicada → Alta; desconhecida → Média).
No Latitude 5400 deve abrir em **Baixa**. O botão **⚙ Gráficos** (canto inferior esquerdo) mostra a qualidade, a GPU detectada e permite trocar.
Troca de qualidade vale na hora, exceto texturas e suavização de bordas (precisam recarregar a página).
`?quality=auto` ignora a escolha salva.

## Como testar no notebook (faça antes de terça-feira)
1. Ligue o carregador e escolha o plano de energia "Melhor desempenho" (Windows). Feche outros programas/abas.
2. Use Chrome ou Edge. Confirme em `chrome://gpu` que "WebGL" está "Hardware accelerated".
3. Inicie o servidor (veja LEIAME.md) e abra `http://localhost:8000/?quality=baixa&fps=1`.
4. Marque "Mostrar FPS" (ou use `&fps=1`). O contador mostra FPS, qualidade, resolução, chamadas e k de triângulos.
5. Anote o FPS em 5 lugares, parado e girando com Q/E por 10 s: início; região 2 (perto dos tubarões); região 3 (recife); região 4 (lixo); região 5.
6. Se ficar abaixo de ~25 FPS na Baixa, me envie os números e o texto da GPU que aparece em ⚙ Gráficos.
7. Se ficar bem acima de 40 FPS na Baixa, teste Média (`?quality=media`) e veja se mantém.
8. Ensaie a apresentação inteira uma vez no notebook, com o servidor já aberto, e deixe a página carregada antes de começar.
Dica: apresente a partir da pasta local (servidor no notebook), não do GitHub Pages — não depende da internet da escola.
