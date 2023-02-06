import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Exportlink } from '../models/exportlink';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  //url = 'http://127.0.0.1:5000/api/getLink';
  url =
    'http://localhost:5000/api/teste?link=https://www.youtube.com/watch?v=mg7netw1JuM&t=8534s&ab_channel=GreenredProductions-RelaxingMusic';

  Link = '';
  constructor(private httpClient: HttpClient) {}

  getLink(): Observable<Exportlink> {
    //get the downloadLink to the xlsx file
    return this.httpClient.get<Exportlink>(this.url);
  }

  getDownloadResponse(downloadLink: any): Observable<any> {
    //return this.httpClient.get<Exportlink>(downloadLink);
    return this.httpClient.get<any>('http://localhost:5000/api/teste2', {
      responseType: 'blob' as 'json',
    });
  }

  //send a list of url to backend and return a list of downloads url
  sendData(url_list: any): Observable<Exportlink> {
    const json_data = {
      url_list: url_list,
    };

    return this.httpClient.post<Exportlink>(
      'http://localhost:5000/api/getDownloadLinks',
      json_data
    );
  }

  //send a single endpoint to backend, and return the .xlsx file as blob
  getLinksFromAPI(endpoint: string): Observable<any> {
    const json_data = { dowloadLink: endpoint };
    return this.httpClient.post<Exportlink>(
      'http://localhost:5000/api/downloadFile',
      json_data,
      { responseType: 'blob' as 'json' }
    );
  }
  //*********************************************************************** */
  generateEndpoints(url: any): Observable<Exportlink> {
    const json_data = {
      url: url,
    };
    return this.httpClient.post<Exportlink>(
      'http://localhost:5000/api/generateEndpoints',
      json_data
    );
  }

  sendRequestToEndpoints(endpoints: string[]) {
    endpoints.forEach((endpoint) => {
      let json_data = { endpoint: endpoint };
      this.httpClient
        .post('http://localhost:5000/api/downloadfiles', json_data, {
          responseType: 'blob' as 'json',
        })
        .subscribe((response) => {
          // handle the response from the endpoint
          console.log(response);
          this.downloadExcelFile(response, 'response.xlsx');
        });
    });
  }

  downloadExcelFile(data: any, filename: string) {
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

  // //send a list of endpoints to backend, and return the .xlsx files as blob
  // getLinksFromAPI(endpoints: string[]): Observable<any> {
  //   //create an json with the endpoints list to send to backend
  //   const json_data = { downloadLink: endpoints };
  //   return this.httpClient.post<Exportlink>(
  //     'http://localhost:5000/api/downloadFile',
  //     json_data,
  //     { responseType: 'blob' as 'json' }
  //   );
  // }
}
