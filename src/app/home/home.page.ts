/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, NgZone, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ThrowStmt, CompileMetadataResolver } from '@angular/compiler';
import { IoncabServicesService } from '../ioncab-services.service';
import { ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { PaymentPageComponent } from '../payment-page/payment-page.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SetlocationComponent } from '../setlocation/setlocation.component';
import { ActivatedRoute } from '@angular/router';
class Coordinate {
  latitude: number;
  longitude: number;

  constructor(lat, lng) {
    this.latitude = lat;
    this.longitude = lng;
  }
}
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  public searchControl: FormControl;
  public formatted_address: string;
  public options = {
    suppressMarkers: true,
  };
  public waypoints: any = []
  public show = true;
  zoom: number = 8;
  starsCount: number;
  public lat: number;
  public lng: number;
  public address: Object;
  searchItem = '';
  autocompleteItems = [];
  map: any;
  showpickup = '';
  markers = [];
  street: any;
  building: any;
  public origin: any
  public destination: any
  public coordinates: Coordinate[] = [];
  pickup: boolean;
  loader: any;
  block: any;
  color = ['black', 'black', 'black'];

  item: { color: string; size: number; margin: number; hw: number; icolor: string; ml: number; marginpic: number; flag: boolean; name: string }[];
  dir: { origin: { lat: number; lng: number; }; destination: { lat: number; lng: number; } };
  marker: boolean;
  locatedCountry: string;
  tripDistance: number;
  pickUpLocation: string

  public markerOptions = {
    origin: {
      animation: '\'DROP\'',
      label: 'origin',

    },
    destination: {
      animation: '\'DROP\'',
      label: '',

    },
  }
  renderOptions = {
    suppressMarkers: true,
  }

  public screenOptions;


  constructor(
    private __zone: NgZone,
    public geolocation: Geolocation,
    private mapsAPILoader: MapsAPILoader,
    public serviceProvider: IoncabServicesService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public route: ActivatedRoute) {
    if (this.serviceProvider.destination === '') {
      this.pickup = true;
      this.marker = true;
    }
    this.getCurrentLoaction();
    this.show = true;
    this.item = [{
      color: '#f4f4f4',
      size: 1.2,
      margin: 0,
      hw: 40,
      icolor: 'black',
      ml: 35,
      marginpic: 5,
      flag: false,
      name: 'black'
    }, {
      color: '#f4f4f4',
      size: 1.2,
      margin: 0,
      hw: 40,
      icolor: 'black',
      ml: 35,
      marginpic: 5,
      flag: false,
      name: 'black'

    }, {
      color: '#f4f4f4',
      size: 1.2
      , margin: 0,
      hw: 40,
      icolor: 'black',
      ml: 35,
      marginpic: 5,
      flag: false,
      name: 'black'
    }];

    // If redirected from trip page after trip completion
    this.route.params.subscribe(params => {
      console.log(params);
      if (params && params.status == 'complete') {
        this.reset();
      }
    })
  }

  ngOnInit() {


  }

  reset() {

    this.__zone.run(() => {
      this.marker = true;
      this.destination = null;
      this.serviceProvider.destinationlatitude = null;
      this.serviceProvider.destinationlongititude = null;
      this.serviceProvider.pickupLocation = 'pickup';
      this.pickup = true;
      this.serviceProvider.showdestination = null;
      this.origin = null;
      this.lat = null;
      this.lng = null;
      this.waypoints = [];
      this.coordinates = [];
      this.getCurrentLoaction();
    })

  }


  async getCurrentLoaction() {
    const loader = await this.serviceProvider.loading('Getting your location..');
    loader.present()
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
      this.serviceProvider.directionlat = this.lat
      this.serviceProvider.directionlng = this.lng
      // this.map = new google.maps.Map(mapOptions);
      this.getGeoLocation(resp.coords.latitude, resp.coords.longitude);
      this.serviceProvider.originlatitude = this.lat;
      this.serviceProvider.originlongititude = this.lng
      this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude };

      loader.dismiss();

    }).catch((error) => {
      console.log('Error getting location', error);
    }).finally(() => {
    })
  }

  async getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
      const geocoder = await new google.maps.Geocoder();
      const latlng = await new google.maps.LatLng(lat, lng);
      const request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          const rsltAdrComponent = result.address_components;
          if (result !== null) {
            if (rsltAdrComponent[0] !== null) {
              this.block = rsltAdrComponent[0].long_name;
              this.street = rsltAdrComponent[2].short_name;
              this.building = rsltAdrComponent[1].short_name;
            }
            // Find out country of geolocation
            console.log(rsltAdrComponent);
            let local_add_1 = '';
            let local_add_2 = '';
            for (let i = 0; i < rsltAdrComponent.length; i++) {
              if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('country')) {
                this.locatedCountry = rsltAdrComponent[i].short_name;
              }
              if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('administrative_area_level_1')) {
                local_add_1 = rsltAdrComponent[i].short_name;
              }
              if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('locality')) {
                local_add_2 = rsltAdrComponent[i].short_name;
              }
            }
            this.serviceProvider.loggedInUser.location = local_add_1 + ', ' + local_add_2;

            if (this.serviceProvider.flag === true && this.serviceProvider.pickup !== 'India') {
              this.serviceProvider.showpickup = this.block + ' ' + this.street + ' ' + this.building;
            } else if (this.serviceProvider.pickup !== 'India') {
              this.serviceProvider.showdestination = this.street + this.building;
            }
          } else {
            alert('No address available!');
          }
        }
      });
    }
  }

  async openImageCtrl(name, path) {
    if (this.serviceProvider.showdestination === '') {
      const toast: any = await this.serviceProvider.presentToast('You must select destination location first to request ride');
      await toast.present();
    } else if (this.serviceProvider.showpickup === '') {
      const toast: any = await this.serviceProvider.presentToast('You must select origin location first to request ride');
      await toast.present();
    } else {
      this.serviceProvider.waypoints = this.waypoints;
      this.serviceProvider.carname = name;
      this.serviceProvider.path = path;
      const profileModal: any = await this.serviceProvider.cabModal(PaymentPageComponent, 'backTransparent');
      profileModal.present();
    }
  }

  changeStyle(j) {
    for (let i = 0; i < 3; i++) {
      this.item[i].ml = 0;
      this.item[i].color = '#f4f4f4';
      this.item[i].size = 1.2;
      this.item[i].margin = 0;
      this.item[i].marginpic = 5;
      this.item[i].icolor = 'black';
      this.item[i].hw = 45;
      this.color[i] = 'black';
      this.item[i].flag = false;
      this.item[i].name = 'black';
    }
    this.item[j].flag = true;
    this.color[j] = 'blue';
    this.item[j].hw = 50;
    this.item[j].margin = 5;
    this.item[j].color = 'blue';
    this.item[j].size = 2;
    this.item[j].ml = 0;
    this.item[j].marginpic = 0;
    this.item[j].icolor = 'white';
    this.item[j].name = 'blue'

  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  async markerDragEnd(m: marker, $event: MouseEvent) {

    if ($event.coords && $event.coords.lat && $event.coords.lng) {
      const geocoder = await new google.maps.Geocoder();
      const latlng = await new google.maps.LatLng($event.coords.lat, $event.coords.lng);
      const request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {

        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          const rsltAdrComponent = result.address_components;
          if (result !== null) {
            if (rsltAdrComponent[0] !== null) {
              this.block = rsltAdrComponent[0].long_name;
              this.street = rsltAdrComponent[2].short_name;
              this.building = rsltAdrComponent[1].short_name;
            }
            this.__zone.run(() => {

              if (this.serviceProvider.pickupLocation === 'pickup') {
                this.serviceProvider.originlatitude = $event.coords.lat;
                this.serviceProvider.originlongititude = $event.coords.lng;
                this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude };
                this.serviceProvider.showpickup = this.block + ' ' + this.street + ' ' + this.building;
              }
              if (this.serviceProvider.pickupLocation === 'destination') {
                debugger
                this.serviceProvider.destinationlatitude = $event.coords.lat; // service value of destination latitude
                this.serviceProvider.destinationlongititude = $event.coords.lng; // service value of destination longitude
                this.destination = { lat: this.serviceProvider.destinationlatitude, lng: this.serviceProvider.destinationlongititude }; // local value of destination coords

                this.serviceProvider.showdestination = this.block + ' ' + this.street + ' ' + this.building;

              }

            })

          } else {
            alert('No address available!');
          }

        }
      });
    }
  }

  mapClicked($event: MouseEvent) {

    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });

  }


  async gotoEditMidOne() {

    this.serviceProvider.originlatitude = null;
    this.serviceProvider.originlongititude = null;
    const modal = await this.modalCtrl.create({
      component: SetlocationComponent,
      componentProps: { country: this.locatedCountry ? this.locatedCountry : 'IN' }
    });

    await modal.present();
    await modal.onDidDismiss();


    if (this.serviceProvider.showpickup === '') {
      this.origin = { lat: this.lat, lng: this.lng }
    } else {

      if (this.serviceProvider.originlatitude && this.serviceProvider.originlongititude) {
        var location = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude, stopover: true };
        this.waypoints.push({ location: location });
        this.coordinates.push(new Coordinate(this.serviceProvider.originlatitude, this.serviceProvider.originlongititude));
        this.serviceProvider.originlatitude = null;
        this.serviceProvider.originlongititude = null;

        console.log(this.waypoints);

      }


    }



  }





  async gotoEdit(name, value, open) {

    this.serviceProvider.pickupLocation = name;
    if (open === 'modal') {
      const modal = await this.modalCtrl.create({
        component: SetlocationComponent,
        componentProps: { country: this.locatedCountry ? this.locatedCountry : 'IN' }
      });

      await modal.present();
      await modal.onDidDismiss();
      if (this.serviceProvider.showpickup === '') {
        this.origin = { lat: this.lat, lng: this.lng }
      } else {
        if (this.serviceProvider.originlatitude && this.serviceProvider.originlongititude) {
          this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude }
        } else {
          this.origin = { lat: this.lat, lng: this.lng }
        }

        this.destination = { lat: this.serviceProvider.destinationlatitude, lng: this.serviceProvider.destinationlongititude }
        if (this.destination && this.destination.lat && this.destination.lng) {
          this.marker = false;
        } else {
          this.marker = true;
        }

      }

    }
    this.pickup = value

  }

  async gotoEditNorth(value) {

    var lat = 22.338831;
    var lng = 114.261983;
    this.markers.push({
      lat: lng,
      lng: lng,
      draggable: true
    });

    if (lat && lng) {
      const geocoder = await new google.maps.Geocoder();
      const latlng = await new google.maps.LatLng(lat, lng);
      const request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {

        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          const rsltAdrComponent = result.address_components;
          if (result !== null) {
            if (rsltAdrComponent[0] !== null) {
              this.block = rsltAdrComponent[0].long_name;
              this.street = rsltAdrComponent[2].short_name;
              this.building = rsltAdrComponent[1].short_name;
            }
            this.__zone.run(() => {

              this.serviceProvider.originlatitude = lat;
              this.serviceProvider.originlongititude = lng;
              this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude };
              this.serviceProvider.showpickup = this.block + ' ' + this.street + ' ' + this.building;

            })

          } else {
            alert('No address available!');
          }

        }
      });
    }
    //this.markerDragEnd(m: marker, $event);
    this.pickup = value;
    console.log("north is licked")
  }

  async gotoEditSouth(value) {
    var lat = 22.333397;
    var lng = 114.263223;
    this.markers.push({
      lat: lng,
      lng: lng,
      draggable: true
    });

    if (lat && lng) {
      const geocoder = await new google.maps.Geocoder();
      const latlng = await new google.maps.LatLng(lat, lng);
      const request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          const rsltAdrComponent = result.address_components;
          if (result !== null) {
            if (rsltAdrComponent[0] !== null) {
              this.block = rsltAdrComponent[0].long_name;
              this.street = rsltAdrComponent[2].short_name;
              this.building = rsltAdrComponent[1].short_name;
            }
            this.__zone.run(() => {
              this.serviceProvider.originlatitude = lat;
              this.serviceProvider.originlongititude = lng;
              this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude };
              this.serviceProvider.showpickup = this.block + ' ' + this.street + ' ' + this.building;
            })
          } else {
            alert('No address available!');
          }
        }
      });
    }
    this.pickup = value
    console.log("south is licked")
  }

  public onResponse(event: any) {

    console.log(event);
    this.tripDistance = Math.round(((event.routes[0].legs[0].distance.value) / 1000));
    setTimeout(() => {
      this.serviceProvider.tripDistance = this.tripDistance;
    }, 5000);
  }
}


interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
