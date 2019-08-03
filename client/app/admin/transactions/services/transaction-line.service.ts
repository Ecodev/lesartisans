import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormValidators, NaturalAbstractModelService, NaturalSearchSelections, toUrl } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import {
    LogicalOperator,
    SortingOrder,
    TransactionLine,
    TransactionLineInput,
    TransactionLines, TransactionLineSortingField,
    TransactionLinesVariables,
    TransactionLineVariables,
    Account,
} from '../../../shared/generated-types';
import { transactionLineQuery, transactionLinesQuery, transactionLinesForExportQuery } from './transaction-line.queries';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NaturalQueryVariablesManager, NaturalUtility } from '@ecodev/natural';
import { RouterLink } from '@angular/router';

function atLeastOneAccount(formGroup: FormGroup): ValidationErrors | null {
    if (!formGroup || !formGroup.controls) {
        return null;
    }

    const debit = formGroup.controls.debit.value;
    const credit = formGroup.controls.credit.value;

    return debit || credit ? null : {atLeastOneAccountRequired: true};
}

@Injectable({
    providedIn: 'root',
})
export class TransactionLineService extends NaturalAbstractModelService<TransactionLine['transactionLine'],
    TransactionLineVariables,
    TransactionLines['transactionLines'],
    TransactionLinesVariables,
    null,
    any,
    null,
    any,
    null> {

    constructor(apollo: Apollo) {
        super(apollo,
            'transactionLine',
            transactionLineQuery,
            transactionLinesQuery,
            null,
            null,
            null);
    }

    public static getVariablesForAccount(account): TransactionLinesVariables {
        return {
            filter: {
                groups: [
                    {
                        conditionsLogic: LogicalOperator.OR,
                        conditions: [
                            {
                                debit: {equal: {value: account.id}},
                                credit: {equal: {value: account.id}},
                            },
                        ],
                    },
                ],
            },
            sorting: [{field: TransactionLineSortingField.transactionDate, order: SortingOrder.DESC}],
        };
    }

    public static getSelectionForAccount(account: Account['account']): NaturalSearchSelections {
        return [
            [
                {
                    field: 'debit',
                    condition: {
                        have: {
                            values: [account.id],
                        },
                    },
                },
            ],
            [
                {
                    field: 'credit',
                    condition: {
                        have: {
                            values: [account.id],
                        },
                    },
                },
            ],
        ];
    }

    public linkToTransactionForAccount(account: Account['account']): RouterLink['routerLink'] {
        const selection = TransactionLineService.getSelectionForAccount(account);
        return [
            '/admin/transaction-line',
            {ns: JSON.stringify(toUrl(selection))},
        ];
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            balance: [Validators.required, Validators.min(0)],
        };
    }

    /**
     * TODO : force debit or credit account as required
     */
    public getFormGroupValidators(): ValidatorFn[] {
        return [atLeastOneAccount];
    }

    protected getDefaultForServer(): TransactionLineInput {
        return {
            name: '',
            remarks: '',
            balance: '',
            credit: null,
            debit: null,
            isReconciled: false,
            transactionDate: new Date(),
            transactionTag: null,
        };
    }

    public getExportLink(qvm: NaturalQueryVariablesManager<TransactionLinesVariables>): Observable<string> {

        return this.apollo.query<any>({
           query: transactionLinesForExportQuery,
           variables: qvm.variables.value,
        }).pipe(map(result => {
            const plural = NaturalUtility.makePlural(this.name);
            return result.data[plural].excelExport;
        }));

    }
}
