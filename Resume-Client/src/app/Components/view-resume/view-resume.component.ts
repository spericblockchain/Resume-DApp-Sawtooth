
import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-view-resume',
  templateUrl: './view-resume.component.html',
  styleUrls: [ './view-resume.component.scss' ]
} )
export class ViewResumeComponent implements OnInit {

  panelOpenBasic = true;
  panelOpenSKill = false;
  panelOpenEdu = false;
  panelOpenCert = false;
  panelOpenExp = false;
  panelOpenPro = false;
  data: any;
  constructor () { }

  ngOnInit() {
    this.loadData()
  }
  loadData = async () => {
    try {
      this.data = JSON.parse( sessionStorage.getItem( 'data' ) )[ 0 ];
    } catch ( error ) {
    }
  }

}



