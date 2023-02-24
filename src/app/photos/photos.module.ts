import { ExploreContainerModule } from './../explore-container/explore-container.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhotosPageRoutingModule } from './photos-routing.module';
import { PhotosPage } from './photos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotosPageRoutingModule,
    ExploreContainerModule,
  ],
  declarations: [PhotosPage],
})
export class PhotosPageModule {}
