import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LawListComponent } from './law-list/law-list.component';
import { LawDetailComponent } from './law-detail/law-detail.component';

const routes: Routes = [
  { path: '',
    component: LawListComponent,
  },
  {
    path: ':id',
    component: LawDetailComponent,
  },
  {
    path: 'user/profile',
    loadChildren: () =>
      import('../pages/profile/profile.module').then((m) => m.ProfileModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LawsRoutingModule {}
