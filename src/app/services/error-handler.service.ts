import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {NotificationService} from '../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private notificationService: NotificationService) { }

  handleAppError(message: string, error){
    console.log(message + error.message);
  }

  handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    this.notificationService.showError("Sorry for the inconvenince but something went wrong","Error")
    return throwError(errorMessage);
  }
}
