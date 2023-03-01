import { MainService } from './../../services/main.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private mainService: MainService, private router: Router) {
    this.mainService.setExporting(false);
  }

  @ViewChild('myButton')
  myButton!: ElementRef<HTMLElement>;
  @ViewChild('myCloseButton')
  myCloseButton!: ElementRef<HTMLElement>;

  modalMessage = '';
  modalTitle = '';

  fileName = '';

  getLinkCount(){
    return this.mainService.getOriginal_urls_list().length;
  }



  modalLinksList = '';

  filesUploaded = false;

  getExporting() {
    return this.mainService.getExporting();
  }

  getDownloading() {
    return this.mainService.getDownloading();
  }

  getFinishedOperation() {
    return this.mainService.getFinishedOperation();
  }

  showModal(title: string, message: string) {
    this.modalMessage = message;
    this.modalTitle = title;
    let el: HTMLElement = this.myButton?.nativeElement;
    el.click();
  }

  closeModal() {
    let el: HTMLElement = this.myCloseButton?.nativeElement;
    el.click();
  }

  //List of endpoints generated by API
  endpointsList = this.mainService.getEndpointList();

  //sends the url list main service function that send to the backend and generates the endpoints
  sendRequestUsingList() {
    if (this.mainService.getOriginal_urls_list().length == 1) {
      this.showModal('Atenção', 'Faça o upload da lista de links!!');
    } else {
      this.showModal(
        'Aviso!',
        'Deseja inciar a exportação?'
      );
    }
    //this.mainService.getBlob()
  }

  showDownloadPage() {
    this.mainService.sendRequestUsingList();
    this.router.navigateByUrl('/downloadpage');
  }

  //Send the requests to Endpoints List to download the files from API
  sendRequestToEndpoints() {
    console.log('Inciando downloads');
    this.mainService.sendRequestToEndpoints();
  }

  //Open and read the xlsx file to get the url list
  onFileChange(ev: any) {
    /* wire up file reader */
    this.mainService.original_url_listDeleteItems();
    this.modalLinksList = ''

    const target: DataTransfer = <DataTransfer>ev.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    let file = target.files[0];
    this.fileName = file.name;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let json_data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      json_data.map((item) => {
        let item_str = String(item);
        if (item_str != '') this.mainService.addOriginal_urls_list(item_str);
      });

      this.mainService.original_urls_listSlice();
      //console.log(this.mainService.getOriginal_urls_list());

      this.mainService.getOriginal_urls_list().map((link) => {
        this.modalLinksList = this.modalLinksList + '\n' + link;
      });
      this.filesUploaded = true;
      //this.showModal('Foram carregados ' + String(tam ) + ' Links!');
    };
    reader.readAsBinaryString(target.files[0]);
  }

  teste() {
    //this.mainService.test()
    this.mainService.sendRequestUsingList();
  }
  ngOnInit(): void {}
}
