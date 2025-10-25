import { Component, effect, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HomeService } from '../../services/home-service';
import { Router } from '@angular/router';
interface Player {
  id: number;
  name: string;
  photo: string; // avatar URL
  game: 'Badminton' | 'Cricket' | 'Cycling' | 'Tennis' | 'Football' | 'Running' | 'Swimming' | 'Yoga' | 'Basketball';
  coords: { lat: number; lng: number; };
}
@Component({
  selector: 'app-mate-map-view',
  templateUrl: './mate-map-view.component.html',
  styleUrls: ['./mate-map-view.component.scss'],
  imports: [IonContent]
})
export class MateMapViewComponent {
  private router = inject(Router);
  homeService = inject(HomeService);

  @ViewChild('mapRef', { static: false }) mapElement!: ElementRef;
  @ViewChild('carouselRef', { static: false }) carouselRef!: ElementRef<HTMLDivElement>;
  @Input() activeTab!: 'list' | 'map';

  map!: google.maps.Map;
  infoWindow!: google.maps.InfoWindow;
  userMarker!: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  badgeMarkers: google.maps.Marker[] = [];

  // Default radius in kilometers
  radiusKm = this.homeService.range();

  // Current location (fallback to Chennai if geolocation fails)
  current = { lat: 13.0827, lng: 80.2707 };

  // Dummy players around Chennai with offsets for demo
  // players: Player[] = [
  //   { id: 1, name: 'Amelia', photo: 'assets/avatars/avatar1.jfif', game: 'Badminton', coords: { lat: 13.0184, lng: 80.2100 } },
  //   { id: 2, name: 'Emma', photo: 'assets/avatars/avatar2.jfif', game: 'Cycling', coords: { lat: 13.0150, lng: 80.2000 } },
  //   { id: 3, name: 'Joseph', photo: 'assets/avatars/avatar3.jfif', game: 'Cricket', coords: { lat: 13.0900, lng: 80.2200 } },
  //   { id: 4, name: 'Martin', photo: 'assets/avatars/avatar4.jpg', game: 'Tennis', coords: { lat: 13.0200, lng: 80.2350 } },
  // ];


  players: Player[] = [
    {
      "id": 1,
      "name": "Amelia",
      "photo": "assets/avatars/avatar1.jfif",
      "game": "Badminton",
      "coords": { "lat": 13.0752, "lng": 80.2905 }
    },
    {
      "id": 2,
      "name": "Rahul",
      "photo": "assets/avatars/avatar2.jfif",
      "game": "Cycling",
      "coords": { "lat": 13.0901, "lng": 80.2650 }
    },
    {
      "id": 3,
      "name": "Meera",
      "photo": "assets/avatars/avatar3.jfif",
      "game": "Cricket",
      "coords": { "lat": 13.0705, "lng": 80.2555 }
    },
    {
      "id": 4,
      "name": "Karthik",
      "photo": "assets/avatars/avatar4.jfif",
      "game": "Football",
      "coords": { "lat": 13.0450, "lng": 80.2489 }
    },
    {
      "id": 5,
      "name": "Sophia",
      "photo": "assets/avatars/avatar5.jfif",
      "game": "Running",
      "coords": { "lat": 13.0600, "lng": 80.2950 }
    },
    {
      "id": 6,
      "name": "Vikram",
      "photo": "assets/avatars/avatar6.jfif",
      "game": "Swimming",
      "coords": { "lat": 13.1005, "lng": 80.3055 }
    },
    {
      "id": 7,
      "name": "Priya",
      "photo": "assets/avatars/avatar7.jfif",
      "game": "Tennis",
      "coords": { "lat": 13.1420, "lng": 80.2005 }
    },
    {
      "id": 8,
      "name": "Arjun",
      "photo": "assets/avatars/avatar8.jfif",
      "game": "Basketball",
      "coords": { "lat": 13.0255, "lng": 80.3205 }
    },
    {
      "id": 9,
      "name": "Nisha",
      "photo": "assets/avatars/avatar9.jfif",
      "game": "Yoga",
      "coords": { "lat": 13.1550, "lng": 80.2455 }
    }
  ]


  // players currently shown within radius
  visiblePlayers: Array<{ player: Player; distanceKm: number }> = [];

  selectedPlayerId: number | null = null;


  constructor() {
    // Effect runs whenever range or activeTab changes
    effect(() => {
      if (this.homeService.segmentView() === 'map') {
        this.calculateMap(this.homeService.range());
      }
    });
  }


  calculateMap(range: number) {
    this.radiusKm = range;
    this.loadNearbyPlayers();
  }

