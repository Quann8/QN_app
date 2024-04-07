import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SelectCategoryModalComponent } from './select-category-modal.component';

@NgModule({
  declarations: [SelectCategoryModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [SelectCategoryModalComponent]
})
export class SelectCategoryModalModule {}
