import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class ImageSourceService {
  async pickImage(source: CameraSource): Promise<Photo | null> {
    try {
      return await Camera.getPhoto({
        source,
        quality: 90,
        resultType: CameraResultType.Uri
      });
    } catch {
      return null;
    }
  }

  async convertToFile(photo: Photo): Promise<File | null> {
    if (!photo.webPath) return null;

    const response = await fetch(photo.webPath);
    const blob = await response.blob();

    return new File(
      [blob],
      `profile_${Date.now()}.jpg`,
      { type: blob.type }
    );
  }
}
