# Guia para generar el microfront en angular

## Pimero crear dos proyectos en angular, el cual uno sera el contenedor princpial de todos los micro front.

```bash
ng new main-app
ng new microfrontend-one
```

## Instalar las dependencias necesarias en cada proyecto

```bash
npm install @angular-architects/module-federation --save
```

## Generar los archivos necesarios con

```bash
ng add @angular-architects/module-federation --project main-app
ng add @angular-architects/module-federation --project microfrontend-one
```

## Configurar Module Federation en la aplicación principal

```javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "http://localhost:4200/", // La URL del host principal
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mainApp",  // Nombre de la app principal
      remotes: {
        microfrontendOne: "microfrontendOne@http://localhost:4201/remoteEntry.js",  // URL del microfrontend
      },
      shared: ["@angular/core", "@angular/common", "@angular/router"],  // Módulos que se compartirán entre las apps
    }),
  ],
};
```

## En el microfrontend (microfrontend-one), también crea un archivo webpack.config.js similar:
```javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "http://localhost:4201/",  // URL donde se servirá este microfrontend
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "microfrontendOne",  // Nombre del microfrontend
      filename: "remoteEntry.js",  // El archivo que expondrá el microfrontend
      exposes: {
        './MicrofrontendComponent': './src/app/microfrontend/microfrontend.component.ts',  // Componente expuesto
      },
      shared: ["@angular/core", "@angular/common", "@angular/router"],
    }),
  ],
};
```

## Configurar el Router en la aplicación principal

```javascript
export const routes: Routes = [
  {
    path: 'microfrontend',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4300/remoteEntry.js',
        exposedModule: './AppComponent',
      }).then(m => m.AppComponent)
  },
];
```

## Ejecutar las aplicaciones
```bash
ng serve --project main-app  # Corre la app principal
ng serve --project microfrontend-one  # Corre el microfrontend
```

## Acceder al microfrontend desde la app principal. En el index.html

```html
<!-- projects/shell/src/app/app.component.html -->
<ul>
   <li><a routerLink="/">Home</a></li>
  <li><a routerLink="/microfrontend">Microfrontend</a></li>
</ul>
<router-outlet></router-outlet>
```
