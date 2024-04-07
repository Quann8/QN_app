import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewEditCategoryPage } from './new-edit-category.page';

const routes: Routes = [
  {
    path: '',
    component: NewEditCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewEditCategoryPageRoutingModule {}
