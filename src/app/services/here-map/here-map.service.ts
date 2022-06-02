import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import CryptoJS from 'crypto-js';
import * as OAuth from 'oauth-1.0a';
import { Storage } from '@ionic/storage-angular';

const SSL_KEY = 'show-speed-limit';

@Injectable({
  providedIn: 'root',
})
export class HereMapService {
  public showSpeedLimit: boolean;

  constructor(private http: HttpClient, private storage: Storage) {}

  public getHereMapToken(): Observable<any> {
    const oauth = new OAuth({
      consumer: {
        key: 'V3R6bmLb4WmmDznqE-ellA',
        secret:
          '-55MNY49Ke_CuN55aUF1hZaE01LyXKgGgZzdSEoIytNW_9hMI7tPpujMQWlIsBiCEc-1D0juPGyRdQKVjonK1A', //Secret key
      },
      signature_method: 'HMAC-SHA256',
      hash_function(base_string, key) {
        // let hash: any = CryptoES.enc.Base64.stringify(
        // CryptoES.HmacSHA256(base_string, key)
        // );
        return CryptoJS.enc.Base64.stringify(
          CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key)
            .update(base_string)
            .finalize()
        );
        // return CryptoJS.createHmac('sha256', key)
        //   .update(base_string)
        //   .digest('base64');
      },
    });

    const request_data = {
      url: 'https://account.api.here.com/oauth2/token',
      method: 'POST',
      data: 'grant_type=client_credentials',
    };

    return this.http
      .post('https://account.api.here.com/oauth2/token', request_data.data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: oauth.toHeader(oauth.authorize(request_data))
            .Authorization,
        }),
      })
      .pipe(
        map((result) => {
          return result;
        })
      );

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

    // return this.http
    //   .post<any>('https://account.api.here.com/oauth2/token', {
    //     grant_type: 'client_credentials',
    //   })
    //   .pipe(map((result) => result));
  }

  public async getSpeedLimit(url: any) {
    const requestHeaders = {
      Authorization:
        'Bearer eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJCSmUyb3NiYkc1eElrZjVVVkY5SCIsImlhdCI6MTY1NDE1MzkwOCwiZXhwIjoxNjU0MjQwMzA4LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLmRpbjFMMzZrc0NMbUlIQnRMVTFEZEEucUxqSVp3MnhjcUpPdTFwOTh1VVJCSnFpTEphZGpOUnBEdXBubjE3Ylprc0o0RWgzdFQ4MkpWUzdmMnBHUHRhbUJvajFHSnBlemRfN0JBaXduVC1Bdl95ZkdZREMtb1BMT3pOdzdKdGlhdW5ibGlhd3dhWFpzTjhMM1o4cWt5cEVUWnNXNkZvNGhfOXRtWUZhNFJxWkRRLlZXWTBtVlBVenlIS2tTRGdEclhPcE1vU2xBWDV3MS02YkEzVmdGU3FXSjA.jpV8efRuxicyX3hes3afNBywtIgWreLz3IUATcCcC9k1_BLhIRH-iACE3xZKB2c7XHeur_EmAJMMLrD0kmoUIYZ3l9GJ_fGkeCenve5hxwnJKyXaJ27VuBkIK77E9sMPxvQOK91KIqRHAwwRWzoUr-H0TcmT2Ee0qHFZ1zPEjIRamUbW7xW_Jg9tZbEElzoHovAmJ35Kg6mqfSsSrzroui-r7ZwVhcDnOLUjMU_XIOmjVaQw-Qi-pTnNTmfhM5Z8Sf1MaDs-3_1w3T4DVcd7L-x9Gj3eIP-k8QGt0UJpLN88qkE0rwFLKf7IKeXMElukPMRQ0L41mb2ScbCTX6z_EQ',
    };

    let res: any;

    try {
      res = await fetch(url, {
        method: 'get',
        headers: requestHeaders,
      });
    } catch (e) {}

    return await res.json();
  }

  public async getShowSpeedLimit() {
    await this.storage
      .get(SSL_KEY)
      .then((val) => {
        if (val !== null) {
          this.saveShowSpeedLimit(val);
        } else {
          this.saveShowSpeedLimit(true);
        }
      })
      .catch(() => {});
  }

  public async saveShowSpeedLimit(value: boolean) {
    this.showSpeedLimit = value;
    await this.storage.set(SSL_KEY, value);
  }
}
