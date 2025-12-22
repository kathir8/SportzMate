import { inject, Injectable, signal } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import type { OverlayEventDetail } from '@ionic/core';


@Injectable({
  providedIn: 'root'
})

export class BottomSheetService {
  private modalCtrl = inject(ModalController);

  private openComponents = signal<Set<any>>(new Set());


  async open<T = any>(
    component: any,
    options?: {
      initialBreakpoint?: number;
      breakpoints?: number[];
      cssClass?: string;
      componentProps?: Record<string, any>;
    }
  ): Promise<{ data: T | null; role: string } | null> {

    if (this.openComponents().has(component)) {
      return null;
    }

    this.updateComponent(component, true);

    const modal = await this.modalCtrl.create({
      component,
      breakpoints: options?.breakpoints ?? [0, 0.4, 0.7],
      initialBreakpoint: options?.initialBreakpoint ?? 0.5,
      handleBehavior: 'cycle',
      cssClass: options?.cssClass ?? 'bottom-sheet-modal',
      componentProps: options?.componentProps
    });

    await modal.present();

    const result: OverlayEventDetail<T> = await modal.onDidDismiss<T>();

    setTimeout(() => {
      this.updateComponent(component);
    });

    return {
      data: result.data ?? null,
      role: result.role ?? '',
    };
  }


  private updateComponent(component: any, add?: boolean) {
    this.openComponents.update(set => {
      const copy = new Set(set);
      if (add) {
        copy.add(component);
      } else {
        copy.delete(component);
      }
      return copy;
    });
  }
}
