import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastComponent } from 'src/app/common/components/toast/toast.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { TopSpeedService } from '../top-speed/top-speed.service';
import { CalculateService } from '../calculate/calculate.service';
import { TimerService } from '../timer/timer.service';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  @Output() geolocationData = new EventEmitter();
  @Output() speedLimitData = new EventEmitter();

  public speed: number;
  public rawAccuracy: number;
  public rawAltitude: number;
  public lat: number;
  public lon: number;

  private lastTimestamp: number;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private geolocation: Geolocation,
    private toastComponent: ToastComponent,
    private topSpeedService: TopSpeedService,
    private calculateService: CalculateService,
    private timerService: TimerService
  ) {}

  public startGeolocation() {
    this.geolocation
      .watchPosition({ enableHighAccuracy: true })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        if ('coords' in res) {
          this.prepareTracking(res);
        } else if ('code' in res) {
          this.toastComponent.presentToast(
            'toast.error.code.' + res.code,
            null,
            1000,
            'danger'
          );
        }
      });
  }

  public convertUnit() {
    this.calculateService.convert(
      this.speed,
      this.rawAccuracy,
      this.rawAltitude
    );
  }

  public getSpeedAndTime(speed: number, time: number) {
    this.timerService.saveTotalTime(Math.floor(time));
    this.calculateService.getValue(speed, time);
  }

  public stop() {
    this.onDestroy$.next();
  }

  private prepareTracking(res: any) {
    this.speed = res.coords.speed;
    this.rawAccuracy = res.coords.accuracy;
    this.rawAltitude = res.coords.altitude;
    this.lat = res.coords.latitude;
    this.lon = res.coords.longitude;

    let time: number;
    if (this.lastTimestamp && this.speed) {
      time = (res.timestamp - this.lastTimestamp) / 1000;
    } else {
      this.lastTimestamp = res.timestamp;
      time = (res.timestamp - this.lastTimestamp) / 1000;
    }
    this.lastTimestamp = res.timestamp;

    this.getSpeedAndTime(this.speed, time);
    this.topSpeedService.saveTopSpeed(this.speed);
    this.geolocationData.emit();
  }
}
