import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  constructor(private mainService: MainService, private router : Router) {}

  getExporting() {
    return this.mainService.getExporting();
  }

  getDownloading() {
    return this.mainService.getDownloading();
  }

  getFinishedOperation() {
    return this.mainService.getFinishedOperation();
  }

  showMainPage(){
    this.router.navigateByUrl('/')
  }

  ngOnInit(): void {}
}
