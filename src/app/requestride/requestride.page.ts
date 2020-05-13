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
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-requestride',
  templateUrl: './requestride.page.html',
  styleUrls: ['./requestride.page.scss']
})
export class RequestridePage implements OnInit {
  data: {
    iconName: string;
    iconName2: string;
    label: string;
    image: string;
    label2: string;
    text: string;
    text2: string;
    head: string;
  }[];
  public lat: Number;
  public lng: Number;

  public origin: any;
  public destination: any;
  public waypoints: any = []
  userid: any;
  markers = [];
  zoom: number;
  getData: Promise<void>;

  markerOptions = {
    origin: {
      animation: '\'DROP\'',
      label: 'origin'
    },
    destination: {
      animation: '\'DROP\'',
      label: ''
    }
  };
  public screenOptions;

  constructor(
    public serviceProvider: IoncabServicesService,
    public alertCtrl: AlertController,
    public route: Router,
    private http: HttpClient,
    private auth: AuthService,
    public loadCtrl: LoadingController,
    public toastController: ToastController
  ) {
    this.lat = this.serviceProvider.directionlat;
    this.lng = this.serviceProvider.directionlng;
    this.waypoints = this.serviceProvider.waypoints;
  }

  ngOnInit() {
    this.auth.user.subscribe(res => {
      console.log(res);
      if (res) {
        this.userid = res.uid;
      }
      this.getDirection();
      // to redirect to further pages if a booking is active
      this.serviceProvider.checkStatus(this.userid).subscribe((result) => {
        if (result) {
          const rideCheck = result['rideOn'];
          if (rideCheck === true) {
            this.route.navigate(['bookingconfirmation']);
          }
        }
      });
    });
  }

  getDirection() {
    if (this.serviceProvider.showpickup === '') {
      this.origin = { lat: this.lat, lng: this.lng };

    } else {
      if (
        this.serviceProvider.originlatitude &&
        this.serviceProvider.originlongititude
      ) {
        this.origin = {
          lat: this.serviceProvider.originlatitude,
          lng: this.serviceProvider.originlongititude
        };
      } else {
        this.origin = { lat: this.lat, lng: this.lng };
      }
      this.destination = {
        lat: this.serviceProvider.destinationlatitude,
        lng: this.serviceProvider.destinationlongititude
      };

      this.waypoints.push()

    }
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  mapClicked($event: MouseEvent) {
    console.log('map clicked', $event);
  }
  async alertOnSubmit() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Booking',
      message:
        'Your driver is waiting for you do you want to confirm?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: res => {
            console.log('Cancel booking');
            this.route.navigate(['home']);
          }
        },
        {
          text: 'Book',
          handler: () => {
            // this.route.navigate(['bookingconfirmation']);
            this.bookCab();
          }
        }
      ]
    });
    return await alert.present();
  }

  async bookCab() {
    const loading = await this.loadCtrl.create({
      message: 'Connecting you to drivers ...'
    })
    await loading.present();

    setTimeout(async () => {
      loading.dismiss()
      const toast = await this.toastController.create({
        message: 'No driver available at this moment',
        duration: 2000
      });
      toast.present()
    } ,60000)
    
    const obj = {};
    obj['origin'] = this.origin;
    obj['destination'] = this.destination;
    obj['uid'] = this.userid;
    this.http
      .post(
        'https://us-central1-car-pooling-38f58.cloudfunctions.net/getDriver',
        obj
      )
      .subscribe(async (res: any) => {
        loading.dismiss();
        console.log('ressssss',res);
        if (res && res.length === 0) {
          const toast = await this.toastController.create({
            message: 'No driver available at this moment',
            duration: 2000
          });
          toast.present()

        } else {
          this.serviceProvider.driverInfo = res;
          console.log('Attempting to book ride with driver ', res)
          this.serviceProvider.customerLocation = obj;
          this.route.navigate(['bookingconfirmation']);
        }

      });
  }


}
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
