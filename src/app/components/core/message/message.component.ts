import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() variant: 'success' | 'warning' | 'info' | undefined;

  type: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.type = {
      success: this.variant === 'success',
      warning: this.variant === 'warning',
      info: this.variant === 'info',
      none: this.variant === undefined,
    };
  }

  getCssClasses(): string {
    if (this.variant === 'success') {
      return 'success fa-check-circle';
    } else if (this.variant === 'warning') {
      return 'warning fa-exclamation-circle';
    } else if (this.variant === 'info') {
      return 'info fa-info-circle';
    }
    return '';
  }
}
