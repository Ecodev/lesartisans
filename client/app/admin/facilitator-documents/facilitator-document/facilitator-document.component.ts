import {Component} from '@angular/core';
import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalIconDirective,
    NaturalLinkableTabDirective,
    NaturalFileComponent,
    NaturalStampComponent,
    NaturalFixedButtonDetailComponent,
} from '@ecodev/natural';
import {FilesService} from '../../files/services/files.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';
import {CreateFile} from '../../../shared/generated-types';
import {map, Observable, of, switchMap} from 'rxjs';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-facilitator-document',
    templateUrl: './facilitator-document.component.html',
    styleUrls: ['./facilitator-document.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        CommonModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        MatTabsModule,
        NaturalLinkableTabDirective,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        NaturalFileComponent,
        MatDividerModule,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
})
export class FacilitatorDocumentComponent extends NaturalAbstractDetail<FacilitatorDocumentsService> {
    public constructor(
        public readonly facilitatorDocumentService: FacilitatorDocumentsService,
        private readonly fileService: FilesService,
    ) {
        super('facilitatorDocument', facilitatorDocumentService);
    }

    public createFileAndLink(file: File): Observable<CreateFile['createFile']> {
        return this.fileService.create({file}).pipe(
            switchMap(newFile => {
                const id = this.data.model.id;
                return id
                    ? this.service
                          .updatePartially({
                              id,
                              file: newFile,
                          })
                          .pipe(map(() => newFile))
                    : of(newFile);
            }),
        );
    }
}
