import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { AuthService } from "./service/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private auth: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return from(this.addHeaders(req, next));
	}

	async addHeaders(
		req: HttpRequest<any>,
		next: HttpHandler
	): Promise<HttpEvent<any>> {
		if (!!req.url.includes("localhost") && !!req.url.includes("hohealth"))
			return next.handle(req).toPromise();

		// Get the auth token from the service.
		const authToken = `Bearer ${await this.auth.getIdToken()}`;
		const authReq = req.clone({
			headers: req.headers
				.append("Authorization", authToken)
				.append("Content-Type", "application/json"),
		});

		// send cloned request with header to the next handler.
		return next.handle(authReq).toPromise();
	}
}
