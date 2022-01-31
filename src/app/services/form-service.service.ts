import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FormServiceService {
  @Output() formService: EventEmitter<any> = new EventEmitter();
  showTools$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // constructor() { }
}
