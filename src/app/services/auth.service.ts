import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenRequestResponse } from '../models/TokenRequestResponse';
import { Config } from '../services/config';
import { ErrorHandlerService } from './error-handler.service';
import { Observable, from} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getDate(): number {
    return Math.ceil(Date.now() / 1000);
  }

  tokenExists(): boolean {
    return sessionStorage.getItem("Token") != null;
  }

  tokenExpired(): boolean {
    return (this.getDate() - Number(sessionStorage.getItem("TokenDate"))) > (Number(sessionStorage.getItem("TokenLife")) - 600);
  }

  private async fetchToken(): Promise<string> {
    if (this.tokenExists() && !this.tokenExpired()) {
      return sessionStorage.getItem("Token");
    }
    else {
      return await this.http.get<TokenRequestResponse>(Config.TokenRetrievalUrl).toPromise()
        .then(requestResponse => {
          sessionStorage.setItem('Token', requestResponse.access_token);
          sessionStorage.setItem('TokenDate', this.getDate().toString());
          sessionStorage.setItem('TokenLife', requestResponse.expires_in.toString());
          return requestResponse.access_token;
        })
        .catch(error => {
          this.errorHandler.handleError(error);
          return "";
        });
    }
  }
  getToken(): Observable<string>{
    return from(this.fetchToken());
  }
}
