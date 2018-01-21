import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BreadcrumbModule } from './core/breadcrumb';
import { BreadComponent } from './example/breadcrumb/breadcrumb.component';
import { routes } from './route';
// import {BreadcrumbModule} from '@eastwest/breadcrumb';


@NgModule({
  declarations: [
    AppComponent,
    BreadComponent,
  ],
  imports: [
    BrowserModule,
    BreadcrumbModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
