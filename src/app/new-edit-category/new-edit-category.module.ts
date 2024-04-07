import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewEditCategoryPageRoutingModule } from './new-edit-category-routing.module';

import { NewEditCategoryPage } from './new-edit-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewEditCategoryPageRoutingModule
  ],
  declarations: [NewEditCategoryPage]
})
export class NewEditCategoryPageModule {}
