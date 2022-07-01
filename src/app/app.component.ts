import { GoogleApiService } from './google-api.service';
import { Component } from '@angular/core';
import { UserInfo } from './google-api.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'google-auth-service';
  userInfo?: UserInfo;

  constructor(private googleApi: GoogleApiService) {
    googleApi.userProfileSubject.subscribe(info => {
      this.userInfo = info;
    });
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  logOut() {
    this.googleApi.signOut();
  }
}
