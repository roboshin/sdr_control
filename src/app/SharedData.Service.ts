import {Injectable} from '@angular/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';

// Angular 2 のコンポーネント間でデータを渡す
// https://stackblitz.com/edit/angular-ivy-15gkbt?file=src%2Fapp%2Fapp.module.ts

@Injectable(
{
  providedIn: 'root'
})
export class SharedDataService {

  private sharedData: Subject<any> = new Subject<any>();
  sharedData$: Observable<any> = this.sharedData.asObservable();

  constructor() {
  }

  setData(updatedData) {
    this.sharedData.next(updatedData);
  }
}
