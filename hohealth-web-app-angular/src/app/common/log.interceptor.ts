import {
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpEvent,
	HttpResponse,
	HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";

@Injectable()
export class LogHttpInterceptor implements HttpInterceptor {
	private logTag = "HttpRequest";
	constructor(private logger: NGXLogger) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const started = Date.now();
		this.logRequest(req);
		return next.handle(req).pipe(
			tap(
				event => this.logResponse(event, req, started),
				event => this.logError(event, req, started)
			)
		);
	}

	//#region Logging methods
	private logRequest(req: HttpRequest<any>) {
		this.logger.debug(this.logTag, `📝 Log Http Request`, [
			`${req.method} "${req.urlWithParams}"`,
		]);
	}

	private logResponse(
		event: HttpEvent<any>,
		req: HttpRequest<any>,
		started: number
	) {
		if (event instanceof HttpResponse) {
			const elapsed = Date.now() - started;
			this.logger.debug(this.logTag, `📝 Log Http Response`, [
				`HTTP: Response for ${req.urlWithParams}\nreturned with status ${event.status}\nand took ${elapsed} ms`,
			]);
		}
	}

	private logError(
		event: HttpEvent<any>,
		req: HttpRequest<any>,
		started: number
	) {
		if (event instanceof HttpErrorResponse) {
			const elapsed = Date.now() - started;
			this.logger.error(this.logTag, `🛑 Log Http Response Error`, [
				`Http Response Error for ${req.urlWithParams}\nreturned with status ${event.status}\nand took ${elapsed} ms`,
			]);
		}
	}
	//#endregion
}
