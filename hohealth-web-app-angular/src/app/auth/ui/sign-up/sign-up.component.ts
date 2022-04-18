import { Component, OnInit } from "@angular/core";
import { RoutingMap } from "src/app/routing-map";
import { User } from "src/app/user/model/user.model";
import { AuthPresenter } from "../../auth.presenter";

@Component({
	selector: "app-sign-up",
	templateUrl: "./sign-up.component.html",
	styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
	name?: string;
	mobile?: string;
	userInfo?: User;

	constructor(private authPresenter: AuthPresenter) {}

	async ngOnInit(): Promise<void> {
		this.userInfo = await this.authPresenter.getDefaultUserDetails();
		this.name = this.userInfo.name ?? "";
		this.mobile = this.userInfo.phone_number ?? "";
	}

	async signUp() {
		//TODO: validate Input
		if (this.userInfo) {
			this.userInfo.name = this.name ?? null;
			this.userInfo.phone_number = this.mobile ?? null;
			this.authPresenter.signUp(this.userInfo, RoutingMap.USER_WIZARD);
		}
	}
}
