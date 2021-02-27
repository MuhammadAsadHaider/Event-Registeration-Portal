import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from './services/auth.service';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (req.url.startsWith("https://graph.microsoft.com")) {

      return this.auth.getToken().pipe(
        mergeMap(token => {
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
                Prefer: 'allowthrottleablequeries'
              }
            })
          }
          return next.handle(req);
        })
      );
    }
    else {
      return next.handle(req);
    }
  }
}