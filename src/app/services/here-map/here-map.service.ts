import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import * as OAuth from 'oauth-1.0a';
import { Storage } from '@ionic/storage-angular';

// const request = require('request');

const SSL_KEY = 'show-speed-limit';

@Injectable({
  providedIn: 'root',
})
export class HereMapService {
  public showSpeedLimit: boolean;
  private token: string =
    null ||
    'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJCSmUyb3NiYkc1eElrZjVVVkY5SCIsImlhdCI6MTY1NDI3MjcwOCwiZXhwIjoxNjU0MzU5MTA4LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLndJaEh5eVhhVm5Uek14RmFiNFFhdWcuRVpJdzJaMnhVUXhYSE1aNzRta21aMlJBbFdKc2dJSVJkUDd4em1kbkJLMF8yZ1NMTG9uWXVJd0RocDhWaXNqSVRhM3VKLXRFN0drNWNYeko5bGhmTG9kSV9aYW9HOU5JOXNCTEtRMEQyZzhRejdka0F4NW5LdE5udm11a3N5QWJyeXMwVGl4aF9iNk95VWJrSkZEa1NnLmJDTDVYMVpHQzhqeERUTGdGZGhCLUhmMkVFNUp0aEVUNmszaVlxTklULVk.OSrF2Lm2EOdokc4lTHeRIniIUAUCZMsfiAyk-RNxpZhP4WML-ooa0JNrIhxiXTCuFgut8CUkWw6ICMfQUfptXH9ADyrdeFu1VZ22EllxXQ3ffFmDyfKiqEPCW0OMao92rAOtiS906qZMQtXn6MBcWpZh6MjDmX9UDXN7FyJuK0cp9b9FQ4bzq_euJRrvEB0YzWuAszZDfkKQe35uaEm1cV8sjwtbr1lhhW6gtH5d20dlZDF-QdNbEJjwd1AmEh6CyQWrbVBaR6aS95_Z40Zuf-0eGaPjebplBdAgcfojf7748Wp6fNilIc_qD_TJ9UpnDQRNwPevZb4ld8qltKGE2g';

  constructor(private storage: Storage) {}

  getHereMapToken() {
    const oauth = new OAuth({
      consumer: {
        key: 'V3R6bmLb4WmmDznqE-ellA',
        secret:
          '-55MNY49Ke_CuN55aUF1hZaE01LyXKgGgZzdSEoIytNW_9hMI7tPpujMQWlIsBiCEc-1D0juPGyRdQKVjonK1A', //Secret key
      },
      signature_method: 'HMAC-SHA256',
      hash_function(base_string, key) {
        return CryptoJS.enc.Base64.stringify(
          CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key)
            .update(base_string)
            .finalize()
        );
      },
    });

    const requestData = {
      url: 'https://account.api.here.com/oauth2/token',
      method: 'POST',
      data: { grant_type: 'client_credentials' },
    };

    // request(
    //   {
    //     url: requestData.url,
    //     method: requestData.method,
    //     form: requestData.data,
    //     headers: oauth.toHeader(oauth.authorize(requestData)),
    //   },
    //   (error: any, response: any, body: any) => {
    //     if (response.statusCode == 200) {
    //       this.token = JSON.parse(response.body).access_token;
    //       console.log(this.token);
    //     }
    //   }
    // );
  }

  public async getSpeedLimit(lat: number, lon: number) {
    if (!this.token) {
      return;
    }

    const requestHeaders = {
      authorization: 'Bearer ' + this.token,
    };

    const url =
      'https://router.hereapi.com/v8/routes?transportMode=car&destination=' +
      lat +
      ',' +
      lon +
      '&origin=' +
      lat +
      ',' +
      lon +
      '&return=polyline&spans=names,speedLimit';

    try {
      const res = await fetch(url, {
        method: 'get',
        headers: requestHeaders,
      });
      return await res.json();
    } catch (e) {
      return false;
    }
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
