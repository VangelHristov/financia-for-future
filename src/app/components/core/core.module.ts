import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [MessageComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    MessageComponent,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      },
    },
  ],
})
export class CoreModule {}
