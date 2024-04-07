import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Category, EventsService } from '../services/events.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-select-category-modal',
  templateUrl: './select-category-modal.component.html',
  styleUrls: ['./select-category-modal.component.scss'],
})
export class SelectCategoryModalComponent  implements OnInit {
  categories: Category[] = [];
  private authSub!: Subscription;
  private categorySub!: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private authService: AuthService,
    private eventsService: EventsService
  ) { }

  dismissModal(categoryId?: string) {
    this.modalCtrl.dismiss(categoryId);
  }

  selectCategory(category: Category) {
    this.dismissModal(category.categoryID);
  }

  goToNewEditCategory() {
    this.navCtrl.navigateForward('/new-edit-category');
    this.dismissModal();
  }

  ngOnInit() {
    this.authSub = this.authService.user$.subscribe(user => {
      if (user) {
        this.categorySub = this.eventsService.fetchCategories(user.uid).subscribe(categories => {
          this.categories = categories;
        });
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.categorySub?.unsubscribe();
  }
}
