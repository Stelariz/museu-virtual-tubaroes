# Orientações sobre licenciamento

> **Este documento não é aconselhamento jurídico.** Ele explica as opções em linguagem simples. **Nenhuma licença foi aplicada ao código** e **não se assume licença MIT** para o projeto.
> Antes de escolher, confirme as respostas da seção 5 (e converse com o professor/instituição, se houver regra sobre propriedade intelectual de trabalhos acadêmicos).

## 1. O projeto tem partes com licenças diferentes

| Parte | Quem detém os direitos | Licença hoje |
| :-- | :-- | :-- |
| Código (`index.html`, `edu.js`, `perf.js`, `fauna.js`, `pollution.js`) | Os autores do projeto (e, possivelmente, a instituição — a confirmar) | **Nenhuma definida** |
| Textos educativos (`edu.js`) | Autores (elaborados com apoio de IA) | **Nenhuma definida** |
| Modelos 3D | Cada autor no Sketchfab | A de cada modelo (CC BY 4.0, CC BY-NC 4.0…); ver [`../CREDITOS.md`](../CREDITOS.md) |
| Música (`audio/musica-ambiente.mp3`) | Depende dos termos do Suno do seu plano | **A confirmar** |
| three.js e módulos (`lib/`) | Autores do three.js | MIT |

Por isso **uma licença do repositório não vale para tudo**: a licença que você escolher cobrirá somente o que for **seu** (código e textos). Modelos, música e three.js seguem as próprias licenças.

## 2. O que acontece se eu não escolher nenhuma licença?

Por padrão, o **direito autoral é todo seu**: outras pessoas podem **ver** o repositório (e, pelas regras do GitHub, **bifurcar/forkar** dentro da plataforma),
mas **não têm permissão para copiar, modificar ou reutilizar** o código fora dessas regras. Para um trabalho acadêmico, isso é uma escolha legítima. A desvantagem: ninguém sabe ao certo o que pode fazer com o seu projeto.

## 3. Opções comuns para o código

| Licença | Em resumo | Implicações |
| :-- | :-- | :-- |
| **MIT** | Muito permissiva e curta | Qualquer pessoa pode **usar, copiar, modificar e até vender** o código (inclusive em produtos comerciais), desde que mantenha o aviso de copyright. Não exige que as melhorias sejam compartilhadas. |
| **Apache 2.0** | Permissiva, com cláusulas de patentes | Parecida com a MIT, com texto mais longo e proteções adicionais. |
| **GPL 3.0** | “Copyleft” | Quem redistribuir versões modificadas **precisa manter o código aberto sob a mesma licença**. Pode ser usada comercialmente, mas com essa exigência. |
| **Licenças “somente uso não comercial” para código** (ex.: *PolyForm Noncommercial*) | Permitem estudar e usar sem fins comerciais | Não são consideradas “código aberto” pela definição formal e são menos comuns; avalie se realmente quer restringir o uso comercial. |
| **Sem licença** | Todos os direitos reservados | Veja a seção 2. |

Importante: **MIT, Apache e GPL não impedem o uso comercial** do código. Se o seu objetivo é impedir que outras pessoas lucrem com o seu trabalho, essas licenças **não** fazem isso.

## 4. Textos e conteúdo educativo

Para textos e imagens (não para código), costuma-se usar **Creative Commons**: por exemplo, **CC BY 4.0** (permite reutilizar com crédito aos autores) ou **CC BY-NC 4.0** (somente uso sem fins comerciais). Como os textos foram elaborados com apoio de IA e **precisam de revisão**, revise-os antes de aplicar qualquer licença.

## 5. Preciso da sua confirmação — responda antes de eu preparar o arquivo `LICENSE`

1. **Quem são os titulares** dos direitos do projeto (autores e, talvez, a FATEC)? Existe regra da instituição sobre publicação de trabalhos?
2. Você quer que outras pessoas possam **reutilizar o código**? Ou prefere manter **todos os direitos reservados**?
3. Aceita que o código seja usado **comercialmente** por terceiros (MIT/Apache)? Ou quer exigir que melhorias fiquem abertas (GPL)?
4. Quer licenciar os **textos educativos** (por exemplo, CC BY 4.0)?
5. Qual o nome que deve constar no aviso de copyright (ex.: “© 2026 Nome(s) dos autores”)?

Com essas respostas, preparo o arquivo `LICENSE` e a atualização do `README.md`.

## 6. Cuidados ao reutilizar o projeto (valem para qualquer pessoa)

- Mantenha os **créditos** de [`../CREDITOS.md`](../CREDITOS.md).
- Os modelos **CC BY-NC** (DigitalLife3D: tubarão-martelo, tubarão-baleia e duas tartarugas) **não podem ser usados comercialmente**; se o projeto for monetizado (anúncios, venda, uso comercial), eles precisam ser trocados.
- Modelos com **ND** ou licença **Sketchfab Standard** **não estão** neste repositório e **não** devem ser incluídos sem autorização.
