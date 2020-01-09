import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatChipsModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatCardModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatExpansionModule
} from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule( {
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatDialogModule, MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule, MatNativeDateModule,
    MatTabsModule
  ],
  exports: [
    MatPaginatorModule, MatDatepickerModule, MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule, MatExpansionModule,
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    MatTabsModule
  ]
} )
export class MaterialModule { }
