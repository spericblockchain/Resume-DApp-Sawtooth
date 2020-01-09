import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent, DialogOverviewExampleDialog } from './Components/home/home.component';
import { AddResumeComponent, DialogOverviewExampleDialo } from './Components/add-resume/add-resume.component';
import { ViewResumeComponent } from './Components/view-resume/view-resume.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './Components/navigation/navigation.component';
import { MaterialModule } from './Modules/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddResumeComponent,
    ViewResumeComponent,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialo,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ], entryComponents: [ DialogOverviewExampleDialog, DialogOverviewExampleDialo],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
