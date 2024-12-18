import { Component, DestroyRef, forwardRef, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
    },
  ],
})
export class PairNumbersComponent implements OnInit, ControlValueAccessor {
  maxX = input<number>(150);
  maxY = input<number>(150);
  pairNumValid = output<boolean>();
  private destroyRef = inject(DestroyRef);
  onChange: (value: any) => void = () => {};

  pairedNumberForm = new FormGroup({
    xInput: new FormControl('', {
      validators: [
        Validators.required,
        Validators.max(this.maxX()),
        Validators.pattern('^-?[0-9]*$'),
      ],
    }),
    yInput: new FormControl('', {
      validators: [
        Validators.required,
        Validators.max(this.maxY()),
        Validators.pattern('^-?[0-9]*$'),
      ],
    }),
  });

  ngOnInit() {
    const subscription = this.pairedNumberForm.valueChanges.subscribe(
      (value) => {
        this.pairNumValid.emit(this.pairedNumberForm.valid);
        this.onChange(value);
      }
    );
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  get xInputIsInvalid() {
    return (
      this.pairedNumberForm.controls.xInput.invalid &&
      (this.pairedNumberForm.controls.xInput.dirty ||
        this.pairedNumberForm.controls.xInput.touched)
    );
  }

  get yInputIsInvalid() {
    return (
      this.pairedNumberForm.controls.yInput.invalid &&
      (this.pairedNumberForm.controls.yInput.dirty ||
        this.pairedNumberForm.controls.yInput.touched)
    );
  }

  writeValue(value: FormControl | any): void {
    if (value) {
      this.pairedNumberForm.patchValue(value, { emitEvent: false });
    } else {
      this.resetForm();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  resetForm() {
    this.pairedNumberForm.reset(
      {
        xInput: '',
        yInput: '',
      },
      { emitEvent: false }
    );
  }
}