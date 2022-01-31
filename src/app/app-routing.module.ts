import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: 'laws',
    loadChildren: () => import('./laws/laws.module').then((m) => m.LawsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'forgot',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule),
  },
  {
    path: '',
    redirectTo: '/laws',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
