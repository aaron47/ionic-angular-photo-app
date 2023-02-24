import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosPage implements OnInit {
  constructor(protected readonly photoService: PhotoService) {}

  ngOnInit(): void {
    this.photoService.loadSaved();
  }

  savePhoto() {
    this.photoService.addNewToGallery();
  }
}
