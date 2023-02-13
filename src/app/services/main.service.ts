import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Exportlink } from '../models/exportlink';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private httpClient: HttpClient) {}

  url = 'https://pfizer-pulse.rj.r.appspot.com';

  //List of URL in the xlsx file passed by user
  original_urls_list = [''];

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

  public sendRequestUsingList() {
    console.log(`********INÌCIO: ${new Date().toString()}`);
    console.log('Gerando endpoints...');
    let json_data = { list_of_endpoints: this.original_urls_list };
    this.httpClient
      .post<any>(
        this.url+'/api/generateEndpointsFromList',
        json_data
      )
      .subscribe((response) => {
        this.endpointsList = response.download_url_list;
        console.log('Iniciando Downloads');
        this.sendRequestToEndpoints();
      });
  }

  //Sends the endpoints to API to get the blob response to download the .xlsx file
  public sendRequestToEndpoints() {
    //Remove the first null item from the list
    this.removeFirstItemFromList();
    this.getEndpointList().forEach((ep) => {
      let json_data = { endpoint: ep };
      this.httpClient
        .post(this.url + '/api/downloadfiles', json_data, {
          responseType: 'blob' as 'json',
        })
        .subscribe((response) => {
          // handle the response from the endpoint
          console.log('Download Realizado : ' + ep);
          //downloads the reponse as a .xlsx file
          this.downloadExcelFile(response, 'response.xlsx');
          console.log(`TIME: ${new Date().toString()}`);
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

  // //Iterates with the url list to send each url to backend and return the endpoint to download the file
  // public generateEndpoints(url_list: string[]) {
  //   url_list.forEach((url) => {
  //     //creates the json with the url to send to backend
  //     const json_data = {
  //       url: url,
  //     };

  //     this.httpClient
  //       .post<Exportlink>(
  //         'http://localhost:5000/api/generateEndpoints',
  //         json_data
  //       )
  //       .subscribe((response) => {
  //         //when the backend returns the endpoint, adds it to List
  //         this.addEndpointsList(String(response.link));
  //         //console.log(response.link);
  //       });
  //   });
  // }

  // // In the component class
  // endpoints2 = [
  //   // 'https://www.youtube.com/watch?v=N15Mdo4V6HI',
  //   // 'https://www.youtube.com/watch?v=47ZULUxquqo',
  //   // 'https://www.youtube.com/watch?v=kGGx7Ykuz5s',
  //   // 'https://www.youtube.com/watch?v=Q6_Ij8KJvmo',
  //   // 'https://www.youtube.com/watch?v=A5Qp3In7EnY',
  //   // 'https://www.youtube.com/watch?v=_IflIp664EY',
  //   // 'https://www.youtube.com/watch?v=p5iSjhZXIks',
  //   // 'https://www.youtube.com/watch?v=K6KA41Tas8w',
  //   // 'https://www.youtube.com/watch?v=_DeY6zCSfUs',
  //   // 'https://www.youtube.com/watch?v=qsVFEw6faK0',
  //   // 'https://www.youtube.com/watch?v=Xjj4xVsCjP4',
  //   // 'https://www.youtube.com/watch?v=b-cnpAM2rjU',
  //   // 'https://www.youtube.com/watch?v=BuB-Dxqgw3c',
  //   // 'https://www.youtube.com/watch?v=cN27q94RPkQ',
  //   // 'https://www.youtube.com/watch?v=7n6lCiYVL-w',
  //   // 'https://www.youtube.com/watch?v=ftRbF_e-kO0',
  //   // 'https://www.youtube.com/watch?v=0-S52v4rcC8',
  //   // 'https://www.youtube.com/watch?v=KDhB5-7kTEg',
  //   // 'https://www.youtube.com/watch?v=bSX9tJjFQbY',
  //   // 'https://www.youtube.com/watch?v=0XVtdyq2iB0',
  //   // 'https://www.youtube.com/watch?v=u7sHG3euKlY',
  //   'https://www.youtube.com/watch?v=jIt2fSwkyAY',
  //   'https://www.youtube.com/watch?v=P1wXlMQcB74',
  //   'https://www.youtube.com/watch?v=C8_XPWSV5oo',
  //   'https://www.youtube.com/watch?v=CHJvqMnjsq8',
  //   'https://www.youtube.com/watch?v=VI-QIH1dHaM',
  //   'https://www.youtube.com/watch?v=8yGSw_eF7qw',
  //   'https://www.youtube.com/watch?v=gmGfP5NvuO4',
  //   'https://www.youtube.com/watch?v=6SDvKP611Mk',
  //   'https://www.youtube.com/watch?v=d3lG37K9Lp8',
  //   'https://www.youtube.com/watch?v=I-Md2XkHd90',
  //   'https://www.youtube.com/watch?v=p1IIqUZRtkM',
  //   // 'https://www.youtube.com/watch?v=BEnj8ZaIock',
  //   // 'https://www.youtube.com/watch?v=qMz2GorEhjo',
  //   // 'https://www.youtube.com/watch?v=okfYDmgA8fE',
  //   // 'https://www.youtube.com/watch?v=KAT85FVqINY',
  //   // 'https://www.youtube.com/watch?v=z5v1SXcvXwE',
  //   // 'https://www.youtube.com/watch?v=TPRY2sZgBD4',
  //   // 'https://www.youtube.com/watch?v=qOrlJNf6MZw',
  //   // 'https://www.youtube.com/watch?v=K6KIa8blGjc',
  //   // 'https://www.youtube.com/watch?v=4UvHTdbqXYE',
  //   // 'https://www.youtube.com/watch?v=3SHpc4MYWgY',
  //   // 'https://www.youtube.com/watch?v=eS4sXDE0xgU',
  //   // 'https://www.youtube.com/watch?v=aFb1a-m3rYY',
  //   // 'https://www.youtube.com/watch?v=S-sHCkOXk2M',
  //   // 'https://www.youtube.com/watch?v=mQMINTVSeLE',
  //   // 'https://www.youtube.com/watch?v=b03MmguALwk',
  //   // 'https://www.youtube.com/watch?v=BzcUckwS3q4',
  //   // 'https://www.youtube.com/watch?v=LT5b1x9fXgs',
  //   // 'https://www.youtube.com/watch?v=O8BVw3WD4sM',
  //   // 'https://www.youtube.com/watch?v=F1e_DA_RloY',
  // ];

  // public sendUsingInterval() {
  //   let i = 0;

  //   setInterval(() => {
  //     if (i < this.endpoints2.length) {
  //       this.sendRequest(this.endpoints2[i]);
  //       i++;
  //     }
  //   }, 1000);
  // }

  // sendRequest(endpoint: string) {
  //   let json_data = { url: endpoint };
  //   this.httpClient
  //     .post<Exportlink>(
  //       'http://localhost:5000/api/generateEndpoints',
  //       json_data
  //     )
  //     .subscribe((response) => {
  //       //when the backend returns the endpoint, adds it to List
  //       this.addEndpointsList(String(response.link));
  //       //console.log(response.link);
  //     });
  //}
}
