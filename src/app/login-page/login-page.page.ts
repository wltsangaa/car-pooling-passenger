/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { IoncabServicesService } from '../ioncab-services.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss']
})
export class LoginPagePage implements OnInit {
  cabLogin: any = { email: '', password: '' };
  spinner: boolean = false;
  disabled: boolean = false;
  constructor(
    public serviceProvider: IoncabServicesService,
    public menuCtrl: MenuController,
    private auth: AuthService,
    private route: Router
  ) { }

  ngOnInit() {
    this.auth.user.subscribe(res => {
      if (res) {
        this.auth.getUser(res.uid).then((user: any) => {
          console.log(user);
          this.serviceProvider.setLoggedInUser(res, user);
          this.route.navigate(['home']);
        });
      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  login() {
    this.spinner = true;
    this.disabled = true;
    this.auth
      .loginUser(this.cabLogin.email, this.cabLogin.password)
      .then(res => {

        this.auth.getUser(res.uid).then((user: any) => {
          console.log(user);
          this.serviceProvider.setLoggedInUser(res, user);

          this.spinner = false;
          this.disabled = false;
          this.route.navigate(['home']);
        });
      })
      .catch(err => {
        this.spinner = false;
        this.disabled = false;
        console.log(err.message);
      });
  }
}
