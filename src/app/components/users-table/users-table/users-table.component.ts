import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Subject } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { IPagedResource } from '../../../contracts/paged-resource';
import { IUser } from '../../../contracts/user';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  displayedColumns = [
    'firstName',
    'middleName',
    'lastName',
    'createdAt',
    'streetAddress',
    'balance',
  ];

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  private readonly dispose$ = new Subject<void>();
  private usersPage$ = new Subject<number>();

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usersPage$
      .pipe(
        startWith(true),
        switchMap(() =>
          this.usersService.getUsers(this.pageSize, this.page).pipe(
            catchError((_) => {
              console.log(_);
              this.snackBar.open('Something went wrong');
              return EMPTY;
            })
          )
        )
      )
      .subscribe((response: IPagedResource<IUser>) => {
        this.users = response.data;
        this.totalPages = response.page.totalPages;
        this.totalItems = response.page.totalItems;
      });
  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  changePage(pageEvent: PageEvent): void {
    if (pageEvent.pageSize !== this.pageSize) {
      this.pageSize = pageEvent.pageSize;
      this.page = 1;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.usersPage$.next();
      return;
    }

    if (pageEvent.previousPageIndex !== pageEvent.pageIndex) {
      this.page = pageEvent.pageIndex + 1;
      this.usersPage$.next();
    }
  }
}
