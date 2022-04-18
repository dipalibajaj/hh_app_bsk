import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzButtonSize } from "ng-zorro-antd/button";

@Component({
	selector: "app-page-not-found",
	templateUrl: "./page-not-found.component.html",
	styleUrls: ["./page-not-found.component.css"],
})
export class PageNotFoundComponent implements OnInit {
	message: string = "This resource does not exist.";
	code: string = "404";
	title: string = "Oops! Page Not Found.";
	size: NzButtonSize = "large";

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		const loginState = localStorage.getItem("isLoggedIn");
		if (loginState == "true") {
			this.message = "This Resource does not Exist.";
		} else {
			this.message =
				"This Resource does not Exist. Please SignIn to Continue..";
		}
	}
}
