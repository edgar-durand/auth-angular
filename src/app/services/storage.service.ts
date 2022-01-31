import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  getKey(key: string, asJSON = true): any {
    return localStorage.getItem(key)
      ? asJSON
        ? JSON.parse(<string>localStorage.getItem(key))
        : localStorage.getItem(key)
      : null;
  }
  setKeyFromJSON(key: string, json: any): void {
    localStorage.setItem(key, JSON.stringify(json));
  }
  destroyKey(key: string): void {
    localStorage.removeItem(key);
  }
}
