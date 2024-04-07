import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, set, query, orderByChild, onValue, update } from 'firebase/database';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { of, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, switchMap, catchError, } from 'rxjs/operators';

export class Category {
  constructor(
  public categoryID: string,
  public categoryName: string,
  public categoryDescription: string,
  public categoryColor: string,
  public pricePerHour: number,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private db = getDatabase(initializeApp(environment.firebaseConfig));

  constructor(private authService: AuthService) { }

  async createEvent(eventData: any, userUid: string): Promise<void> {
    const eventsRef = ref(this.db, `events/${userUid}`);
    await push(eventsRef, eventData);
  }

  async saveCategory(category: any, userUid: string): Promise<void> {
    // Reference the specific category by its Firebase-generated key (categoryID)
    const categoryRef = ref(this.db, `category/${userUid}/${category.categoryID}`);

    if (category.categoryID) {
      // Existing category, update entry
      // Use either set() to replace the entire record or update() to modify specific fields
      return update(categoryRef, category);
    } else {
      // New category, create entry
      // Since a new category won't have a Firebase-generated key yet, use push() to create one
      const categoriesRef = ref(this.db, `category/${userUid}`);
      const newCategoryRef = push(categoriesRef);
      // Ensure the new record includes the Firebase-generated key as categoryID or similar
      return set(newCategoryRef, { ...category, categoryID: newCategoryRef.key });
    }
  }

  fetchCategories(userUid: string): Observable<Category[]> {
    const db = getDatabase();
    const categoriesRef = query(ref(db, `category/${userUid}`), orderByChild('categoryName'));

    const categoriesSubject = new BehaviorSubject<Category[]>([]);

    onValue(categoriesRef, snapshot => {
      const categories: Category[] = [];
      snapshot.forEach(childSnapshot => {
        const category = childSnapshot.val();
        categories.push(category);
      });
      categoriesSubject.next(categories.sort((a, b) => a.categoryName.localeCompare(b.categoryName)));
    });

    return categoriesSubject.asObservable();
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user || !user.uid) {
          console.error('User not logged in or UID not found');
          return throwError(() => new Error('User not logged in or UID not found'));
        }
        return this.fetchCategories(user.uid);
      }),
      map(categories => {
        const category = categories.find(category => category.categoryID === categoryId);
        if (!category) {
          console.error('Category not found');
          throw new Error('Category not found');
        }
        return category;
      }),
      catchError(error => {
        console.error('Error fetching category by ID:', error);
        return throwError(() => error);
      })
    );
  }
}
