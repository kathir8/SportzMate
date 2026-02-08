import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';
import { GlobalLoadingService } from '../services/global-loading-service';

const SKIP_AUTH_URLS: readonly string[] = [
    '/login',
    '/register',
    '/checkuserexistmailid'
];

function shouldSkipAuth(url: string): boolean {
    return SKIP_AUTH_URLS.some(skip => url.includes(skip));
}

let offlineToastShown = false;

export const authInterceptor: HttpInterceptorFn = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {

    const loader = inject(GlobalLoadingService);
    const toast = inject(IonicToastService);
    const auth = inject(Auth);

    loader.start();

    let handledRequest$;

    if (shouldSkipAuth(request.url)) {
        handledRequest$ = next(request);
    } else {
        const user = auth.currentUser;

        if (!user) {
            handledRequest$ = next(request);
        } else {
            handledRequest$ = from(user.getIdToken()).pipe(
                switchMap((token: string) => {
                    const isFormData = request.body instanceof FormData;

                    const modifiedRequest = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                            'X-Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                            'X-Request-Time-UTC': new Date().toISOString()
                        }
                    });
                    return next(modifiedRequest);
                })
            );
        }
    }

    return handledRequest$.pipe(
        catchError((error: HttpErrorResponse) => {

            
            if (error.status === 0 && !navigator.onLine) {
                loader.reset();
                if (!offlineToastShown) {
                    offlineToastShown = true;
                    toast.show('No internet connection. Please check your network.');
                    return throwError(() => error);
                }
            }
            console.error('[HTTP ERROR]', {
                url: request.url,
                status: error.status,
                message: error.message
            });

            const message = error.error?.rspMsg ?? 'Something went wrong. Please try again.';

            toast.show(message);

            return throwError(() => error);
        }),
        finalize(() => {
            loader.stop();
        })
    );
};
