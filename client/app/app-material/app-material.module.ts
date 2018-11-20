import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

/**
 * Module to declare all Material modules to be easily
 * re-used in tests too
 */
@NgModule({
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatToolbarModule,
        MatSelectModule,
        FlexLayoutModule,
        MatListModule,
        MatMenuModule,
        MatCardModule
    ],
    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatToolbarModule,
        MatSelectModule,
        FlexLayoutModule,
        MatListModule,
        MatMenuModule,
        MatCardModule
    ],
})
export class AppMaterialModule {
}
