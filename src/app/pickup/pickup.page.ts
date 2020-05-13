/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { IoncabServicesService } from '../ioncab-services.service';
import { AuthService } from '../auth.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.page.html',
  styleUrls: ['./pickup.page.scss']
})
export class PickupPage implements OnInit {
  zoom: number = 8;
  starsCount: number;
  driverInfo: any;
  lat: number;
  lng: number;
  customerInfo: any;
  userid: any;
  markers: marker[];
  public screenOptions;
  origin: { lat: any; lng: any; };
  destination: { lat: any; lng: any; };

  constructor(
    public serviceProvider: IoncabServicesService,
    private auth: AuthService,
    private route: Router
  ) {
    this.origin = {
      lat: this.serviceProvider.originlatitude,
      lng: this.serviceProvider.originlongititude
    }
    this.destination = {
      lat: this.serviceProvider.destinationlatitude,
      lng: this.serviceProvider.destinationlongititude
    }
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  // mapClicked($event: MouseEvent) {
  //   this.markers.push({
  //     lat: $event.coords.lat,
  //     lng: $event.coords.lng,
  //     draggable: true
  //   });
  // }

  ngOnInit() {
    this.auth.user.subscribe(res => {
      if (res) {
        this.userid = res.uid;
      }
      this.checkUserStatus();

    });
    const driverinfo = this.serviceProvider.driverInfo;
    this.customerInfo = this.serviceProvider.customerLocation;
    this.driverInfo = driverinfo;
  }

  checkUserStatus() {
    this.serviceProvider.checkStatus(this.userid).subscribe(res => {
      //check if the ride is completed, take user to homepage
      
      if (res && res['rideOn'] === false) {
        this.route.navigate(['home', 'complete']);
      }
    });
  }

  stars(number) {
    return Array(number).fill(0);
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
