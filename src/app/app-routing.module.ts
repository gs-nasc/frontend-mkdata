import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'cliente',
    component: ClienteComponent,
  },
  {
    path: 'cliente/:id',
    component: ClienteComponent,
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
