import { GoogleApiService } from './google-api.service';
import { Component } from '@angular/core';
import { UserInfo } from './google-api.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'google-auth-service';
  userInfo?: UserInfo;
  mailSnippets: Array<any> = [];

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

  async getEmails() {
    if (!this.userInfo) {
      return;
    }

    const userId = this.userInfo?.info?.sub as string;
    try {
      const messages = await lastValueFrom(this.googleApi.emails(userId));
      messages.messages.forEach(async (message: any) => {
        const email = await lastValueFrom(this.googleApi.getMail(userId, message.id));
        console.log(email);
        this.mailSnippets.push(email.snippet);
      });

    } catch (error) {
      console.warn(error);
    }
  }
}
