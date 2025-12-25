import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { IonicToastService } from 'src/app/shared/components/ionic-toast/ionic-toast.service';

const SKIP_AUTH_URLS: readonly string[] = [
    '/login',
    '/register',
    '/checkuserexistmailid'
];

function shouldSkipAuth(url: string): boolean {
    return SKIP_AUTH_URLS.some(skip => url.includes(skip));
}

export const authInterceptor: HttpInterceptorFn = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {

    if (shouldSkipAuth(request.url)) {
        return next(request);
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        return next(request);
    }

    const toast = inject(IonicToastService);

    return from(user.getIdToken()).pipe(
        switchMap((token: string) => {
            const modifiedRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                    'X-Request-Time-UTC': new Date().toISOString()
                }
            });

            return next(modifiedRequest);
        }),
        catchError((error: HttpErrorResponse) => {
            console.error('[HTTP ERROR]', {
                url: request.url,
                status: error.status,
                message: error.message
            });

            const message =
                error.status === 0
                    ? 'Network error. Please check your internet.'
                    : error.error?.resMsg ??
                    'Something went wrong. Please try again.';

            toast.show(message);

            return throwError(() => error);
        })
    );
};
