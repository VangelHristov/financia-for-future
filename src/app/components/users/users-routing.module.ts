import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateInfoComponent } from './private-info/private-info.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
  {
    path: 'users',
    component: UsersComponent,
    children: [
      {
        path: ':id/details',
        component: UserDetailsComponent,
        pathMatch: 'full',
      },
      {
        path: ':id/private-info',
        component: PrivateInfoComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
