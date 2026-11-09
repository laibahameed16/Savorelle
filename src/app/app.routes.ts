import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Savorelle | Fine Dining', loadComponent: () => import('./pages/home').then(m => m.Home) },
  { path: 'menu', title: 'Menu | Savorelle', loadComponent: () => import('./pages/menu').then(m => m.MenuPage) },
  { path: 'menu/:id', title: 'Dish | Savorelle', loadComponent: () => import('./pages/dish').then(m => m.DishPage) },
  { path: 'about', title: 'About Us | Savorelle', loadComponent: () => import('./pages/about').then(m => m.About) },
  { path: 'experiences', title: 'Experiences | Savorelle', loadComponent: () => import('./pages/experiences').then(m => m.Experiences) },
  { path: 'gallery', title: 'Gallery | Savorelle', loadComponent: () => import('./pages/gallery').then(m => m.Gallery) },
  { path: 'reserve', title: 'Book a Table | Savorelle', loadComponent: () => import('./pages/reserve').then(m => m.Reserve) },
  { path: 'contact', title: 'Contact | Savorelle', loadComponent: () => import('./pages/contact').then(m => m.Contact) },
  { path: 'orders', title: 'My Orders | Savorelle', loadComponent: () => import('./pages/orders').then(m => m.Orders) },
  { path: 'cart', title: 'Your Order | Savorelle', loadComponent: () => import('./pages/cart').then(m => m.Cart) },
  { path: '**', title: 'Not Found | Savorelle', loadComponent: () => import('./pages/not-found').then(m => m.NotFound) },
];
