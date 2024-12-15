import { Component, DestroyRef, forwardRef, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-pair-numbers',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pair-numbers.component.html',
  styleUrl: './pair-numbers.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PairNumbersComponent),
      multi: true,
    }
  ]
})
export class PairNumbersComponent implements OnInit {
  maxX = input<number>(150);
  maxY = input<number>(150);
  pairNumValid = output<boolean>();
  private destroyRef = inject(DestroyRef);
  private onChange: any = () => {};
  private onTouched: any = () => {};

  pairedNumberForm = new FormGroup({
    xInput: new FormControl('', {
      validators: [Validators.required, Validators.max(this.maxX()), Validators.pattern('^-?[0-9]*$')]
    }),
    yInput: new FormControl('', {
      validators: [Validators.required, Validators.max(this.maxY()), Validators.pattern('^-?[0-9]*$')]
    })
  });

  get xInputIsInvalid() {
    return (
      this.pairedNumberForm.controls.xInput.touched &&
      this.pairedNumberForm.controls.xInput.dirty &&
      this.pairedNumberForm.controls.xInput.invalid
    );
  }

  get yInputIsInvalid() {
    return (
      this.pairedNumberForm.controls.yInput.touched &&
      this.pairedNumberForm.controls.yInput.dirty &&
      this.pairedNumberForm.controls.yInput.invalid
    );
  }

  ngOnInit() {
    const subscription = this.pairedNumberForm.valueChanges.subscribe(value => {
      this.updateFormValue(value);
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onBlur() {
     this.onTouched();
  }

  writeValue(value: FormControl | any): void {
    if (value) {
      this.pairedNumberForm.get('xInput')?.setValue(value.xInput);
      this.pairedNumberForm.get('yInput')?.setValue(value.yInput);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateFormValue(value: any) {
    this.pairNumValid.emit(this.pairedNumberForm.valid);
    this.onChange(value);
  }

  resetForm() {
    this.pairedNumberForm.reset({
      xInput: '',
      yInput: ''
    });
  }

}