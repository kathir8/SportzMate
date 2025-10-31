import { Component, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { chatboxOutline, thumbsUpOutline } from 'ionicons/icons';
import { IonicChipComponent } from "src/app/shared/components/ionic-chip/ionic-chip.component";
import { HomeService } from '../../services/home-service';
import { MateBasicComponent } from "../mate-basic/mate-basic.component";
import { Coordinates, MateListItem } from '../models/mate.model';
import { NoMateFoundComponent } from "../no-mate-found/no-mate-found.component";
import { SportType } from 'src/app/shared/models/shared.model';

@Component({
  selector: 'app-mate-map-view',
  templateUrl: './mate-map-view.component.html',
  styleUrls: ['./mate-map-view.component.scss'],
  imports: [IonContent, NoMateFoundComponent, IonIcon, IonicChipComponent, MateBasicComponent]
})
export class MateMapViewComponent {
  private router = inject(Router);
  private homeService = inject(HomeService);

  icons = { thumbsUpOutline, chatboxOutline };

  // players currently within radius
  visiblePlayers = input<MateListItem[]>([]);
  current = input.required<{ lat: number; lng: number }>();


  @ViewChild('mapRef', { static: true }) mapElement!: ElementRef;
  @ViewChild('carouselRef', { static: false }) carouselRef!: ElementRef<HTMLDivElement>;

  map!: google.maps.Map;
  infoWindow!: google.maps.InfoWindow;
  userMarker!: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  badgeMarkers: google.maps.Marker[] = [];
  circle!: google.maps.Circle;

  selectedPlayerId: number | null = null;


  constructor() {
    effect(() => {
      const players = this.visiblePlayers();
      const cur = this.current();

      if (players.length && cur.lat && cur.lng) {
        // Initialize or update map
        if (!this.map) {
          this.initMap(cur);
        } else {
          this.map.setCenter(cur);
          this.circle?.setCenter(cur);
          if (this.userMarker) {
            this.userMarker.setPosition(cur);
          }
        }
        this.loadNearbyPlayers(players, cur);
      }
    });

    effect(() => {
      const r = this.homeService.rangeKm(); // if this returns a signal value
      if (this.circle) this.circle.setRadius(r * 1000);
    });

  }

  initMap(center: Coordinates) {
    const mapEl = this.mapElement.nativeElement as HTMLElement;
    this.map = new google.maps.Map(mapEl, {
      center,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false
    });

    this.infoWindow = new google.maps.InfoWindow();

    // marker for current location
    this.userMarker = new google.maps.Marker({
      position: center,
      map: this.map,
      title: 'You',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: '#2E86DE',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: 'white'
      }
    });

    // circle showing radius
    this.circle = new google.maps.Circle({
      strokeColor: '#2E86DE',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#2E86DE',
      fillOpacity: 0.08,
      map: this.map,
      center,
      radius: this.homeService.rangeKm() * 1000
    });

    (this as any)._circle = this.circle;
  }

  // compute visible players within radius and render markers + bottom cards
  loadNearbyPlayers(players: MateListItem[], center: Coordinates) {
    // clear existing markers
    this.clearMarkers();

    // create markers for visible players
    players.forEach(item => this.addPlayerMarker(item));

    // update circle radius & center
    if (this.circle) {
      this.circle.setCenter(center);
      this.circle.setRadius(this.homeService.rangeKm() * 1000);
    }

    // update user marker position if available
    if (this.userMarker) {
      this.userMarker.setPosition(center);
    }

    // fit bounds around user + visible players
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(center);
    players.forEach(v => bounds.extend(v.coords));
    if (players.length) {
      this.map.fitBounds(bounds, 120);
    } else {
      // when no players, keep a sane zoom
      this.map.setCenter(center);
      this.map.setZoom(13);
    }
  }


  async addPlayerMarker(player: MateListItem) {
    try {
      const { url, width, height, anchorX, anchorY } = await this.createCompositeMarkerIcon(
        player.profileImg,
        this.gameEmoji(player.sport),
        player.name,
        player.id
      );

      const marker = new google.maps.Marker({
        position: player.coords,
        map: this.map,
        title: player.name,
        zIndex: 100,
        icon: {
          url,
          size: new google.maps.Size(width, height),
          scaledSize: new google.maps.Size(width, height),
          anchor: new google.maps.Point(anchorX, anchorY)
        }
      });

      marker.addListener('click', () => this.openMateDetail(player.id));
      this.markers.push(marker);

    } catch (err) {
      console.error('Marker icon failed', err);
    }
  }


  createCompositeMarkerIcon(photoUrl: string, emoji: string, name: string, id: number): Promise<{
    url: string; width: number; height: number; anchorX: number; anchorY: number;
  }> {
    return new Promise((resolve) => {
      // Fixed canvas size
      const w = 180, h = 200;
      const avatarR = 25;
      const avatarCx = w / 2;
      const avatarCy = 110;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      // Calculate and Truncate the Name
      ctx.font = "600 15px sans-serif";
      const maxNameWidth = 100; // Maximum allowed width for the name (e.g., 100-120px)
      let displayName = name;

      // Truncation logic
      let nameWidth = ctx.measureText(displayName).width;
      if (nameWidth > maxNameWidth) {
        // Append ellipsis and re-measure until it fits
        while (displayName.length > 0 && ctx.measureText(displayName + '...').width > maxNameWidth) {
          displayName = displayName.substring(0, displayName.length - 1);
        }
        displayName += '...';
        nameWidth = ctx.measureText(displayName).width; // Use final truncated width
      }

      // Calculate Pill Width using the final nameWidth
      const pillY = 35;
      const pillH = 34;
      const arrowH = 10;
      const radius = pillH / 2;

      const emojiWidth = 20;
      const arrowWidth = 15;
      const paddingAndSpacing = 10 + 5 + 5 + 10; // LeftPad + Spacing + Spacing + RightPad

      const pillW = nameWidth + emojiWidth + arrowWidth + paddingAndSpacing;
      const pillX = (w - pillW) / 2; // Center the pill within the 180px canvas

      // clear bg
      ctx.clearRect(0, 0, w, h);

      // Draw name bubble (pill)
      ctx.beginPath();

      // Rounded pill shape
      ctx.moveTo(pillX + radius, pillY);
      ctx.lineTo(pillX + pillW - radius, pillY);
      ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + radius);
      ctx.lineTo(pillX + pillW, pillY + pillH - radius);
      ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - radius, pillY + pillH);
      ctx.lineTo(pillX + pillW / 2 + 10, pillY + pillH);
      ctx.lineTo(pillX + pillW / 2, pillY + pillH + arrowH); // arrow tip
      ctx.lineTo(pillX + pillW / 2 - 10, pillY + pillH);
      ctx.lineTo(pillX + radius, pillY + pillH);
      ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - radius);
      ctx.lineTo(pillX, pillY + radius);
      ctx.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
      ctx.closePath();

      // Fill with white and shadow

      const isSelected = this.selectedPlayerId === id;

      ctx.fillStyle = isSelected ? '#FF4E18' : "#ffffff";
      ctx.shadowColor = "#0000004d";
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.shadowBlur = 0;

      // border stroke
      ctx.strokeStyle = "#0000001a";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Text Elements using displayName
      const startX = pillX + 10; // Starting point (left padding)

      // Emoji on left
      ctx.font = "18px serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, startX, pillY + pillH / 2);

      const nameStartX = startX + emojiWidth + 5; // Emoji position + estimated width + spacing

      // Name text
      ctx.font = "600 15px sans-serif";
      ctx.fillStyle = isSelected ? "#ffffff" : "#628B9F";
      ctx.textAlign = "left";
      ctx.fillText(displayName, nameStartX, pillY + pillH / 2 + 1);

      // Arrow mark (>)
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("›", pillX + 5 + pillW - 20, pillY + pillH / 2 + 1);

      // Draw avatar (circle)
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = photoUrl;

      img.onload = () => {
        // soft shadow under avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCx, avatarCy + 3, avatarR + 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fill();
        ctx.restore();

        // clip + draw
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCx, avatarCy, avatarR, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const scale = Math.max((avatarR * 2) / img.width, (avatarR * 2) / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        ctx.drawImage(img, avatarCx - sw / 2, avatarCy - sh / 2, sw, sh);
        ctx.restore();

        // white ring
        ctx.beginPath();
        ctx.arc(avatarCx, avatarCy, avatarR + 3, 0, Math.PI * 2);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 5;
        ctx.stroke();

        const url = canvas.toDataURL("image/png");
        resolve({ url, width: w, height: h, anchorX: w / 2, anchorY: h - 5 });
      };

      img.onerror = () => {
        ctx.beginPath();
        ctx.arc(avatarCx, avatarCy, avatarR, 0, Math.PI * 2);
        ctx.fillStyle = "#ccc";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 5;
        ctx.stroke();

        const url = canvas.toDataURL("image/png");
        resolve({ url, width: w, height: h, anchorX: w / 2, anchorY: h - 5 });
      };
    });
  }

  // remove markers
  clearMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.badgeMarkers.forEach(m => m.setMap(null));
    this.markers = [];
    this.badgeMarkers = [];
  }

  // small utility to produce emoji per game
  gameEmoji(g: SportType) {
    switch (g) {
      case 'Badminton': return '🏸';
      case 'Cricket': return '🏏';
      case 'Cycling': return '🚴';
      case 'Tennis': return '🎾';
      case 'Football': return '⚽';
      case 'Running': return '🏃';
      case 'Swimming': return '🏊';
      case 'Yoga': return '🧘';
      case 'Basketball': return '🏀';
      default: return '🎯';
    }
  }

  // clicking a bottom-card photo should center & open popup
  openMateDetail(id: number) {
    this.router.navigate(['dashboard/mate-detail', id]);
  }

  async updateMarkerIcon(player: MateListItem, marker: google.maps.Marker) {
    try {
      const { url, width, height, anchorX, anchorY } = await this.createCompositeMarkerIcon(
        player.profileImg,
        this.gameEmoji(player.sport),
        player.name,
        player.id
      );

      marker.setIcon({
        url,
        size: new google.maps.Size(width, height),
        scaledSize: new google.maps.Size(width, height),
        anchor: new google.maps.Point(anchorX, anchorY)
      });
    } catch (err) {
      console.error('Failed to update marker icon', err);
    }
  }

  onCarouselScroll() {
    if (!this.carouselRef) return;

    const scrollEl = this.carouselRef.nativeElement;
    const children = Array.from(scrollEl.children) as HTMLElement[];

    const scrollLeft = scrollEl.scrollLeft;
    const center = scrollEl.offsetWidth / 2 + scrollLeft;

    let closestCard: any = null;
    let minDistance = Number.MAX_VALUE;

    children.forEach(child => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(center - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestCard = child;
      }
    });

    if (closestCard) {
      const id = Number(closestCard.id.replace('card-', ''));
      if (this.selectedPlayerId !== id) {
        this.selectedPlayerId = id;

        // update all markers for selection
        this.visiblePlayers().forEach(v => {
          const marker = this.markers.find(m => m.getTitle() === v.name);
          if (marker) this.updateMarkerIcon(v, marker);
        });

        // pan map to centered player
        const player = this.visiblePlayers().find(v => v.id === id);
        if (player) this.map.panTo(player.coords);
      }
    }
  }

  interested() {

  }

  chat() {

  }
}