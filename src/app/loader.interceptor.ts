import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { LoaderService } from './services/loader.service';
import { SERVER } from "src/environments/environment";
import { LocalStorageService } from "./layout/services/local-storage.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    first_client_customer_id: number = SERVER.FIRST_CLIENT_CUSTOMER_ID
    second_client_cutomer_id: number = SERVER.SECOND_CLIENT_CUSTOMER_ID
    constructor(public loaderService: LoaderService, private storageService: LocalStorageService) { 
        this.storageService.getUserClientCustomerId().then(result=>{
            this.first_client_customer_id = result.first_client_customer_id
            this.second_client_cutomer_id = result.second_client_customer_id
        })
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const client_customer_id = this.second_client_cutomer_id;
        const modifiedReq = req.clone({ 
          headers: req.headers.set('Authorization', `Bearer ${client_customer_id}`),
        });
        if (req.body !== null) {
            let message = req.body.message
            
            if (message !== undefined) {
                this.loaderService.message = message
                /* this.loaderService.setMessage(message) */
                this.loaderService.show();
            }
            
        }
                return next.handle(modifiedReq).pipe(
                    finalize(() => {
                        catchError((error) => {
                            console.log('error is intercept')
                            console.error(error);
                            return throwError(error.message);
                          })
                        /* this.loaderService.cleanMessage() */
                        this.loaderService.hide()
                    })
                );
    }
}