import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventsService } from '../services/events.service';
import { AuthService } from '../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';


class Category {
  constructor(
  public categoryID: string,
  public categoryName: string,
  public categoryDescription: string,
  public categoryColor: string,
  public pricePerHour: number,
  ) {}
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  categories: Category[] = [];
  private authSub!: Subscription;
  private categorySub!: Subscription;

  constructor(
    private router: Router,
    private eventsService: EventsService, 
    private authService: AuthService
    ) {}

  openNewEventPage() {
    this.router.navigateByUrl('/new-event');
  }

  goToNewEditCategory(categoryID?: string) {
    const extras = categoryID ? { state: { categoryID } } : {};
    this.router.navigate(['/new-edit-category'], extras);
  }

  openCategory(category: Category) {
    const navigationExtras: NavigationExtras = {
      state: category
    };
    this.router.navigate(['new-edit-category'], navigationExtras);
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
