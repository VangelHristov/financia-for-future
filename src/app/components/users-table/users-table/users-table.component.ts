import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit {
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getUsers(10, 1).subscribe((val) => console.log(val));
  }
}
