import { Injectable, signal } from '@angular/core';
import type { PairedNumber } from './pair-numbers.model';

@Injectable({
  providedIn: 'root'
})
export class PairNumbersService {
  private usersPairs = signal<PairedNumber[]>([]);
  private pairNumbers: PairedNumber[] = [];

  doesPairExists(x: number, y: number): boolean {
    return this.pairNumbers.some(pair => pair.x === x && pair.y === y);
  }

  savePairedNumbers(pairNumber: any): boolean {
    if (this.doesPairExists(pairNumber.x, pairNumber.y)) {
      return false;
    }
    this.pairNumbers.push(pairNumber);
    this.usersPairs.update((oldPairNumber) => [...oldPairNumber, pairNumber]);
    return true;
  }
}
