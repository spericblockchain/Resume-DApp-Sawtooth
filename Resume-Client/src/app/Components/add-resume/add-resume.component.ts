import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SawtoothService } from '../../Services/Sawtooth/sawtooth.service';
import { ApiService } from 'src/app/Services/api/api.service';
import { MatChipInputEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Secp256k1PrivateKey, Secp256k1Context } from 'sawtooth-sdk/signing/secp256k1';
import { createContext, CryptoFactory } from 'sawtooth-sdk/signing';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';

export interface Skills {
  skillName: string;
}

export interface DialogData {
  pub: any;
  name: any;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})

export class DialogOverviewExampleDialo {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialo>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component( {
  selector: 'app-add-resume',
  templateUrl: './add-resume.component.html',
  styleUrls: [ './add-resume.component.scss' ]
} )
export class AddResumeComponent {
  constructor ( private fb: FormBuilder,
    private sawtooth: SawtoothService,
    public dialog: MatDialog,
    private api: ApiService ) { }
  resume: FormGroup;
  skills: Skills[] = [];
  RefreshedState = interval( 50 );
  ReceiptSubscription: Subscription;
  // ################ SKILLS#######################
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  pub: any;
  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];
  add( event: MatChipInputEvent ): void {
    const input = event.input;
    const value = event.value;
    if ( ( value || '' ).trim() ) {
      this.skills.push( { skillName: value.trim() } );

    }
    // Reset the input value
    if ( input ) {
      input.value = '';
    }
  }
  remove( skill: any ): void {
    const index = this.skills.indexOf( skill );

    if ( index >= 0 ) {
      this.skills.splice( index, 1 );
    }
  }

  // ####################################################

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialo, {
      width: '460px',
      data: {pub: this.pub, name: this.resume.get('name').value}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  get educationForm(): FormArray {
    return this.resume.get( 'education' ) as FormArray;
  }
  get certificationForm() {
    return this.resume.get( 'certification' ) as FormArray;
  }
  get experienceForm() {
    return this.resume.get( 'experience' ) as FormArray;
  }
  get projectForm() {
    return this.resume.get( 'projects' ) as FormArray;
  }

  // addEducation() {
  //   this.education.push(this.fb.control(name:'',degree:'',year:''));
  // }
  addEducation = () => {
    this.educationForm.push( new FormGroup( {
      collegeName: new FormControl(),
      degree: new FormControl(),
      year: new FormControl(),
    } ) );
  }
  addCertification = () => {
    this.certificationForm.push( new FormGroup( {
      instName: new FormControl(),
      course: new FormControl(),
      year: new FormControl(),
    } ) );
  }
  addExperience = () => {
    this.experienceForm.push( new FormGroup( {
      companyName: new FormControl(),
      post: new FormControl(),
      year: new FormControl(),
    } ) );
  }
  addProject = () => {
    this.projectForm.push( new FormGroup( {
      projectName: new FormControl(),
      area: new FormControl(),
      description: new FormControl(),
    } ) );
  }


  deleteEducation( i ) {
    this.educationForm.removeAt( i );
  }
  deleteCertification( i ) {
    this.certificationForm.removeAt( i );
  }
  deleteExperience( i ) {
    this.experienceForm.removeAt( i );
  }
  deleteProject( i ) {
    this.projectForm.removeAt( i );
  }

  ngOnInit() {

    this.resume = this.fb.group( {
      name: [ '', Validators.required ],
      age: [ '', Validators.required ],
      sex: [ '', Validators.required ],
      dob: [ '', Validators.required ],
      phno: [ '', [ Validators.required, Validators.pattern( '^[0-9]{10}$' ) ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      address: [ '', Validators.required ],
      objective: [ '', Validators.required ],
      skills: '',
      education: this.fb.array( [ new FormGroup( {
        collegeName: new FormControl(),
        degree: new FormControl(),
        year: new FormControl(),
      } ) ] ),
      certification: this.fb.array( [ new FormGroup( {
        instName: new FormControl(),
        course: new FormControl(),
        year: new FormControl(),
      } ) ] ),
      experience: this.fb.array( [ new FormGroup( {
        companyName: new FormControl(),
        post: new FormControl(),
        year: new FormControl(),
      } ) ] ),
      projects: this.fb.array( [ new FormGroup( {
        projectName: new FormControl(),
        area: new FormControl(),
        description: new FormControl(),
      } ) ] )
    } );
  }
  submitResume = async () => {
    const data: any = this.resume.value;
    data.skills = this.skills;
    data.dob = this.resume.value.dob.toLocaleDateString('en-US');
    const context = createContext( 'secp256k1' );
    const privateKey = context.newRandomPrivateKey();
    const signer = ( new CryptoFactory( context ) ).newSigner( privateKey );
    const Key = privateKey.asHex();
    const publicKey = signer.getPublicKey().asHex();
    const res: any = await this.sawtooth.newTransaction( Key, publicKey, data, 1 );
    if ( res[ 0 ].statusText === 'Accepted' ) {
      const id = res[ 1 ].transactionIds[ 0 ];
      const data = await this.CheckReceipt( id );
      this.pub = publicKey
      this.openDialog();
    } else {
      alert( 'Some issues with sawtooth' );
    }
  }
  CheckReceipt = async id => {
    return new Promise( async ( resolve, reject ) => {
      try {
        this.ReceiptSubscription = await this.RefreshedState.subscribe( async () => {
          const data: any = await this.api.getReceipt( id );
          if ( data && data.data ) {
            this.ReceiptSubscription.unsubscribe();
            resolve( data.data );
          }
        }
        );
      } catch ( error ) {
        reject( error );
      }
    } );
  }
}