import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';

const MAT_MODULES = [
  MatButtonModule,
  MatRadioModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatToolbarModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatTableModule
]
const ALL_MODULES = [...MAT_MODULES, CommonModule];

@NgModule({
  imports: [...ALL_MODULES],
  exports: [...ALL_MODULES]
})
export class SharedModule {
}
