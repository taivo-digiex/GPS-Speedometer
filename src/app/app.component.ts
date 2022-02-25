import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { LanguageService } from './services/language/language.service';
import { UnitService } from './services/unit/unit.service';
import { TopSpeedService } from './services/top-speed/top-speed.service';
import { TimerService } from './services/timer/timer.service';
import { GeolocationService } from './services/geolocation/geolocation.service';

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
    private timerService: TimerService,
    private geolocationService: GeolocationService
  ) {
    this.hardwareBackBtn();
    this.createStorage();
    this.startTracking();
  }

  private async createStorage() {
    await this.storage.create();
    this.languageService.setInitialAppLanguage();
    this.unitService.setDefaultUnit();
    this.topSpeedService.setDefaultTopSpeed();
  }

  private hardwareBackBtn() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const url = this.router.url;
      if (!this.routerOutlet.canGoBack() && url === '/home') {
        navigator['app'].exitApp();
      } else {
        this.location.back();
      }
    });
  }

  private startTracking() {
    this.timerService.timer();
    this.geolocationService.startGeolocation();
  }
}
