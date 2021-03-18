import { Injector, Type, InjectionToken, InjectFlags } from '@angular/core';
export declare class DynamicInjector implements Injector {
    private _newInjector;
    private _parentInjector;
    constructor(_newInjector: Injector, _parentInjector: Injector);
    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
    get(token: any, notFoundValue?: any): any;
}
