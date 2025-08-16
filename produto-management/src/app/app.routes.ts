import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/produtos', pathMatch: 'full' },
  { 
    path: 'produtos', 
    loadComponent: () => import('./components/produto/produto').then(m => m.ProdutoComponent)
  },
  { path: '**', redirectTo: '/produtos' }
];
