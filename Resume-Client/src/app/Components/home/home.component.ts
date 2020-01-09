import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api/api.service';
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service';


export interface DialogData {
  publicKey: string;
}

@Component( {
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
} )

export class HomeComponent implements OnInit {

  constructor ( private route: Router, private sawtooth: SawtoothService,
    private api: ApiService, public dialog: MatDialog ) { }
  publicKey: string;
  openDialog(): void {
    const dialogRef = this.dialog.open( DialogOverviewExampleDialog, {
      width: '250px',
      data: { publicKey: this.publicKey }
    } );

    dialogRef.afterClosed().subscribe( async result => {
      try {
        this.publicKey = result;
        const addr = this.sawtooth.genAddress( this.publicKey );
        const data = await this.api.getStateData( addr );
        if ( data && data.error === undefined ) {
          sessionStorage.setItem( "data", data )
          this.route.navigateByUrl( '/ViewResume' )
        }
        else {
          alert( "Invalid Public Key" );
        }
      } catch ( error ) {
        alert( "Invalid Public Key" )
      }

    } );
  }

  ngOnInit() {
  }
}

@Component( {
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
} )
export class DialogOverviewExampleDialog {

  constructor (
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject( MAT_DIALOG_DATA ) public data: DialogData ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
