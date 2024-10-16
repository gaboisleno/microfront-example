import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';

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
