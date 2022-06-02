import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import CryptoES from 'crypto-es';
import * as crypto from 'crypto';
import * as OAuth from 'oauth-1.0a';

@Injectable({
  providedIn: 'root',
})
export class HereMapService implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'OAuth',
      },
    });

    return next.handle(req);
  }

  public getHereMapToken(): Observable<any> {
    return this.http
      .post<any>('https://account.api.here.com/oauth2/token', {
        grant_type: 'client_credentials',
      })
      .pipe(map((result) => result));
  }

  public async getSpeedLimit(url: any) {
    const oauth = new OAuth({
      consumer: {
        key: 'V3R6bmLb4WmmDznqE-ellA',
        secret:
          '-55MNY49Ke_CuN55aUF1hZaE01LyXKgGgZzdSEoIytNW_9hMI7tPpujMQWlIsBiCEc-1D0juPGyRdQKVjonK1A', //Secret key
      },
      signature_method: 'HMAC-SHA256',
      hash_function(base_string, key) {
        let hash: any = CryptoES.enc.Base64.stringify(
          CryptoES.HmacSHA256(base_string, key)
        );
        console.log(hash);
        return hash;
        // return crypto
        //   .createHmac('sha256', key)
        //   .update(base_string)
        //   .digest('base64');
      },
    });
    const request_data = {
      url: 'https://account.api.here.com/oauth2/token',
      method: 'POST',
      data: 'grant_type=client_credentials',
    };

    this.http
      .post('https://account.api.here.com/oauth2/token', request_data.data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: oauth.toHeader(oauth.authorize(request_data))
            .Authorization,
        }),
      })
      .subscribe((res) => {
        console.log(res);
      });

    // this.http
    //   .request(
    //     request_data.method,

    //     request_data.url,
    //     {
    //       body: request_data.data,
    //       headers: oauth.toHeader(oauth.authorize(request_data)),
    //     }
    //   )
    //   .subscribe((e) => {
    //     console.log(e);
    //   });
    //   (error, response, body) => {
    //     if (response.statusCode == 200) {
    //       const result = JSON.parse(response.body);
    //       console.log('Token', result);
    //     }
    //   }
    // );

    const requestHeaders = {
      Authorization:
        'Bearer eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJCSmUyb3NiYkc1eElrZjVVVkY5SCIsImlhdCI6MTY1NDEzNDk2MCwiZXhwIjoxNjU0MjIxMzYwLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLnR4MURMUWtmNWJUc3Q0NHNDZklVQ2cuWHk1THg0RkM4QnZCSW5CTURkVE9vX2lRdk9HWkxoYzhleVd6djRyVkxmNy1RNWxreUFoaXVtMmxBdFNkRmliN2hUOWNyc3JQME9tckMtZlN4TVE1aGhKQTNrSlFjVlI2RUkxbzBrU0hKT0RIWTA4WlZEUW1GWW5rdFZuWE55LTBra040VmR1clBoWTNSb2k4RVYwaUR3LnhJRUZQdGx5M1lCd0g3Vy1MVVhPbTg1eEE4Y19ScTRNWTRDalg0SzJ0OGM.qBiQd0_S10Atgy-t83Qm51861s2EWLa6wP2binmMBauv-0KmmUUWTjxPjDBhj9oUG_VXa8s5a8EoYcZJtTW2rhAsZdhjjeHPHQX_Z3kA27PBB8P7OmjFFwF7pTUJy5ZZshg0RI4hA0cTpxTYe97G66OswRW7gUjiY3bsw2WrU-dX5iSTpw6xIJQP_2_3zFjA9HiANU76wwFtScbQvpiKe1BSDPDbjxzAFkT-gpJBt3Mt4LPlPHZSKFxIh57j0KKXTqhjTIAThnMAdklXDZWIcUzpzYUiWhKA09mFexqDysftmCBafj3zlflznD9CTC5FZAHCCD6hOkLibKiYPxg7ow',
    };

    let res: any;

    try {
      res = await fetch(url, {
        method: 'get',
        headers: requestHeaders,
      });
    } catch (e) {}

    return await res.json();
    // return this.http
    //   .get<any>('https://router.hereapi.com/v8/routes?', param)
    //   .pipe(map((result) => result));
  }
}
