import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private router: Router) {}

  openNewEventPage() {
    this.router.navigateByUrl('/new-event');
  }

}
