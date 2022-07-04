import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc'
import { Observable, Subject } from 'rxjs';
import { UserInfo } from './google-api.model';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '19895130825-36p1n7b0ujollp470pi27kdst1qu22vl.apps.googleusercontent.com',
  scope: "openid profile email https://www.googleapis.com/auth/gmail.readonly",
}


@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  gmail = 'https://gmail.googleapis.com';
  userProfileSubject = new Subject<UserInfo>();

  constructor(private readonly oAuthService: OAuthService,
    private readonly httpClient: HttpClient) {

    oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';
    oAuthService.configure(oAuthConfig);
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if (!oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow();
        } else {
          oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo)
          })
        }
      })
    })
  }

  emails(userId: string): Observable<any> {
    return this.httpClient.get(`${this.gmail}/gmail/v1/users/${userId}/messages`, { headers: this.authHeader() })
  }

  getMail(userId: string, mailId: string): Observable<any> {
    return this.httpClient.get(`${this.gmail}/gmail/v1/users/${userId}/messages/${mailId}`, { headers: this.authHeader() })
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signOut() {
    this.oAuthService.logOut();
  }

  authHeader(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.oAuthService.getAccessToken()}` })
  }
}
