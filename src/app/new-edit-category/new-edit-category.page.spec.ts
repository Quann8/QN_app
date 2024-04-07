import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewEditCategoryPage } from './new-edit-category.page';

describe('NewEditCategoryPage', () => {
  let component: NewEditCategoryPage;
  let fixture: ComponentFixture<NewEditCategoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewEditCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
