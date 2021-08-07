import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() variant: 'success' | 'warning' | undefined;

  style: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.style = {
      success: this.variant === 'success',
      warning: this.variant === 'warning',
      none: this.variant === undefined,
    };
  }
}
