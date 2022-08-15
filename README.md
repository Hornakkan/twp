# mvvm_twp

TWP project for Coding Academy 2022

Wrap up:
- Using a Vue.js app with the WordPress API
- Based on the Trello website, the goal is to reproduce the behavior of the tables of this solution using the WordPress functionalities.

What I did : 
- Install and create an headless Wordpress to use its API
- Use Vue.js to build an interface able to manage: Lists CRUD (with Categories), Cards CRUD (with Posts), Comments CRUD on cards (with Comments)
- Draggable cards with dynamic category update
- Manage users and their rights
- Some Unit Tests
- Usage of SASS
- Responsive design
- Keep in mind aceessbility, SEO and best practices tested with Google Lighthouse



<img src="https://lh3.googleusercontent.com/pw/AL9nZEWK9YYLN0bgf_oax6wk91eHLWFr8g47EhGRE04XyQZdaCRijpR6x0zjc0qj6BOcKR8Yu-pg9x4YH7JfqnJ-1sXsGqfPSX6lGu14JSF4aV2kxMptIReMvmhXptWH9pRnw27sFaqQtybDWOXK0YjiBxSO=w1918-h936-no?authuser=0" />

<img src="https://lh3.googleusercontent.com/pw/AL9nZEVMvVN0RbGamZPKw5YM3WzAXJlTyOekrRNdDjClz54aVLOrJoBUW-ihswDU0vkx9S4UmOt1Bw7zh-5qkh4FNDdlrCBPLufBcsdABhCwBC5pvogWrRu1LwLTJFdhhHaJQkPbuBaVJS_lUfWFo_PNvY5x=w795-h619-no?authuser=0" />

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
