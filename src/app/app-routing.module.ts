import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  
  //{ path: '', loadChildren: './pages/login/login.module#LoginPageModule' },  
  { path: '', loadChildren: './pages/maps/maps.module#MapsPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },   
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },  
  { path: 'history-page', loadChildren: './pages/history-page/history-page.module#HistoryPagePageModule' },  
  { path: 'payment-page', loadChildren: './pages/payment-page/payment-page.module#PaymentPagePageModule' },
  { path: 'support-page', loadChildren: './pages/support-page/support-page.module#SupportPagePageModule' },
  { path: 'aboutus', loadChildren: './pages/aboutus/aboutus.module#AboutusPageModule' },
  { path: 'setting', loadChildren: './pages/setting/setting.module#SettingPageModule' },
  { path: 'cambiopass', loadChildren: './pages/cambiopass/cambiopass.module#CambiopassPageModule' },
  { path: 'pago-stripe', loadChildren: './pages/pago-stripe/pago-stripe.module#PagoStripePageModule' },
  { path: 'wallet', loadChildren: './pages/wallet/wallet.module#WalletPageModule' },
  { path: 'consultawallet', loadChildren: './pages/consultawallet/consultawallet.module#ConsultawalletPageModule' },
  { path: 'recargawallet', loadChildren: './pages/recargawallet/recargawallet.module#RecargawalletPageModule' },
  { path: 'hora-alquiler', loadChildren: './pages/hora-alquiler/hora-alquiler.module#HoraAlquilerPageModule' },
  { path: 'updatecreditcards', loadChildren: './pages/updatecreditcards/updatecreditcards.module#UpdatecreditcardsPageModule' },  
  { path: 'authorize', loadChildren: './pages/authorize/authorize.module#AuthorizePageModule' },
  { path: 'howtouse', loadChildren: './pages/howtouse/howtouse.module#HowtousePageModule' },
  { path: 'technical-faq', loadChildren: './pages/technical-faq/technical-faq.module#TechnicalFaqPageModule' },
  { path: 'sendmail', loadChildren: './pages/sendmail/sendmail.module#SendmailPageModule' },
  { path: 'verificaruser', loadChildren: './pages/verificaruser/verificaruser.module#VerificaruserPageModule' },
  
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
