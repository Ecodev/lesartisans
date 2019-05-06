import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail, NaturalAlertService } from '@ecodev/natural';
import { OrderService } from '../../../order/services/order.service';
import {
    CreateTransaction,
    CreateTransactionVariables,
    DeleteTransactions,
    ExpenseClaim,
    ExpenseClaimStatus,
    ExpenseClaimType,
    Transaction,
    TransactionVariables,
    UpdateTransaction,
    UpdateTransactionVariables,
} from '../../../shared/generated-types';
import { AccountingDocumentsComponent } from '../../accounting-documents/accounting-documents.component';
import { ExpenseClaimService } from '../../expenseClaim/services/expenseClaim.service';
import { EditableTransactionLinesComponent } from '../editable-transaction-lines/editable-transaction-lines.component';
import { TransactionLineService } from '../services/transaction-line.service';
import { TransactionService } from '../services/transaction.service';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent
    extends NaturalAbstractDetail<Transaction['transaction'],
        TransactionVariables,
        CreateTransaction['createTransaction'],
        CreateTransactionVariables,
        UpdateTransaction['updateTransaction'],
        UpdateTransactionVariables,
        DeleteTransactions> implements OnInit {

    @ViewChild(EditableTransactionLinesComponent) transactionLinesComponent: EditableTransactionLinesComponent;
    @ViewChild('transactionDocuments') accountingDocuments: AccountingDocumentsComponent;

    public updateTransactionLines = false;
    public ExpenseClaimType = ExpenseClaimType;
    public ExpenseClaimStatus = ExpenseClaimStatus;

    public order;

    constructor(alertService: NaturalAlertService,
                private transactionService: TransactionService,
                router: Router,
                route: ActivatedRoute,
                public transactionLineService: TransactionLineService,
                private expenseClaimService: ExpenseClaimService,
                private orderService: OrderService,
    ) {
        super('transaction', transactionService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.data.model.id) {
            this.orderService.getForTransaction(this.data.model.id).subscribe(order => this.order = order);
        }

        setTimeout(() => {
            const expenseClaim: ExpenseClaim['expenseClaim'] = this.data.expenseClaim ? this.data.expenseClaim.model : null;
            if (expenseClaim && expenseClaim.owner && expenseClaim.owner.account) {
                this.data.model.expenseClaim = expenseClaim;
                this.updateTransactionLines = true;

                // Set default name
                const nameControl = this.form.get('name');
                if (nameControl) {
                    if (expenseClaim.type === ExpenseClaimType.expenseClaim) {
                        nameControl.setValue('Traitement de la dépense "' + expenseClaim.name + '"');
                    } else if (expenseClaim.type === ExpenseClaimType.refund) {
                        nameControl.setValue('Remboursement de "' + expenseClaim.name + '"');
                    }
                }

                const expenseClaimControl = this.form.get('expenseClaim');
                if (expenseClaimControl) {
                    expenseClaimControl.setValue(expenseClaim);
                }

                if (expenseClaim.type === ExpenseClaimType.expenseClaim) {
                    const preset = this.transactionService.getExpenseClaimPreset(expenseClaim.owner.account, expenseClaim.amount);
                    this.transactionLinesComponent.setLines(preset);
                } else if (expenseClaim.type === ExpenseClaimType.refund) {
                    const preset = this.transactionService.getRefundPreset(expenseClaim.owner.account, expenseClaim.amount);
                    this.transactionLinesComponent.setLines(preset);
                }
            }
        });
    }

    public save() {

        this.accountingDocuments.save();

        if (this.transactionLinesComponent) {
            const rawTransactionLines = this.transactionLinesComponent.getList();
            this.data.model.transactionLines = rawTransactionLines.map(line => this.transactionLineService.getInput(line));

            this.transactionLinesComponent.validateForm();

            if (!this.transactionLinesComponent.form.valid) {
                return;
            }
        } else {
            this.data.model.transactionLines = null;
        }

        if (this.data.model.id) {
            this.update(true);
        } else {
            this.create();
        }

        this.updateTransactionLines = false;
    }

    public flagExpenseClaim(status: ExpenseClaimStatus) {
        const model = {
            id: this.data.model.expenseClaim.id,
            status: status,
        };
        this.expenseClaimService.updatePartially(model).subscribe(() => {
            this.data.model.expenseClaim.status = status;
        });
    }

    public delete(redirectionRoute: any[]): void {
        super.delete(['/admin/transaction-line']);
    }
}
