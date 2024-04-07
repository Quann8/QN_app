import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewEventPageRoutingModule } from './new-event-routing.module';

import { NewEventPage } from './new-event.page';

import { SelectCategoryModalModule } from '../select-category-modal/select-category-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewEventPageRoutingModule,
    SelectCategoryModalModule
  ],
  declarations: [NewEventPage]
})
export class NewEventPageModule {}
