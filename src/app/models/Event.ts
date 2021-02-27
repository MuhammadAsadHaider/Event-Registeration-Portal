export class Event{
  EventId: string;
  EventName: string;
  EventDescription: string;
  EventType: string;
  Owner: string;
  Status: string;
  Date: Date;
  RegistrationOpen: Date;
  RegistrationClose: Date;

  constructor(){
    this.EventId = "";
    this.EventName = "";
    this.EventDescription = ""
    this.EventType = "";
    this.Owner = "";
    this.Status = "";
    this.Date = new Date();
    this.RegistrationOpen = new Date();
    this.RegistrationClose = new Date();
  }
}
