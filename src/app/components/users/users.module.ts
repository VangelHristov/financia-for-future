import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../core/core.module';
import { UserDetailsComponent } from './user-details/user-details.component';

import { UsersRoutingModule } from './users-routing.module';
import { UsersTableComponent } from './users-table/users-table.component';
import { UsersComponent } from './users.component';
import { PrivateInfoComponent } from './private-info/private-info.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [
    UsersTableComponent,
    UserDetailsComponent,
    UsersComponent,
    PrivateInfoComponent,
    UserFormComponent,
  ],
  imports: [
    BrowserModule,
    UsersRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
  ],
  providers: [],
})
export class UsersModule {}
