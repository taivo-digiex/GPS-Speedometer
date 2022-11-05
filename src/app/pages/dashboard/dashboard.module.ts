import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    TranslateModule,
    SwiperModule,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
