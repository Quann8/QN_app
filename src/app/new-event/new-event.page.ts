import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { EventsService } from '../services/events.service';
import { AuthService } from '../services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {
  format = 'MM/dd/yyyy hh:mm a';
  locale = 'en-US';

  eventTitle = '';
  eventDescription = '';
  eventCategory: string = 'Default';
  startDateTime = '';
  endDateTime = '';
  showStartPicker = false;
  showEndPicker = false;
  tempStartDate: string = '';
  tempEndDate: string = '';

  
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private eventsService: EventsService,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  goBack() {
    this.navCtrl.back();
  }

  openCategoryModal() {
    //Logic to Open Category Selection Modal
  }

  togglePicker(pickerType: 'start' | 'end') {
    if (pickerType === 'start') {
      this.showStartPicker = !this.showStartPicker;
    } else if (pickerType === 'end') {
      this.showEndPicker = !this.showEndPicker;
    }
  }

  // Method to handle the start date change
  setTempStartDate(event: CustomEvent) {
    const value = event.detail.value;
    this.tempStartDate = typeof value === 'string' ? value : '';
  }

  // Method to handle the end date change
  setTempEndDate(event: CustomEvent) {
    const value = event.detail.value;
    this.tempEndDate = typeof value === 'string' ? value : '';
  }

  confirmStartDate() {
    this.setDateTime(this.tempStartDate, 'start');
  }

  confirmEndDate() {
    this.setDateTime(this.tempEndDate, 'end');
  }  

  setDateTime(dateTimeValue: string, pickerType: 'start' | 'end') {
    const formattedDateTime = formatDate(dateTimeValue, this.format, this.locale);

    if (pickerType === 'start') {
      this.startDateTime = formattedDateTime;
      this.showStartPicker = false; // Hide the picker
    } else if (pickerType === 'end') {
      this.endDateTime = formattedDateTime;
      this.showEndPicker = false; // Hide the picker
    }
  }
  
  cancelStartDate() {
    // Logic for handling cancellation
    this.startDateTime = '';
    this.showStartPicker = false;
  }

  cancelEndDate() {
    // Logic for handling cancellation
    this.endDateTime = '';
    this.showStartPicker = false;
  }

  handleFabAction() {
    if (this.startDateTime) {
      //Logic to handle 'Stop Recording' action
      //If endDateTime manually populated, save manual entry to Firebase and navigate back
      if (this.endDateTime) {
        this.saveEvent();
      } else {
        //Update endDateTime, save to Firebase, navigate back
        this.endDateTime = formatDate(new Date(), this.format, this.locale);
        this.saveEvent();
      }
    } else {
      //Logic to handle 'Start Recording' button
      //Update startDateTime with current date/time
      this.startDateTime = formatDate(new Date(), this.format, this.locale);
    }
  }

  saveEvent() {
    const newEvent = {
      eventTitle: this.eventTitle,
      eventDescription: this.eventDescription,
      eventCategory: this.eventCategory,
      eventStart: this.startDateTime,
      eventEnd: this.endDateTime
    };
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.eventsService.createEvent(newEvent, user.uid).then(() => {
          this.showSuccessToast().then(() => this.goBack());
        }).catch(error => {
          this.showErrorAlert(error.message);
        });
      } else {
        console.error('User not logged in');
      }
    });
    
  }

  async showSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Event saved successfully!',
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  }
  
  async showErrorAlert(error: string) {
    const alert = await this.alertController.create({
      header: 'Error Saving Event',
      message: `There was a problem saving your event: ${error}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit() {
  }

}
