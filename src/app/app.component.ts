import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { LanguageService } from './services/language/language.service';
import { UnitService } from './services/unit/unit.service';
import { TopSpeedService } from './services/top-speed/top-speed.service';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { UpdateService } from './services/update/update.service';
import { OdoTripService } from './services/odo-trip/odo-trip.service';
import { TimerService } from './services/timer/timer.service';
import { CalculateService } from './services/calculate/calculate.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private router: Router,
    private location: Location,
    private storage: Storage,
    private languageService: LanguageService,
    private unitService: UnitService,
    private topSpeedService: TopSpeedService,
    private geolocationService: GeolocationService,
    private updateService: UpdateService,
    private odoTripService: OdoTripService,
    private timerService: TimerService,
    private calculateService: CalculateService
  ) {
    this.platform.ready().then(async () => {
      await this.createStorage();
      // this.geolocationService.startGeolocation();
      this.hardwareBackBtn();
      this.updateService.checkForUpdate(false);
    });
  }

  private async createStorage() {
    await this.storage.create();
    this.languageService.setInitialAppLanguage();
    this.geolocationService.getEnableHighAccuracy();
    this.unitService.getUnit();
    this.timerService.getTotalTime();
    this.odoTripService.getOdoTrip();
    this.topSpeedService.getTopSpeed();
    this.timerService.getAverageSpeedTotalTime();
    this.calculateService.getSpeedCorrection();
    this.calculateService.getValue();
    this.calculateService.changeUnit();
  }

  private hardwareBackBtn() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const url = this.router.url;
      if (!this.routerOutlet.canGoBack() && url === '/home') {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        navigator['app'].exitApp();
      } else {
        this.location.back();
      }
    });
  }
}
