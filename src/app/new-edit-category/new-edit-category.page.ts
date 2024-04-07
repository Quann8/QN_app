import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events.service';
import { AuthService } from '../services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';
import { get, ref, getDatabase } from 'firebase/database';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

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
  categoryID: string = '';

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as CategoryState | undefined;

    if (state && state.categoryID) {
      // If navigating with a specific category for editing
      this.categoryID = state.categoryID;
      this.categoryName = state.categoryName || '';
      this.categoryDescription = state.categoryDescription || '';
      this.categoryColor = state.categoryColor || '#D3D3D3'; // Default color if none provided
      this.pricePerHour = state.pricePerHour || null;
    } else {
      // Navigated from the "New" button, indicating creation of a new category
      // proceed to generate a new category ID (and potentially handle defaults differently)
      this.generateNewCategoryId().subscribe({
        next: (newId) => {
            this.categoryID = newId;
        },
        error: (error) => {
            console.error("Failed to generate new category ID:", error);
        }
      });
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  saveCategory() {
    const categoryData = {
      categoryID: this.categoryID,
      categoryName: this.categoryName, 
      categoryDescription: this.categoryDescription,
      categoryColor: this.categoryColor,
      pricePerHour: this.pricePerHour,
    };

    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.eventsService.saveCategory(categoryData, user.uid).then(() => {
          this.showSuccessToast().then(() => this.goBack());
        }).catch(error => {
          this.showErrorAlert(error.message);
        });
      } else {
        console.error('User not logged in');
      }
    });
  }

  generateNewCategoryId(): Observable<string> {
    return this.authService.getUserUid().pipe(
      take(1),
      switchMap(userUid => {
        if (!userUid) {
          console.error("No user UID found");
          return of('00001');
        }
  
        console.log(`User UID found: ${userUid}`);
        const db = getDatabase();
        const categoriesRef = ref(db, `category/${userUid}`);
        console.log(`Fetching categories from: ${categoriesRef.toString()}`);
  
        return from(get(categoriesRef)).pipe(
          map(snapshot => {
            console.log(`Snapshot exists: ${snapshot.exists()}`);
            if (snapshot.exists()) {
              const categories = snapshot.val();
              console.log("Fetched categories:", categories);
              const categoryIDs = Object.values(categories).map((cat: any) => parseInt((cat as Category).categoryID || '0', 10));
              const maxId = Math.max(...categoryIDs, 0);
              return String(maxId + 1).padStart(5, '0');
            } else {
              return '00001';
            }
          }),
          catchError(error => {
            console.error("Error fetching categories:", error);
            return of('00001');
          })
        );
      })
    );
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

  ngOnInit() {
    this.generateNewCategoryId().subscribe(newId => {
      this.categoryID = newId;
    }, error => {
      console.error("Failed to generate new category ID:", error);
    });
  }

}
