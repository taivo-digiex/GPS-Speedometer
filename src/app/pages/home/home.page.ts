import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Platform } from '@ionic/angular';
import { UnitService } from '../../services/unit/unit.service';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { CalculateService } from 'src/app/services/calculate/calculate.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import SwiperCore, { Autoplay, Pagination } from 'swiper';

SwiperCore.use([Autoplay, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit, OnDestroy {
  public lat: number;
  public lon: number;
  public speedo: number;
  public topSpeed: number;
  public speedUnit: string;
  public lenghtUnit: string;
  public distanceUnit: string;
  public accuracy: number;
  public altitude: string;
  public time: string = '00:00:00';
  public avgSpeed: string;
  public distance: string;
  public hiddenStartIcon: boolean = false;
  public hiddenStopIcon: boolean = true;
  public isPortrait: boolean = false;

  public settingsIcon: string = 'settings';
  public timerIcon: string = 'timer';
  public startIcon: string = 'play';
  public stopIcon: string = 'stop';

  constructor(
    private insomnia: Insomnia,
    private platform: Platform,
    private unitService: UnitService,
    private toastComponent: ToastComponent,
    private calculateService: CalculateService,
    private timerService: TimerService,
    private geolocationService: GeolocationService
  ) {}

  public ngOnInit() {
    this.platform.ready().then(() => {
      this.insomnia.keepAwake();
      this.initial();
    });
  }

  private initial() {
    setInterval(() => {
      this.convertUnit();
      this.time = this.timerService.time;
      this.lat = this.geolocationService.lat;
      this.lon = this.geolocationService.lon;
      this.hiddenStartIcon = this.timerService.hiddenStartIcon;
      this.hiddenStopIcon = this.timerService.hiddenStopIcon;
      this.isPortrait = this.platform.isPortrait();
    });
  }

  public changeUnit() {
    if (this.unitService.unit == 'imperial') {
      this.unitService.saveUnit('metric');
    } else if (this.unitService.unit == 'metric') {
      this.unitService.saveUnit('imperial');
    }

    this.toastComponent.presentToast(
      'toast.unit_change.' + this.unitService.unit,
      null,
      500
    );
  }

  private convertUnit() {
    this.geolocationService.convertUnit();
    this.speedo = this.calculateService.speedo;
    this.topSpeed = this.calculateService.topSpeed;
    this.accuracy = this.calculateService.accuracy;
    this.altitude = this.calculateService.altitude;
    this.distance = this.calculateService.distance;
    this.avgSpeed = this.calculateService.avgSpeed;

    this.unitService.convertUnit();
    this.lenghtUnit = this.unitService.lenghtUnit;
    this.speedUnit = this.unitService.speedUnit;
    this.distanceUnit = this.unitService.distanceUnit;
  }

  public stopTracking() {
    this.geolocationService.stop();
    this.insomnia.allowSleepAgain();
  }

  public startTimer() {
    this.timerService.timer();
  }

  public stopTimer() {
    this.timerService.stopTimer();
  }

  public ngOnDestroy() {
    this.insomnia.allowSleepAgain();
  }
}
