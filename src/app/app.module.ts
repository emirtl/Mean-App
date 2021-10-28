import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { ErrorComponent } from './errorComponent/error.component';
import { HeaderComponent } from './header/header.component';
import { AngularMaterialModule } from './Material.module';
import { AuthGuard } from './authentication/auth.guard';
import { AppRoutingModule } from './app.routing.module';
import { ErrorInterceptor } from './error.interceptor';
import { AppComponent } from './app.component';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './authentication/auth.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, ErrorComponent],
  imports: [
    BrowserModule,

    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    AngularMaterialModule,
    PostsModule,
    AuthModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
