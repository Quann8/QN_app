import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events.service';
import { AuthService } from '../services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';
import { get, ref, getDatabase } from 'firebase/database';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, catchError, take, first } from 'rxjs/operators';

class Category {
  constructor(
  public categoryID: string,
  public categoryName: string,
  public categoryDescription: string,
  public categoryColor: string,
  public pricePerHour: number,
  ) {}
}
interface CategoryState {
  categoryID?: string;
  categoryName?: string;
  categoryDescription?: string;
  categoryColor?: string;
  pricePerHour?: number;
}

@Component({
  selector: 'app-new-edit-category',
  templateUrl: './new-edit-category.page.html',
  styleUrls: ['./new-edit-category.page.scss'],
})
export class NewEditCategoryPage implements OnInit {
  categoryName = '';
  categoryDescription = '';
  categoryColor: string = '#D3D3D3';
  pricePerHour: number | null = null;
  categoryID?: string;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private eventsService: EventsService,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    // Attempt to extract category data from navigation state for editing
    const state = this.router.getCurrentNavigation()?.extras.state as CategoryState | undefined;
    if (state) {
      this.initializeFromState(state);
    }
  }

  private initializeFromState(state: CategoryState) {
    // Initialize component state from navigation state, used when editing an existing category
    this.categoryID = state.categoryID;
    this.categoryName = state.categoryName ?? '';
    this.categoryDescription = state.categoryDescription ?? '';
    this.categoryColor = state.categoryColor ?? '#D3D3D3';
    this.pricePerHour = state.pricePerHour ?? null;
  }

  goBack() {
    this.navCtrl.back();
  }

  saveCategory() {
    const categoryData = {
      categoryName: this.categoryName, 
      categoryDescription: this.categoryDescription,
      categoryColor: this.categoryColor,
      pricePerHour: this.pricePerHour,
      // Ensure categoryID is included only if it exists
      ...(this.categoryID ? { categoryID: this.categoryID } : {}),
    };
  
    this.authService.user$.pipe(first()).toPromise().then(user => {
      if (user) {
        return this.eventsService.saveCategory(categoryData, user.uid);
      } else {
        throw new Error('User not logged in');
      }
    })
    .then(() => this.showSuccessToast())
    .then(() => this.goBack())
    .catch(async (error) => {
      await this.showErrorAlert(error.message);
    });
  }
  
  async showSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Category saved successfully!',
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  }
  
  async showErrorAlert(error: string) {
    const alert = await this.alertController.create({
      header: 'Error Saving Category',
      message: `There was a problem saving your category: ${error}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit() {}

}
