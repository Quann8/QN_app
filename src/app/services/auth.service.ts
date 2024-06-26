import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = authState(auth);
  }

  // Login Method
  async login(email: string, password:string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  //Loguout method
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Loguout failed:', error)
    }
  }

  // Provide User UID
  getUserUid(): Observable<string | null> {
    return authState(this.auth).pipe(
      map((user: any) => user ? user.uid : null)
    );
  }

}
