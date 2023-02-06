import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { stringify } from 'querystring';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private mainService: MainService) {}

  original_urls_list = [''];
  linksList = [''];

  sendListToBackend() {
    console.log('criando arquivos de download no servidor da api');
    this.mainService
      .generateEndpoints(this.original_urls_list[0])
      .subscribe((exportLinks) => {
        this.linksList = exportLinks.link;
        console.log(exportLinks.link);
        console.log('Links de download criados no servidor da api!');
      });
  }

  sendRequestToEndpoints() {
    console.log('Inciando downloads');
    this.mainService.sendRequestToEndpoints(this.linksList);
  }

  // getLinksFromAPI() {
  //   console.log(this.linksList);
  //   console.log('Inciando downloads');
  //   this.mainService.getLinksFromAPI(this.linksList).subscribe((res) => {
  //     console.log(res);
  //     this.downloadExcelFile(res, 'result.xlsx');
  //     console.log('operação finalizada');
  //   });

  //   //
  // }

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

  onFileChange(ev: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>ev.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
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
        if (item_str != '') this.original_urls_list.push(item_str);
      });
      this.original_urls_list = this.original_urls_list.slice(1);
      console.log(this.original_urls_list);
      //console.log(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsBinaryString(target.files[0]);
  }

  ngOnInit(): void {}
}
