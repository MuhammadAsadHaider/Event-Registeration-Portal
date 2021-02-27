import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventComponent} from './event/event.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {EventResolverService} from './services/event-resolver.service';

const routes: Routes = [
  {path: 'site/:id1/events/:id2', component: EventComponent, resolve: {events: EventResolverService}},
  {path: 'notfound', component: NotFoundComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
