import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
export declare function untilComponentDestroyed<T>(component: OnDestroy): (source: Observable<T>) => Observable<T>;
