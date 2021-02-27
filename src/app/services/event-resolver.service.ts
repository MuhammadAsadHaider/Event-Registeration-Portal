import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DataService } from './data.service';
import { tap, catchError, mergeMap, map } from 'rxjs/operators';
import { Event } from '../models/Event';
import { CustomConfig } from '../models/CustomConfig';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class EventResolverService implements Resolve<any>{

  constructor(private dataService: DataService,private router: Router, private errorHanlder: ErrorHandlerService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let siteName = route.url[1].path;
    let id = route.url[3].path;
    let event = new Event();
    let config = new CustomConfig();
    let customProp = new Map<string, string>([
      ["RegistrationOpen", "Event_x0020_Registration_x0020_O"],
      ["RegistrationClose", "Event_x0020_Registration_x0020_C"]
    ]);
    return this.dataService.getEvent(event, id, siteName,customProp).pipe(
      tap(event => {
        if(event.EventId === ""){
          this.router.navigate(['/notfound']);
        }
      }),
      mergeMap(event => {
        return this.dataService.getConfig(config, id, siteName).pipe(
          map(config => {return {config: config, event: event}})
        )
      }),
      catchError(error => this.errorHanlder.handleError(error))
    );
  }
}
