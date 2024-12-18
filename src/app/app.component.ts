import { Component, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PairNumbersComponent } from './pair-numbers/pair-numbers.component';
import { PairNumbersService } from './pair-numbers/pair-numbers.service';
import { ErrorService } from './shared/error.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, PairNumbersComponent, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('pairsNumRef') pairsNumComponent!: PairNumbersComponent;
  private pairNumbersService = inject(PairNumbersService);
  protected maxX: number = 100;
  protected maxY: number = 100;
  protected pairNumValid = signal<boolean>(false);
  private errorService = inject(ErrorService);
  protected error = this.errorService.error;
  protected title = signal<string>('');

  protected fg = new FormGroup({
    description: new FormControl('', {
      validators: [Validators.required]
    }),
    pairsNum: new FormControl(
      {
        xInput: '',
        yInput: '',
      },
      {validators: [Validators.required]

      })
  });

  protected isPairNumValid(valid: boolean): void {
    this.pairNumValid.set(valid);
  }

  protected saveData() {
    if (this.fg.valid && this.pairNumValid()) {
      const savedPair = this.pairNumbersService.savePairedNumbers({
        x: this.fg.value.pairsNum?.xInput ?? '',
        y: this.fg.value.pairsNum?.yInput ?? '',
        description: this.fg.value.description,
      });

      if (savedPair) {
        this.title.set('Yay!');
        this.errorService.showError('Data saved successfully!');
        this.fg.reset();
        if (this.pairsNumComponent) {
          this.pairsNumComponent.resetForm();
        }
      } else {
        this.title.set('Oh No! Pair not saved');
        this.errorService.showError('This pair of numbers already exists!');
      }
    }
  }
}
