import { Component, OnInit } from "@angular/core";
import { AuthPresenter } from "../../auth.presenter";
// importing toaster for notifications
import { ToastrService } from "ngx-toastr";
import { RoutingMap } from "../../../routing-map";

@Component({
	selector: "app-sign-in",
	templateUrl: "./sign-in.component.html",
	styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
	constructor(
		private authPresenter: AuthPresenter,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.authPresenter.redirectIfSignedIn(
			RoutingMap.DASHBOARD,
			RoutingMap.SIGN_UP
		);
	}

	signIn() {
		this.authPresenter.signIn(RoutingMap.DASHBOARD, RoutingMap.SIGN_UP);
	}

	signUp() {
		this.toastr.info("Coming Soon.", "Sign Up");
	}
}
