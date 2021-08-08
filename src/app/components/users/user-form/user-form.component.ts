import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { IUser } from '../../../contracts/user';
import { StoreService } from '../../../services/store/store.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit, OnDestroy {
  user: IUser | null = null;

  userForm!: FormGroup;

  private dispose$ = new Subject<void>();

  constructor(
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    private dialog: MatDialogRef<UserFormComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getSelectedUser();
  }

  ngOnDestroy(): void {
    this.dispose$.next();
    this.dispose$.complete();
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Please fix all highlighted errors.');
      return;
    }

    this.dialog.close(this.userForm.value);
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'You must enter a value';
    }

    if (control.hasError('minlength')) {
      return 'You must enter at least 2 symbols';
    }

    if (control.hasError('maxlength')) {
      return 'You must enter at most 255 symbols';
    }

    if (control.hasError('min')) {
      return 'The amount must be greater than 0';
    }

    if (control.hasError('max')) {
      return `The amount must be less than ${Number.MAX_SAFE_INTEGER}`;
    }

    return '';
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: [this.user?.firstName, UserFormComponent.getValidators()],
      middleName: [this.user?.middleName, UserFormComponent.getValidators()],
      lastName: [this.user?.lastName, UserFormComponent.getValidators()],
      streetAddress: [
        this.user?.streetAddress,
        UserFormComponent.getValidators(),
      ],
      balance: [
        this.user?.balance,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(Number.MAX_SAFE_INTEGER),
        ],
      ],
      createdAt: [this.user?.createdAt],
      id: [this.user?.id],
    });
  }

  private static getValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
    ];
  }

  private getSelectedUser(): void {
    // Get the user stored in the global store.
    // If there is not user this is create form, otherwise it's edit
    this.storeService.userProfile$
      .pipe(take(1))
      .subscribe((user: IUser | null) => {
        this.user = user;
        this.initForm();
      });
  }
}
