import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HoraAlquilerPage } from './hora-alquiler.page';

const routes: Routes = [
  {
    path: '',
    component: HoraAlquilerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HoraAlquilerPage]
})
export class HoraAlquilerPageModule {}
