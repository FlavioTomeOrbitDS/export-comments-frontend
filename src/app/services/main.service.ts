import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  httpResponse: any;
  constructor(private httpClient: HttpClient, private router: Router) {}

  /*Backend Links */

  //url = 'https://pfizer-pulse.rj.r.appspot.com';
  //url = 'https://export-comments-backend-nylbyrwc2q-uc.a.run.app';
  url = 'http://127.0.0.1:5000';

  /*The variables 'exporting', 'downloading'and 'finishedOperation'
   are used to show and hide the banner of informations in the
   Download Page
  The informations are:
    - Gerando Links
    - Dowloading
    - Operação finalizada*/

  /* Gerando Links Banner*/
  private exporting = false;
  public getExporting() {
    return this.exporting;
  }

  public setExporting(flag: boolean) {
    this.exporting = flag;
  }

  /* Downloading Banner*/
  private downloading = false;

  public getDownloading() {
    return this.downloading;
  }

  public setDownloading(flag: boolean) {
    this.downloading = flag;
  }

  /* Finished Operation Banner*/
  private finishedOperation = false;

  public getFinishedOperation() {
    return this.finishedOperation;
  }

  public setFinishedOperation(flag: boolean) {
    this.finishedOperation = flag;
  }

  /*List of URL in the xlsx file passed by user*/
  private original_urls_list: string[] = [];

  public addOriginal_urls_list(item: string) {
    this.original_urls_list.push(item);
  }

  public getOriginal_urls_list() {
    return this.original_urls_list;
  }

  public original_urls_listSlice() {
    this.original_urls_list = this.original_urls_list.slice(1);
  }

  public original_url_listDeleteItems() {
    this.original_urls_list = [];
  }

  //List of Endpoints returned by the API
  private endpointsList: any[] = [];

  public getEndpointList() {
    return this.endpointsList;
  }
  public addEndpointsList(original_url: string, endpoint: string) {
    this.endpointsList.push({ original_url: original_url, endpoint: endpoint });
  }
  //If the first item of list == '', remove it
  public removeFirstItemFromList() {
    this.endpointsList = this.endpointsList.slice(1);
  }

  /**List of endpoints returned by backend.
    Status can be: 0: Downloading;
                   1: Download Success;
                   2: Download Error */

  private endpointsListStatus = [
    { original_url: '', endpoint: '', status: '' },
  ];

  public getEndpointsListStatus() {
    return this.endpointsListStatus;
  }

  public addEndpointListStatus(
    original_url: string,
    endpoint: string,
    status: string
  ) {
    this.endpointsListStatus.push({
      original_url: original_url,
      endpoint: endpoint,
      status: status,
    });
  }

  public deleteEndPointsListStatus() {
    this.endpointsListStatus = [];
  }

  public removeFirstItemFromListStatus() {
    this.endpointsListStatus = this.endpointsListStatus.slice(1);
  }

  /* This function sends a list of links (original_urls_list) to the backend.
     The backend will return a list of endpoints that will be used to make the
      download of the .xlsx files */
  public sendRequestUsingList(): void {
    //show the 'Exporting...' in frontend
    this.setExporting(true);
    //flag used to determine whether the process has completed
    this.setFinishedOperation(false);
    //information logs
    console.log(`********INÌCIO: ${new Date().toString()}`);
    //console.log('Gerando endpoints...');
    //build the json data to send to backend
    let json_data = { list_of_endpoints: this.original_urls_list };
    //HTTP Post Method
    try {
      this.httpClient
        .post<any>(this.url + '/api/generateEndpointsFromList', json_data)
        .subscribe((response) => {
          //get the list that was returned by the backend
          this.endpointsList = response.download_url_list;
          console.log(this.endpointsList);
          //walks by the endpoint in the list to make the download
          this.endpointsList.map((e) => {
            //add the endpoints in the list with 'status' == 0 (downloading)
            if (e.endpoint != '')
              this.addEndpointListStatus(e.endpoint, e.full_download_url, '0');
          });
          console.log(this.getEndpointsListStatus());
          //send the endpoints to start the download process
          this.sendRequestToEndpoints();

          //hide the 'Exporting...' in the download page
          this.setExporting(false);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /*Sends the endpoints to API to get the blob response to download the .xlsx file**/
  public sendRequestToEndpoints() {
    //Remove the first null item from the list
    //this.removeFirstItemFromList();
    this.removeFirstItemFromListStatus();

    //For each item that is on the list
    this.getEndpointsListStatus().forEach((ep, index) => {
      //If the item URL is different from ''
      if (ep.endpoint != '') {
        //show the "Downloading" banner
        this.setDownloading(true);

        //build the json data to send to backend
        let json_data = { endpoint: ep.endpoint };

        try {
          this.httpClient
            .post(this.url + '/api/downloadfiles', json_data, {
              responseType: 'blob' as 'json',
            })
            .subscribe({
              //if the backend responds with 200 code
              next: (response) => {
                console.log('Download Realizado : ' + ep.endpoint);

                //set the item with 'downloaded' flag
                ep.status = '1';

                //downloads the reponse as a .xlsx file
                this.downloadExcelFile(response, 'response.xlsx');
                console.log(`TIME: ${new Date().toString()}`);

                //Count the items where the status is different from 0
                let i = this.getEndpointsListStatus().filter(
                  (e) => e.status != '0'
                ).length;
                if (i == this.getEndpointsListStatus().length) {
                  this.setDownloading(false);
                  this.setFinishedOperation(true);
                }
              },
              error: (e) => {
                ep.status = '2';
                let i = this.getEndpointsListStatus().filter(
                  (e) => e.status != '0'
                ).length;
                if (i == this.getEndpointsListStatus().length) {
                  this.setDownloading(false);
                  this.setFinishedOperation(true);
                }
              },
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
  /************************************************************************** */
  // public sendRequestToEndpointsPromisseAll() {
  //   //Remove the first null item from the list
  //   this.removeFirstItemFromList();
  //   console.log('fazendo download da poha toda !');

  //   Promise.all(
  //     this.getEndpointList().map((ep) => {
  //       let json_data = { endpoint: ep };

  //       this.httpClient.post(this.url + '/api/downloadfiles', json_data, {
  //         responseType: 'blob' as 'json',
  //       });
  //     })
  //   ).then((response) => {
  //     response.map((r) => console.log(r));
  //   });
  // }
  /************************************************************************** */
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
}
