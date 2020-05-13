/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/



import { Component, OnInit } from '@angular/core';
import { IoncabServicesService } from '../ioncab-services.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss']
})
export class HistoryPage implements OnInit {
  rating: number = 4;
  starsCount: number;
  data = [];
  cid: any;
  rides: any;
  loader: any;
  constructor(
    public services: IoncabServicesService,
    public route: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    public serviceProvider: IoncabServicesService
  ) {
    this.data = this.services.cards;
  }
  dismiss() {
    this.route.navigate(['home']);
  }
  ngOnInit() {
    this.auth.user.subscribe(res => {
      console.log(res);
      if (res) {
        this.cid = res.uid;
      }
    });
    this.getHistory();
  }

  async getHistory() {
    if (!this.loader) {
      this.loader = await this.serviceProvider.loading('Loading history ...');
      this.loader.present();
    }
    this.afs
      .collection('completedRides', ref =>
        ref.where('customer', '==', `${this.cid}`)
      )
      .valueChanges()
      .subscribe(res => {
        console.log(res);
        if(res){
        this.rides = res;
        this.loader.dismiss();
        }
      });
  }
}
