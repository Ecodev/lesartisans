import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Optional,
    Output,
    Self,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ExtendedFormControl } from '../../classes/ExtendedFormControl';
import { EnumService, IEnum } from '../../services/enum.service';

@Component({
    selector: 'app-select-enum',
    templateUrl: './select-enum.component.html',
})
export class SelectEnumComponent implements OnInit, ControlValueAccessor, AfterViewInit {

    @ViewChild('input') input: ElementRef<HTMLInputElement>;
    @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

    @Input() enumName: string;
    @Input() placeholder: string;
    @Input() nullLabel: string;
    @Input() required = false;
    @Input() icon = 'search';
    @Input() displayWith: (any) => string;

    @Input() set disabled(disabled: boolean) {
        disabled ? this.formCtrl.disable() : this.formCtrl.enable();
    }

    @Output() selectionChange = new EventEmitter();
    @Output() blur = new EventEmitter();

    public items: Observable<IEnum[]>;
    public formCtrl: FormControl = new FormControl();
    public onChange;

    /**
     * Stores the value given from parent, it's usually an object. The inner value is formCtrl.value that is a string.
     */
    private value;

    constructor(private enumService: EnumService, @Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl !== null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit() {
        this.items = this.enumService.get(this.enumName);
    }

    ngAfterViewInit(): void {

        if (this.ngControl && this.ngControl.control) {
            if ((this.ngControl.control as ExtendedFormControl).dirtyChanges) {
                (this.ngControl.control as ExtendedFormControl).dirtyChanges.subscribe(() => {
                    this.formCtrl.markAsDirty({onlySelf: true});
                    this.formCtrl.updateValueAndValidity();
                });
            }

            this.formCtrl.setValidators(this.ngControl.control.validator);
        }
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
    }

    writeValue(value) {
        this.value = value;
        this.formCtrl.setValue(this.getDisplayFn()(value));
    }

    /**
     * Very important to return something, above all if [select]='displayedValue' attribute value is used
     */
    public getDisplayFn(): (item: any) => string {
        if (this.displayWith) {
            return this.displayWith;
        }

        return (item) => !item ? null : item.fullName || item.name || item.id || item;
    }

    public propagateValue(ev) {

        const val = ev.value;

        this.value = val;
        if (this.onChange) {
            this.onChange(val); // before selectionChange to grant formControl is updated before change is effectively emitted
        }
        this.selectionChange.emit(val);
    }

}
