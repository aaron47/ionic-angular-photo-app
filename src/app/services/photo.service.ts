import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { Platform } from '@ionic/angular';

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  photos$ = new BehaviorSubject<UserPhoto[]>([]);
  private readonly PHOTO_STORE: string = 'photos';

  constructor() {}

  async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.photos$.value.unshift({
      filepath: 'soon...',
      webviewPath: capturedPhoto.webPath!,
    });

    this.savePicture(capturedPhoto);
    this.photos$.next(this.photos$.value);

    Preferences.set({
      key: this.PHOTO_STORE,
      value: JSON.stringify(this.photos$.value),
    });
  }

  async loadSaved() {
    const photos = await Preferences.get({ key: this.PHOTO_STORE });
    const photosJson = JSON.parse(photos.value!);

    for (const photo of this.photos$.value) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }

    this.photos$.next(photosJson);
    console.log(photos);
  }

  private savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    return from(this.readAsBase64(photo)).pipe(
      mergeMap((base64Data) => {
        // Write the file to the data directory
        const fileName = new Date().getTime() + '.jpeg';

        let data: string = '';
        base64Data.subscribe((d) => (data = d));

        return from(
          Filesystem.writeFile({
            path: fileName,
            data,
            directory: Directory.Data,
          })
        ).pipe(
          // Use webPath to display the new image instead of base64 since it's
          // already loaded into memory
          map(() => ({
            filepath: fileName,
            webviewPath: photo.webPath,
          }))
        );
      })
    );
  }

  private readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    return from(fetch(photo.webPath!).then((response) => response.blob())).pipe(
      map((blob) => this.convertBlobToBase64(blob))
    );
  }

  private convertBlobToBase64(blob: Blob) {
    return from(
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      })
    );
  }
}
