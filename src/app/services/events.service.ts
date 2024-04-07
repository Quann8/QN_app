import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, set } from 'firebase/database';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private db = getDatabase(initializeApp(environment.firebaseConfig));

  constructor() { }

  async createEvent(eventData: any): Promise<void> {
    const eventsRef = ref(this.db, 'events');
    await push(eventsRef, eventData);
  }
}
