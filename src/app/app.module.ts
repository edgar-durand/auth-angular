import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LawsModule } from "./laws/laws.module";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoadingInterceptorService } from "./interceptors/loading.interceptor";
import { ForgotPasswordModule } from "./pages/forgot-password/forgot-password.module";
import { LoginModule } from "./pages/login/login.module";
import { AngularMaterialModule } from "./angular-material/angular-material.module";
import { AuthInterceptorService } from "./interceptors/request.interceptor";
import { AuthGuard } from "./guards/auth.guard";
import { UserMenuComponent } from "./components/user-menu/user-menu.component";
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from "./interceptors/timeout.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoaderComponent,
    UserMenuComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LawsModule,
    AngularMaterialModule,
    ForgotPasswordModule,
    LoginModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: 9999999 }]
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
