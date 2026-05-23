import { Injectable, inject } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GlobalLoadingService } from './global-loading-service';
import { Coordinates } from 'src/app/shared/models/shared.model';

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {
    private readonly loader = inject(GlobalLoadingService);

    async getCurrentPosition(): Promise<Coordinates> {
        try {
            // Check and request permission if needed
            const permissionStatus = await Geolocation.checkPermissions();

            if (permissionStatus.location === 'denied') {
                throw new Error('Location permission denied. Please enable it in app settings.');
            }

            if (permissionStatus.location !== 'granted') {
                const requestResult = await Geolocation.requestPermissions();
                if (requestResult.location !== 'granted') {
                    throw new Error('Location permission not granted');
                }
            }

            // Get current position
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });

            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Geolocation error:', errorMessage);
            throw {
                code: error instanceof GeolocationPositionError ? error.code : -1,
                message: errorMessage,
                name: error instanceof Error ? error.name : 'GeolocationError'
            };
        }
    }

    async watchPosition(callback: (coords: Coordinates) => void, errorCallback?: (error: any) => void): Promise<string> {
        try {
            const permissionStatus = await Geolocation.checkPermissions();

            if (permissionStatus.location === 'denied') {
                throw new Error('Location permission denied');
            }

            if (permissionStatus.location !== 'granted') {
                const requestResult = await Geolocation.requestPermissions();
                if (requestResult.location !== 'granted') {
                    throw new Error('Location permission not granted');
                }
            }

            const watchId = await Geolocation.watchPosition(
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                },
                (position, err) => {

                    if (err) {

                        const errorObj = {
                            code: err.code ?? -1,
                            message: err.message ?? 'Unknown geolocation error',
                        };

                        if (errorCallback) {
                            errorCallback(errorObj);
                        } else {
                            console.error('Geolocation watch error:', errorObj);
                        }

                        return;
                    }

                    if (position) {
                        callback({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    }
                }
            );

            return watchId;
        } catch (error) {
            const errorObj = {
                code: -1,
                message: error instanceof Error ? error.message : String(error),
                name: error instanceof Error ? error.name : 'GeolocationError'
            };
            if (errorCallback) {
                errorCallback(errorObj);
            }
            throw errorObj;
        }
    }

    async clearWatch(watchId: string): Promise<void> {
        await Geolocation.clearWatch({ id: watchId });
    }
}