  async ngAfterViewInit() {
    await this.initMap();
    this.loadNearbyPlayers();
  }

  async initMap() {
    // try browser geolocation
    try {
      const pos = await this.getCurrentPosition();
      this.current.lat = pos.coords.latitude;
      this.current.lng = pos.coords.longitude;
    } catch (err) {
      console.warn('Geolocation failed or denied — using fallback coordinates.', err);
    }

    const mapEl = this.mapElement.nativeElement as HTMLElement;
    this.map = new google.maps.Map(mapEl, {
      center: this.current,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false
    });

    this.infoWindow = new google.maps.InfoWindow();

    // marker for current location
    this.userMarker = new google.maps.Marker({
      position: this.current,
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
    const circle = new google.maps.Circle({
      strokeColor: '#2E86DE',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#2E86DE',
      fillOpacity: 0.08,
      map: this.map,
      center: this.current,
      radius: this.radiusKm * 1000
    });

    // update circle when radius changes
    (this as any)._circle = circle;
  }

  // helper: get geolocation promise
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject('No geolocation');
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
    });
  }

  // main: compute visible players within radius and render markers + bottom cards
  loadNearbyPlayers() {
    // clear existing markers
    this.clearMarkers();

    // compute distances
    const arr = this.players.map(p => {
      const d = this.distanceKm(this.current.lat, this.current.lng, p.coords.lat, p.coords.lng);
      return { player: p, distanceKm: Math.round(d * 100) / 100 };
    });

    // filter by radius
    this.visiblePlayers = arr.filter(x => x.distanceKm <= this.radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    // show only up to 4 in bottom cards for the initial UI (but you can scroll horizontally)
    // create markers for visible players
    this.visiblePlayers.forEach(item => this.addPlayerMarker(item.player, item.distanceKm));

    // update circle radius & center
    const circle: google.maps.Circle = (this as any)._circle;
    if (circle) {
      circle.setCenter(this.current);
      circle.setRadius(this.radiusKm * 1000);
    }

    // adjust map bounds to include user + visible players comfortably
    this.fitBounds();
  }

  // --- updated addPlayerMarker (minimal change) ---
  async addPlayerMarker(player: Player, distanceKm: number) {
    try {
      const { url, width, height, anchorX, anchorY } = await this.createCompositeMarkerIcon(
        player.photo,
        this.gameEmoji(player.game),
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
      const w = 180, h = 200;
      const avatarR = 25;
      const avatarCx = w / 2;
      const avatarCy = 110;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      // clear bg
      ctx.clearRect(0, 0, w, h);

      // Draw name bubble (pill) with emoji and arrow
      const pillY = 35;
      const pillW = ctx.measureText(name).width + 80;
      const pillH = 34;
      const pillX = (w - pillW) / 2;
      const arrowH = 10;
      const radius = pillH / 2; // to make it oval

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

      //  border stroke
      ctx.strokeStyle = "#0000001a";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Emoji on left
      ctx.font = "18px serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, pillX + 10, pillY + pillH / 2);

      // Name text
      ctx.font = "600 15px sans-serif";
      ctx.fillStyle = isSelected ? "#ffffff" : "#628B9F";
      ctx.textAlign = "left";
      ctx.fillText(name, pillX + 35, pillY + pillH / 2 + 1);

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
  gameEmoji(g: Player['game']) {
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


  // compute distance between two lat/lon in km (Haversine)
  distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  deg2rad(deg: number) { return deg * (Math.PI / 180); }

  // fit bounds around current + visible players
  fitBounds() {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(this.current);
    this.visiblePlayers.forEach(v => bounds.extend(v.player.coords));
    this.map.fitBounds(bounds, 120);
  }

  // change radius (ui bound)
  onRadiusChange(newVal: any) {
    this.radiusKm = newVal;
    this.loadNearbyPlayers();
  }

  // clicking a bottom-card photo should center & open popup
  openMateDetail(id: number) {
    this.router.navigate(['dashboard/mate-detail', id]);
  }

  async updateMarkerIcon(player: Player, marker: google.maps.Marker) {
    try {
      const { url, width, height, anchorX, anchorY } = await this.createCompositeMarkerIcon(
        player.photo,
        this.gameEmoji(player.game),
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
        this.visiblePlayers.forEach(v => {
          const marker = this.markers.find(m => m.getTitle() === v.player.name);
          if (marker) this.updateMarkerIcon(v.player, marker);
        });

        // pan map to centered player
        const player = this.visiblePlayers.find(v => v.player.id === id)?.player;
        if (player) this.map.panTo(player.coords);
      }
    }
  }

  trackByOption(index: number, item: any): any {
    return item.id || index;
  }

}
