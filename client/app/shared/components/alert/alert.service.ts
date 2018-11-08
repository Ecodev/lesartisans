import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { ConfirmComponent } from './confirm.component';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AlertService {

    constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
    }

    public info(message: string, duration: number = 1500): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, null, {
            duration: duration,
            verticalPosition: 'top',
            horizontalPosition: 'end',
        });
    }

    public error(message: string, duration: number = 1500): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, null, {
            duration: duration,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top',
            horizontalPosition: 'end',
        });
    }

    public confirm(title: string, message: string, confirmText: string, cancelText: string = 'Annuler'): Observable<any> {

        const dialog = this.dialog.open(ConfirmComponent, {
            data: {
                title: title,
                message: message,
                confirmText: confirmText,
                cancelText: cancelText,
            },
        });

        return dialog.afterClosed();
    }
}
