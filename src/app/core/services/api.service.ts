// core/services/api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://sportzmate-api-288678239216.us-central1.run.app/sportmate';

  get<TResponse>(endpoint: string, params?: Record<string, any>): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.baseUrl}/${endpoint}`, { params })
      .pipe(
        catchError(err => {
          console.error('API Error', err);
          return throwError(() => err);
        })
      );
  }

  post<TRequest, TResponse>(endpoint: string, body: TRequest, params?:Record<string, string>): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.baseUrl}/${endpoint}`, body, {params}).pipe(
      catchError(err => {
        console.error('API Error', err);
        return throwError(() => err);
      })
    );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(err => {
        console.error('API Error', err);
        return throwError(() => err);
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(err => {
        console.error('API Error', err);
        return throwError(() => err);
      })
    );
  }
}
