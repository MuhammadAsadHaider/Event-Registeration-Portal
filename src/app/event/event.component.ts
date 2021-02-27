import { Component, OnInit } from '@angular/core';
import { Event } from '../models/Event';
import { CustomConfig } from '../models/CustomConfig';
import { ActivatedRoute } from '@angular/router';
import { faCalendarAlt, faUserTie, faCalendarCheck, faExclamationCircle, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  calendarIcon = faCalendarAlt;
  registrationsOpeningIcon = faCalendarCheck;
  alertIcon = faExclamationCircle;
  hostIcon = faUserTie;
  event: Event;
  message: string;
  buttonColor: string;
  backgroundStyles: object = {};
  showReg: boolean = false;
  formSubmitted: boolean = false;
  registrationsOpen: boolean = true;
  registrationsClosed: boolean = false;
  siteName: string;
  logo: string;

  constructor(private activatedRoute: ActivatedRoute, private errorHandler: ErrorHandlerService, private titleService: Title) {
    this.event = new Event();
  }

  ngOnInit(): void {
    this.siteName = this.activatedRoute.snapshot.url[1].path;
    this.activatedRoute.data.subscribe((data) => {
      this.event = data.events.event;
      this.setConfig(data.events.config)
      if(this.event.Status == "Cancelled"){
        this.registrationsClosed = true;
        this.message = "Event Cancelled";
      }
      else if(this.event.RegistrationOpen > new Date(Date.now())){
        this.registrationsOpen = false;
      }
      else if(this.event.RegistrationClose < new Date(Date.now())){
        this.registrationsClosed = true;
        this.message = "Registration Closed";
      }
    }, (error)=> this.errorHandler.handleError(error));
  }
  onRegister(){
    this.showReg = !this.showReg;
  }
  onFormSubmitted(formSubmitted: boolean){
    this.formSubmitted = formSubmitted;
    this.message = "Registered Successfully";
    this.alertIcon = faClipboardCheck;
  }
  setConfig(config: CustomConfig){
    if(config.PageTitle != ""){
      this.titleService.setTitle(config.PageTitle);
    }
    if(config.BackgroundImageUrl != undefined && config.BackgroundImageUrl != ""){
      this.backgroundStyles['background-image'] = 'url(' + config.BackgroundImageUrl + ')'
    }
    this.buttonColor = config.Color;
    if(config.CustomBackgroundCSS != undefined && config.CustomBackgroundCSS != ""){
      let customStyles = JSON.parse(config.CustomBackgroundCSS);
      Object.assign(this.backgroundStyles, customStyles, this.backgroundStyles);
    }
    if(config.LogoUrl != undefined && config.LogoUrl != ""){
      this.logo = config.LogoUrl;
    }
  }
}
