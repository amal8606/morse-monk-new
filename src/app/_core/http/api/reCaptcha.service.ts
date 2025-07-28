import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ReCaptchaService {
  public http = inject(HttpClient);

  constructor() {}

  public postReCaptcha(captchaToken: any) {
    return this.http.post<any>(`${environment.api}/recaptcha/verify `, {
      token: captchaToken,
    });
  }
}
