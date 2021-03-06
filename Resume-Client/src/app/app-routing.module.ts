import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AddResumeComponent } from './Components/add-resume/add-resume.component';
import { ViewResumeComponent } from './Components/view-resume/view-resume.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },  
  {
    path: 'AddResume',
    component: AddResumeComponent
  }, 
  {
    path: 'ViewResume',
    component: ViewResumeComponent
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
