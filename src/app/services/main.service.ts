import { MainComponent } from './../components/main/main.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
import { Exportlink } from '../models/exportlink';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private httpClient: HttpClient) {}

  //url = 'https://pfizer-pulse.rj.r.appspot.com';
  url = 'https://export-comments-backend-nylbyrwc2q-uc.a.run.app';
  //url = 'http://127.0.0.1:5000';
  /************************************************************************** */
  private exporting = false;

  public getExporting() {
    return this.exporting;
  }

  public setExporting(flag: boolean) {
    this.exporting = flag;
  }
  /************************************************************************** */
  private downloading = false;

  public getDownloading() {
    return this.downloading;
  }

  public setDownloading(flag: boolean) {
    this.downloading = flag;
  }
  /************************************************************************** */
  private finishedOperation = false;

  public getFinishedOperation() {
    return this.finishedOperation;
  }

  public setFinishedOperation(flag: boolean) {
    this.finishedOperation = flag;
  }
  /************************************************************************** */
  //List of URL in the xlsx file passed by user
  private original_urls_list = [''];

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
    this.original_urls_list = [''];
  }

  /************************************************************************** */
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
  /************************************************************************** */

  private endpointsListStatus = [{ url: '', status: '' }];
  ///private endpointsListStatus : string['url','status'] = []

  public getEndpointsListStatus() {
    return this.endpointsListStatus;
  }

  public addEndpointListStatus(endpoint: string, status: string) {
    this.endpointsListStatus.push({ url: endpoint, status: status });
  }

  public deleteEndPointsListStatus() {
    this.endpointsListStatus = [{ url: '', status: '' }];
  }

  public sendRequestUsingList() {
    //show the 'Exporting...' in frontend
    this.setExporting(true);
    //flag used to determine whether the process has completed
    this.setFinishedOperation(false);
    //information logs
    console.log(`********INÌCIO: ${new Date().toString()}`);
    console.log('Gerando endpoints...');
    //build the json data to send to backend
    let json_data = { list_of_endpoints: this.original_urls_list };
    //HTTP Post Method
    this.httpClient
      .post<any>(this.url + '/api/generateEndpointsFromList', json_data)
      .subscribe((response) => {
        //get the list that was returned by the backend
        this.endpointsList = response.download_url_list;
        this.endpointsList.map((e) => this.addEndpointListStatus(e, '0'));
        console.log('Iniciando Downloads');
        //send the endpoints to start the download process
        this.sendRequestToEndpoints();
        //hide the 'Exporting...' in the download page
        this.setExporting(false);
      });
  }
  /************************************************************************** */
  //Sends the endpoints to API to get the blob response to download the .xlsx file
  public sendRequestToEndpoints() {
    //Remove the first null item from the list
    this.removeFirstItemFromList();
    this.getEndpointsListStatus().forEach((ep, index) => {
      this.setDownloading(true);
      let json_data = { endpoint: ep.url };
      this.httpClient
        .post(this.url + '/api/downloadfiles', json_data, {
          responseType: 'blob' as 'json',
        })
        .subscribe((response) => {
          console.log(response);
          // handle the response from the endpoint
          console.log('Download Realizado : ' + ep.url);
          ep.status = '1';
          //downloads the reponse as a .xlsx file
          this.downloadExcelFile(response, 'response.xlsx');
          console.log(`TIME: ${new Date().toString()}`);
          if (index == this.getEndpointList().length - 1) {
            this.setDownloading(false);
            this.setFinishedOperation(true);
          }
        });
    });
  }
  /************************************************************************** */
  public sendRequestToEndpointsPromisseAll() {
    //Remove the first null item from the list
    this.removeFirstItemFromList();
    console.log('fazendo download da poha toda !');

    Promise.all(
      this.getEndpointList().map((ep) => {
        let json_data = { endpoint: ep };

        this.httpClient.post(this.url + '/api/downloadfiles', json_data, {
          responseType: 'blob' as 'json',
        });
      })
    ).then((response) => {
      response.map((r) => console.log(r));
    });
  }
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
