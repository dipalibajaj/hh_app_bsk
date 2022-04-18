import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NZ_I18N } from "ng-zorro-antd/i18n";
import { en_US } from "ng-zorro-antd/i18n";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { IconsProviderModule } from "./icons-provider.module";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzGridModule } from "ng-zorro-antd/grid";
import { SignInComponent } from "./auth/ui/sign-in/sign-in.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { NzInputModule } from "ng-zorro-antd/input";

// importing welcomeModule
import { WelcomeModule } from "./pages/welcome/welcome.module";

//importing httpclient.
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// importing reactiveFormsModule for validation
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

//importing routingmodule.
import { RouterModule } from "@angular/router";

// adding browser animation module for toastr
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

//importing Logger.
import { NgxLoggerLevel, LoggerModule } from "ngx-logger";

// importing environment
import { environment } from "../environments/environment";

// importing toastr to show notifications
import { ToastrModule } from "ngx-toastr";
// importing AngularFireModule.
import { AngularFireModule } from "@angular/fire/compat";
import {
	AngularFireAnalyticsModule,
	ScreenTrackingService,
	UserTrackingService,
} from "@angular/fire/compat/analytics/";

import { AuthInterceptor } from "./auth/auth.interceptor";
import { LogHttpInterceptor } from "./common/log.interceptor";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { SignUpComponent } from "./auth/ui/sign-up/sign-up.component";
import { PageNotFoundComponent } from "./auth/ui/page-not-found/page-not-found.component";

registerLocaleData(en);

@NgModule({
	declarations: [
		AppComponent,
		SignInComponent,
		HomePageComponent,
		LoadingSpinnerComponent,
		SignUpComponent,
		PageNotFoundComponent,
	],
	imports: [
		BrowserModule,
		WelcomeModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		ReactiveFormsModule,
		RouterModule,
		BrowserAnimationsModule,
		IconsProviderModule,
		NzLayoutModule,
		NzMenuModule,
		NzCardModule,
		NzButtonModule,
		NzInputModule,
		NzGridModule,
		HttpClientModule,
		ToastrModule.forRoot({
			positionClass: "toast-top-right",
		}),
		LoggerModule.forRoot({
			level: !environment.production
				? NgxLoggerLevel.TRACE
				: NgxLoggerLevel.OFF,
			// serverLogLevel
			serverLogLevel: NgxLoggerLevel.OFF,
			colorScheme: ["purple", "teal", "gray", "gray", "red", "red", "red"],
		}),
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAnalyticsModule,
	],
	providers: [
		{ provide: NZ_I18N, useValue: en_US },
		ScreenTrackingService,
		UserTrackingService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LogHttpInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
