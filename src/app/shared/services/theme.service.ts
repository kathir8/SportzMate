import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  setDarkTheme(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
  }
}
