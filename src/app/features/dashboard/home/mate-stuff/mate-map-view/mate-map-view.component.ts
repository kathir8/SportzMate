import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonContent, IonTitle, IonHeader, IonToolbar, IonButtons, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
interface Player {
  id: string;
  name: string;
  photo: string; // avatar URL
  game: 'Badminton' | 'Cricket' | 'Cycling' | 'Tennis';
  coords: { lat: number; lng: number; };
}
@Component({
  selector: 'app-mate-map-view',
  templateUrl: './mate-map-view.component.html',
  styleUrls: ['./mate-map-view.component.scss'],
  imports: [IonContent, IonTitle, IonHeader, IonToolbar, IonButtons, IonSegment, IonSegmentButton, IonLabel, CommonModule]
})
export class MateMapViewComponent {

   @ViewChild('mapRef', { static: false }) mapElement!: ElementRef;

  map!: google.maps.Map;
  infoWindow!: google.maps.InfoWindow;
  userMarker!: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  badgeMarkers: google.maps.Marker[] = [];

  // Default radius in kilometers
  radiusKm = 5;

  // Current location (fallback to Chennai if geolocation fails)
  current = { lat: 13.0827, lng: 80.2707 };

  // Dummy players around Chennai with offsets for demo
  players: Player[] = [
    { id: 'p1', name: 'Amelia', photo: 'https://i.pravatar.cc/150?img=12', game: 'Badminton', coords: { lat: 13.0184, lng: 80.2100 } },
    { id: 'p2', name: 'Joseph', photo: 'https://i.pravatar.cc/150?img=5', game: 'Cricket', coords: { lat: 13.0900, lng: 80.2200 } },
    { id: 'p3', name: 'Emma', photo: 'https://i.pravatar.cc/150?img=20', game: 'Cycling', coords: { lat: 13.0500, lng: 80.1550 } },
  ];

  // players currently shown within radius
  visiblePlayers: Array<{ player: Player; distanceKm: number }> = [];

  constructor() { }

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
                             .sort((a,b)=> a.distanceKm - b.distanceKm);

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

  // add a marker for player's avatar, and a small badge marker to show the game emoji
  addPlayerMarker(player: Player, distanceKm: number) {
    // avatar marker
    const avatarIcon: google.maps.Icon = {
      url: player.photo,
      scaledSize: new google.maps.Size(56, 56),
      anchor: new google.maps.Point(28, 28) // center anchor
    };

    const marker = new google.maps.Marker({
      position: player.coords,
      map: this.map,
      icon: avatarIcon,
      title: player.name,
      zIndex: 100
    });

    marker.addListener('click', () => {
      this.openPlayerInfo(player, marker, distanceKm);
      // scroll the bottom carousel to this player card (client-side)
      const el = document.getElementById('card-' + player.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    });

    this.markers.push(marker);

    // create a small badge icon using SVG data URL with game emoji
    const emoji = this.gameEmoji(player.game);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <circle cx="18" cy="18" r="18" fill="#fff" />
      <text x="50%" y="50%" font-size="18" dominant-baseline="middle" text-anchor="middle">${emoji}</text>
    </svg>`;
    const badgeIconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);

    // place badge slightly offset (so it doesn't cover avatar)
    const badgeMarker = new google.maps.Marker({
      position: { lat: player.coords.lat + 0.00015, lng: player.coords.lng + 0.00012 },
      map: this.map,
      icon: {
        url: badgeIconUrl,
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 18)
      },
      clickable: false,
      zIndex: 101
    });

    this.badgeMarkers.push(badgeMarker);
  }

  // when clicking a marker or carousel photo
  openPlayerInfo(player: Player, marker: google.maps.Marker, distKm: number) {
    const content = `
    <div style="display:flex; align-items:center; gap:10px;">
      <img src="${player.photo}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;"/>
      <div>
        <div style="font-weight:600;">${player.name}</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">${player.game} · ${distKm} km</div>
      </div>
    </div>
    `;
    this.infoWindow.setContent(content);
    this.infoWindow.open({ anchor: marker, map: this.map });
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
      default: return '⚽';
    }
  }

  // compute distance between two lat/lon in km (Haversine)
  distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  deg2rad(deg: number) { return deg * (Math.PI/180); }

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
  onCardClick(player: Player) {
    // find marker for this player
    const m = this.markers.find(x => x.getTitle() === player.name);
    const v = this.visiblePlayers.find(x => x.player.id === player.id);
    if (!m || !v) return;
    this.map.panTo(player.coords);
    this.map.setZoom(15);
    // small timeout to ensure pan completes
    setTimeout(()=> this.openPlayerInfo(player, m, v.distanceKm), 300);
  }

  // helper: number of players in bottom carousel (if many, it's scrollable)
  hasPlayers() {
    return this.visiblePlayers.length > 0;
  }

  // helper for rendering up to 4 cards at bottom, but allow horizontal scroll for more
  bottomPlayers() {
    return this.visiblePlayers;
  }

}
