import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'

@Injectable()
export class ErrorInterCeptor implements HttpInterceptor {
    intercept(
        req: import('@angular/common/http').HttpRequest<any>,
        next: import('@angular/common/http').HttpHandler
    ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error) => {
                // for 401 only
                if (error.status === 401) {
                    return throwError(error.statusText)
                }

                // for 500
                if (error instanceof HttpErrorResponse) {
                    // get error from header
                    const applicationError = error.headers.get('Application-Error')

                    if (applicationError) {
                        throwError(applicationError)
                    }

                    // modal state errors
                    const serverError = error.error
                    let modalStateError = ''
                    if (serverError.errors && typeof serverError.errors === 'object') {
                        for (const key in serverError.errors) {
                            modalStateError += serverError.errors[key] + '\n'
                        }
                    }

                    // if there is nothing in modalstate error, throw server error instead
                    return throwError(modalStateError || serverError || 'Sever Error')
                }
            })
        )
    }
}

export const ErrorInterCeptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterCeptor,
    multi: true,
}
