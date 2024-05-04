## Para rodar localmente:

Requisitos:

- Node.js v18+

Passos:

- Clonar o repositório
- `npm install` para instalar dependências
- `npm run dev` para inicar o servidor local

## Build

Um dos requisitos para este projeto é que a aplicação estivesse inteiramente
em um único arquivo HTML. Sendo assim, no processo de build do projeto
é utilizado um plugin que faz o _inline_ de todo o css e javascript para
o arquivo HMTL gerado.

- `npm run build` para realizar o build
- a pasta build será gerada com o único arquivo `index.html`
- executar `npm run preview` para inicar um servidor de teste e visulizar o build gerado
