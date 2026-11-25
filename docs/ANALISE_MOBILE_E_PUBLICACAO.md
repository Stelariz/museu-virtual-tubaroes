# Análise: publicação no GitHub Pages e versão para celular (QR Code)

> **Nota (versão pública):** os números abaixo são da versão completa de desenvolvimento (165 MB, 41 arquivos). Na versão pública do repositório, sem quatro modelos de licença restrita, são **~154 MB e 45 arquivos** (incluindo a documentação), e nenhum arquivo passa de 20 MB.


Nada de mobile completo foi implementado nesta etapa. Este documento só analisa e recomenda.

## 1. Tamanho do projeto e GitHub
- Total: **165 MB** em 41 arquivos (modelos 164 MB; código/HTML < 1 MB; `lib/` inclui o three.js, então não depende de CDN).
- **Nenhum arquivo passa de 50 MB; nenhum passa de 100 MB** (maiores: octopus 19 MB, tartaruga-de-pente 14 MB, coral chromaflare 13,5 MB, coral pillar 10 MB, tartaruga-cabeçuda 10 MB).
  Os arquivos originais enviados (polvo 134 MB, barco 98 MB etc.) NÃO estão no projeto; se forem versionados, o GitHub bloqueia arquivos acima de 100 MB.
- Limites do GitHub a considerar: arquivo ≤ 100 MB (aviso a partir de 50 MB); repositório recomendado ≤ ~1 GB; site do Pages ≤ 1 GB; ~100 GB/mês de banda (limite flexível).
  Pelo upload no navegador do GitHub, o limite é 25 MB por arquivo (todos cabem), mas prefira Git ou GitHub Desktop para enviar as pastas.
- Não use Git LFS: não é necessário e o Pages pode não servir arquivos LFS como esperado.
- Cada vez que um GLB for recomitado, o histórico do repositório cresce. Evite versionar muitas trocas de modelos.
- Caminhos: as 38 referências a arquivos foram verificadas e coincidem **com a mesma caixa de letras** (o Pages diferencia maiúsculas/minúsculas, o Windows não). Todos relativos, então funcionam em `usuario.github.io/repositorio/`.
- HTTPS vem por padrão no Pages. URL para o QR Code: `https://USUARIO.github.io/REPOSITORIO/?quality=baixa` (celulares já entram em Baixa automaticamente).
- Passos: criar repositório → enviar a pasta do projeto (com `index.html` na raiz) → Settings > Pages > "Deploy from a branch" (main, /root).
- Primeira visita baixa ~165 MB. Em uma rede de 20 Mbps leva ~1 min; em 4G é pesado. Navegador guarda cache; mas recomendo testar na rede da escola.
- GLB/JPG/PNG já são formatos comprimidos: não espere ganho de gzip do servidor.

## 2. Compatibilidade mobile
- Três.js r128 usa WebGL2 quando disponível. Funciona em Chrome/Android e Safari/iOS recentes; aparelhos antigos ou com economia de bateria podem falhar ou perder o contexto WebGL.
- Não funciona abrindo o arquivo do disco no celular; precisa de HTTPS (Pages resolve).
- Áudio: exige toque do usuário (já exigido pelo botão "Mergulhar"). iOS pode suspender o áudio em segundo plano.
- Memória é o maior risco: texturas na GPU ≈ 190 MB na Baixa (1030 MB na Alta). Muitos celulares/Safari encerram a aba com esse consumo, e mais ainda durante a decodificação de texturas 4096 px.

## 3. O que adaptar (não implementado)
1. **Controles por toque**: hoje há arrastar para olhar e um botão "avançar". Faltam joystick virtual para andar, subir/descer e girar; considerar giroscópio opcional.
2. **Painéis educativos**: já usam até 92% da largura e rolagem interna; ajustar fonte, botão × maior (≥44 px), altura em `dvh` e orientação retrato/paisagem. Marcadores (30 px) e menu inferior precisam de áreas de toque maiores.
3. **Interface**: menu de regiões, qualidade e áudio em um menu recolhível; ocultar dicas de teclado.
4. **Qualidade**: criar preset "Celular" (resolução 0,6–0,75×, sem sombras/cáusticas, ~300 partículas, fauna secundária mínima, distância de corte ~50–60 m).
5. **Pacote leve de modelos** (o ponto mais importante):
   - Tubarões decimados para ≤ 15 mil triângulos e texturas 512–1024 px (cada um poderia ficar em 1–3 MB).
   - Corais GLB substituídos por poucos modelos leves ou pelos procedurais; fauna secundária reduzida.
   - Compressão: meshopt ou Draco para geometria e KTX2/Basis para texturas (costuma reduzir 3–5×).
   - Meta realista: 20–40 MB no total, com carregamento por região (carregar só a região atual) e barra de progresso.
6. **Estabilidade**: tratar perda de contexto WebGL (mensagem + botão recarregar), ajustar viewport (`100dvh`), evitar o gesto de rolagem da página.

## 4. Ordem recomendada
1. Terça-feira: apresentar no notebook (Baixa/Média) a partir do servidor local.
2. Depois: publicar no Pages e testar em 2–3 celulares reais (um Android intermediário e um iPhone).
3. Só então criar a versão mobile (pacote leve + toque + painéis).
