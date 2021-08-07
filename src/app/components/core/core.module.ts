import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageComponent } from './message/message.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [MessageComponent, ConfirmDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [MessageComponent, CommonModule, MatDialogModule, MatButtonModule],
})
export class CoreModule {}
