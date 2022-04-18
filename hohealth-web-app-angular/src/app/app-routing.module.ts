import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// adding generated components
import { SignInComponent } from "./auth/ui/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/ui/sign-up/sign-up.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { PageNotFoundComponent } from "./auth/ui/page-not-found/page-not-found.component";

//importing welcome module's components here
import { WelcomeComponent } from "./pages/welcome/welcome.component";
import { UserWizardComponent } from "./user/ui/user-wizard/user-wizard.component";
import { DashboardComponent } from "./pages/welcome/dashboard/dashboard.component";
import { ReportComponent } from "./pages/welcome/report/report.component";

// importing authGuard
import {
	AngularFireAuthGuard,
	redirectUnauthorizedTo,
} from "@angular/fire/compat/auth-guard";
import { RoutingMap } from "./routing-map";

const redirectUnauthorizedToLogin = () =>
	redirectUnauthorizedTo([RoutingMap.SIGN_IN]);

const routes: Routes = [
	{ path: RoutingMap.HOME, component: HomePageComponent },
	{ path: RoutingMap.SIGN_IN, component: SignInComponent },
	{
		path: RoutingMap.SIGN_UP,
		component: SignUpComponent,
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToLogin },
	},
	{
		path: "",
		component: WelcomeComponent,
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToLogin },
		children: [
			{
				path: RoutingMap.USER_WIZARD,
				component: UserWizardComponent,
				canActivate: [AngularFireAuthGuard],
				data: { authGuardPipe: redirectUnauthorizedToLogin },
			},
			{
				path: RoutingMap.DASHBOARD,
				component: DashboardComponent,
				canActivate: [AngularFireAuthGuard],
				data: { authGuardPipe: redirectUnauthorizedToLogin },
			},
			{
				path: RoutingMap.REPORTS,
				component: ReportComponent,
				canActivate: [AngularFireAuthGuard],
				data: { authGuardPipe: redirectUnauthorizedToLogin },
			},
		],
	},
	{ path: "**", component: PageNotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
