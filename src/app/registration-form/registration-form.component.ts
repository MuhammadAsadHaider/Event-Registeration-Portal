import { Component, OnInit, Input, Output, EventEmitter, Testability } from '@angular/core';
import {Registration} from '../models/Registration';
import { DataService } from '../services/data.service';
import { faUserCircle, faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../services/notification.service';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  nameIcon = faUserCircle;
  mailIcon = faEnvelope;
  phoneIcon = faPhoneAlt;
  submitted: boolean = false;
  @Input() color: string;

  model: Registration;
  @Input() eventId: string;
  @Input() siteName: string;
  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private dataService: DataService, private notificationService: NotificationService) {
    this.model = new Registration();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.model.EventId = this.eventId;
    this.model.Title = this.eventId;
    this.dataService.emailIsUnique(this.model.EventId, this.model.Email, this.siteName).subscribe(isUnique => {
      if(isUnique){
        this.dataService.createRegistration(this.model,this.siteName).subscribe(() => {
          this.submitted = true;
          this.formSubmitted.emit(true);
          this.notificationService.showSuccess("You have registered!", "Success");
        });
      }
      else{
        this.notificationService.showWarning("There is already a registration associated with the entered email!","Registration failed");
      }
    });

  }

}
