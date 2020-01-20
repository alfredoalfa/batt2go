import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TechnicalFaqPage } from './technical-faq.page';

const routes: Routes = [
  {
    path: '',
    component: TechnicalFaqPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TechnicalFaqPage]
})
export class TechnicalFaqPageModule {}
