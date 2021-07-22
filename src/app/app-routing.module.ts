import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BookdetailComponent } from './bookdetail/bookdetail.component';
import { CreatebookComponent } from './createbook/createbook.component';
import { AllBookComponent } from './all-books/all-book..component';
import { LibraryComponent } from './library/library.component';
import { LogoutComponent } from './auth/logout/logout.component';

const routes: Routes = [
  { path: 'sign-up', component: SignupComponent },
  { path: '', component: LoginComponent },
  { path: 'login',   component: LoginComponent },
  { path: 'logout',   component: LogoutComponent ,canActivate: [AuthGuard]},
  { path: 'book',   component: AllBookComponent , canActivate: [AuthGuard]},
  { path: 'my-library',   component: LibraryComponent , canActivate: [AuthGuard]},
  { path: 'create-book',   component: CreatebookComponent, canActivate: [AuthGuard] },
  { path: 'detail/:id', component: BookdetailComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
