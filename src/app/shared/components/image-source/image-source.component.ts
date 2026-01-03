import { Component, inject, output } from '@angular/core';
import { CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-image-source',
  templateUrl: './image-source.component.html',
  styleUrls: ['./image-source.component.scss'],
})
export class ImageSourceComponent {


  private readonly actionSheetCtrl = inject(ActionSheetController);

  readonly sourceSelected = output<CameraSource>();

  async open(): Promise<void> {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Select Image',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera-outline',
          handler: () => this.sourceSelected.emit(CameraSource.Camera)
        },
        {
          text: 'Gallery',
          icon: 'images-outline',
          handler: () => this.sourceSelected.emit(CameraSource.Photos)
        }
      ]
    });

    await sheet.present();
  }
}
