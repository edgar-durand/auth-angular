import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(public http: HttpClient) {}

  get<returnType>(url: string, params?: HttpParams): Observable<returnType> {
    return this.http
      .get<returnType>(url, { params, observe: 'response' })
      .pipe(map(this.mapResponse));
  }

  post<returnType>(url: string, payload: unknown): Observable<returnType> {
    return this.http
      .post<returnType>(url, payload, { observe: 'response' })
      .pipe(map(this.mapResponse));
  }

  put<returnType>(url: string, payload: unknown): Observable<unknown> {
    return this.http
      .put<returnType>(url, payload, { observe: 'response' })
      .pipe(map(this.mapResponse));
  }

  delete<returnType>(url: string): Observable<unknown> {
    return this.http
      .delete<returnType>(url, { observe: 'response' })
      .pipe(map(this.mapResponse));
  }

  /**
   * Devuelve del objeto response la propiedad body
   *
   * @param response Respuesta http
   */
  mapResponse<returnType>(response: HttpResponse<returnType>): returnType {
    return response.body as returnType;
  }
}
