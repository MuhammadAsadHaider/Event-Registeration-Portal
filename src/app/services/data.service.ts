import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Config } from '../services/config';
import { Helper } from '../helper';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private errorHandler: ErrorHandlerService, private http: HttpClient) { }

  getEvent<T>(model: T, id: string, sharepointSite: string, customProp?: Map<string, string>): Observable<T> {
    return this.http.get(`https://graph.microsoft.com/v1.0/sites/${Config.SharePointRootSite}.sharepoint.com:/sites/${sharepointSite}:/lists/${Config.EventsList}/items?$expand=fields&$filter=fields/EventId eq '${id}'`)
      .pipe(
        map(res => {
          if (res['value'].length == 0) {
            return model;
          }
          else {
            return Helper.mapper<T>(model, res['value'][0].fields, customProp);
          }
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getConfig<T>(model: T, id: string, sharepointSite: string): Observable<T> {
    return this.http.get(`https://graph.microsoft.com/v1.0/sites/${Config.SharePointRootSite}.sharepoint.com:/sites/${sharepointSite}:/lists/${Config.ConfigList}/items?$expand=fields&$filter=fields/EventId eq '${id}'`)
      .pipe(
        map(res => {
          if (res['value'].length == 0) {
            return model;
          }
          else {
            return Helper.mapper<T>(model, res['value'][0].fields);
          }
        }),
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  createRegistration<T>(fields: T, sharepointSite: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json'
    }
    const requestOptions = {
      headers: headers,
    };
    let requestBody = JSON.stringify({ fields });
    return this.http.post<any>(`https://graph.microsoft.com/v1.0/sites/${Config.SharePointRootSite}.sharepoint.com:/sites/${sharepointSite}:/lists/${Config.RegistrationsList}/items`, requestBody, requestOptions)
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  emailIsUnique(eventId: string, email: string, sharepointSite: string): Observable<boolean> {
    return this.http.get(`https://graph.microsoft.com/v1.0/sites/${Config.SharePointRootSite}.sharepoint.com:/sites/${sharepointSite}:/lists/${Config.RegistrationsList}/items?$expand=fields&$filter=fields/EventId eq '${eventId}' and fields/Email eq '${email}'`).pipe(
      map(res => {
        if (res['value'].length == 0) {
          return true;
        }
        else {
          return false;
        }
      }), catchError(error => this.errorHandler.handleError(error))
    );
  }
}
