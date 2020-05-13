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

@Component({
  selector: 'app-fareestimate',
  templateUrl: './fareestimate.page.html',
  styleUrls: ['./fareestimate.page.scss'],
})
export class FareestimatePage implements OnInit {
  totalFare: number;

  constructor(public serviceProvider: IoncabServicesService) { }

  ngOnInit() {
    this.totalFare = Math.round(this.serviceProvider.tripDistance * this.serviceProvider.farePerKm)

  }

}
