import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Exportlink } from '../models/exportlink';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private httpClient: HttpClient) {}

  //List of Endponits returned by the API
  private endpointsList = [''];

  //Returns the List Items
  public getEndpointList() {
    return this.endpointsList;
  }
  //Add an Intem to the List
  public addEndpointsList(endpoint: string) {
    this.endpointsList.push(endpoint);
  }
  //If the first item of list == '', remove it
  public removeFirstItemFromList() {
    this.endpointsList = this.endpointsList.slice(1);
  }

  //Iterates with the url list to send each url to backend and return the endpoint to download the file
  public generateEndpoints(url_list: string[]) {
    url_list.forEach((url) => {
      //creates the json with the url to send to backend
      const json_data = {
        url: url,
      };

      this.httpClient
        .post<Exportlink>(
          'http://localhost:5000/api/generateEndpoints',
          json_data
        )
        .subscribe((response) => {
          //when the backend returns the endpoint, adds it to List
          this.addEndpointsList(String(response.link));
          //console.log(response.link);
        });
    });
  }

  //Sends the endpoints to API to get the blob response to download the .xlsx file
  public sendRequestToEndpoints() {
    //Remove the first null item from the list
    this.removeFirstItemFromList();
    this.getEndpointList().forEach((ep) => {
      let json_data = { endpoint: ep };
      this.httpClient
        .post('http://localhost:5000/api/downloadfiles', json_data, {
          responseType: 'blob' as 'json',
        })
        .subscribe((response) => {
          // handle the response from the endpoint
          console.log('Download Realizado : ' + ep);
          //downloads the reponse as a .xlsx file
          this.downloadExcelFile(response, 'response.xlsx');
        });
    });
  }

  private downloadExcelFile(data: any, filename: string) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
  // In the component class
  endpoints2 = [
    'https://www.youtube.com/watch?v=AwCPdZMfGaI',
    'https://www.youtube.com/watch?v=mLSuIGiX0LE',
    'https://www.youtube.com/watch?v=YW952Vlcx1o',
    'https://www.youtube.com/watch?v=Hr10JmjB0RI',
    'https://www.youtube.com/watch?v=fTy_X8ujfW4',
    'https://www.youtube.com/watch?v=8tg2cnsrftk',
    'https://www.youtube.com/watch?v=grkRMV5t0pg',
    'https://www.youtube.com/watch?v=6XFmLsqjTHs',
    'https://www.youtube.com/watch?v=_i_6dEkTorE',
    // 'https://www.youtube.com/watch?v=bkHuHgLWOkE',
    // 'https://www.youtube.com/watch?v=MuFMF4vjRiw',
    // 'https://www.youtube.com/watch?v=oBFTwKKxscs',
    // 'https://www.youtube.com/watch?v=29fOPudEPCI',
    // 'https://www.youtube.com/watch?v=jVsn0RsgLks',
    // 'https://www.youtube.com/watch?v=1Isj7gblGT0',
    // 'https://www.youtube.com/watch?v=vwH0C6D1uec',
    // 'https://www.youtube.com/watch?v=zFAfX9eEqvg',
    // 'https://www.youtube.com/watch?v=KelorSGCFhs',
    // 'https://www.youtube.com/watch?v=CKzCp7qqCts',
    // 'https://www.youtube.com/watch?v=LMnwHBtaefI',
    // 'https://www.youtube.com/watch?v=Yxxo6U6YgOc',
  ];

  public test() {
    let i = 0;

    setInterval(() => {
      if (i < this.endpoints2.length) {
        this.sendRequest(this.endpoints2[i]);
        i++;
      }
    }, 1000);
  }

  sendRequest(endpoint: string) {
    let json_data = { url: endpoint };
    this.httpClient
      .post<Exportlink>(
        'http://localhost:5000/api/generateEndpoints',
        json_data
      )
      .subscribe((response) => {
        //when the backend returns the endpoint, adds it to List
        //this.addEndpointsList(String(response.link));
        //console.log(response.link);
        let json_data = { endpoint: response.link };
        this.httpClient
          .post('http://localhost:5000/api/downloadfiles', json_data, {
            responseType: 'blob' as 'json',
          })
          .subscribe((response) => {
            // handle the response from the endpoint
            console.log('Download Realizado : ');
            //downloads the reponse as a .xlsx file
            this.downloadExcelFile(response, 'response.xlsx');
          });
      });
  }
}
