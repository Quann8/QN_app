import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgZone } from '@angular/core';
import { EventsService } from '../services/events.service';
import { AuthService } from '../services/auth.service';
import { of, Observable } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';


interface Event {
  eventTitle: string;
  eventDescription: string;
  eventCategory: string;
  categoryID: string;
  eventStart: Date;
  eventEnd: Date;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('dateDisplay', { static: true }) dateDisplay!: ElementRef;
  displayedDate: Date = new Date();
  daySlots: any[] = [];
  events: Event[] = [];
  
  constructor(
    private router: Router,
    private gestureCtrl: GestureController,
    private datePipe: DatePipe,
    private zone: NgZone,
    private eventsService: EventsService,
    private authService: AuthService
    ) {}

  openNewEventPage() {
    this.router.navigateByUrl('/new-event');
  }

  updateDisplayedEvents(): void {
    this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.eventsService.fetchEventsForDate(this.displayedDate, user.uid);
        } else {
          return of([] as Event[]);
        }
      })
    ).subscribe((events: Event[]) => {
      this.events = events.map(event => {
        // Ensure eventStart and eventEnd are Dates for further processing
        const eventStart = new Date(event.eventStart);
        const eventEnd = new Date(event.eventEnd);
        
        // Calculate the position and size based on event start and end times here
        const startOfDay = new Date(this.displayedDate.setHours(0, 0, 0, 0));
        const eventStartMinutes = (eventStart.getTime() - startOfDay.getTime()) / 60000; // Convert milliseconds to minutes
        const eventDurationMinutes = (eventEnd.getTime() - eventStart.getTime()) / 60000;
        
        // Return an object that conforms to the Event type, including any new properties for UI rendering
        return {
          ...event,
          eventStartMinutes, // Example property, add others as needed
          eventDurationMinutes // Example property, add others as needed
        };
      });
    });
  }

  ngOnInit() {
    this.setupSwipeGesture();
    this.generateDaySlots();
    this.updateDisplayedEvents();
  }

  setupSwipeGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.dateDisplay.nativeElement,
      gestureName: 'swipe',
      onStart: detail => console.log('Start gesture', detail),
      onEnd: ev => {
        this.zone.run(() => {
          // Logic for determining swipe direction
          if (ev.deltaX > 0) {
            console.log('Swiped right');
            // Implement logic for swiping right
            this.navigateDays(-1);
            
          } else {
            console.log('Swiped left');
            // Implement logic for swiping left
            this.navigateDays(1);
          }
          console.log('New Date:', this.datePipe.transform(this.displayedDate, 'EEEE, MM/dd/yyyy'));
        });
      },
    });

    gesture.enable();
  }

  navigateDays(days: number): void {
    const currentDate = this.displayedDate;
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    this.displayedDate = newDate;
  }

  generateDaySlots() {
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // Start of day
  
    for (let i = 0; i < 96; i++) { // 24 hours * 4 slots per hour
      const slotTime = new Date(startTime.getTime() + i * 15 * 60 * 1000);
      this.daySlots.push({
        displayTime: slotTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        time: slotTime,
        isHour: slotTime.getMinutes() === 0
      });
    }
  }

}
