import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController,
    ) { }

  async login() {
    try{
      await this.authService.login(this.email, this.password);
      this.authService.user$.pipe(take(1)).subscribe(user => {
        if (user) {
          this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true});
        } else {
          this.showLoginFailedAlert();
        }
      });
    } catch (error) {
      console.log('Login process encountered an error:', (error as Error).message);
    }
  }

  async showLoginFailedAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Please check your credentials and try again.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  ngOnInit() {
  }

}
