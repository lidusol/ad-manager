/**
 * @fileoverview added by tsickle
 * Generated from: src/material-moment-adapter/adapter/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from './moment-date-adapter';
import { MAT_MOMENT_DATE_FORMATS } from './moment-date-formats';
import * as ɵngcc0 from '@angular/core';
export { MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from './moment-date-adapter';
export { MAT_MOMENT_DATE_FORMATS } from './moment-date-formats';
export class MomentDateModule {
}
MomentDateModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: MomentDateModule });
MomentDateModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function MomentDateModule_Factory(t) { return new (t || MomentDateModule)(); }, providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }
    ] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(MomentDateModule, [{
        type: NgModule,
        args: [{
                providers: [
                    {
                        provide: DateAdapter,
                        useClass: MomentDateAdapter,
                        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
                    }
                ]
            }]
    }], null, null); })();
const ɵ0 = MAT_MOMENT_DATE_FORMATS;
export class MatMomentDateModule {
}
MatMomentDateModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: MatMomentDateModule });
MatMomentDateModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function MatMomentDateModule_Factory(t) { return new (t || MatMomentDateModule)(); }, providers: [{ provide: MAT_DATE_FORMATS, useValue: ɵ0 }], imports: [[MomentDateModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(MatMomentDateModule, { imports: [MomentDateModule] }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(MatMomentDateModule, [{
        type: NgModule,
        args: [{
                imports: [MomentDateModule],
                providers: [{ provide: MAT_DATE_FORMATS, useValue: ɵ0 }]
            }]
    }], null, null); })();
export { ɵ0 };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC1tb21lbnQtYWRhcHRlci9hZGFwdGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RixPQUFPLEVBQUMsK0JBQStCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN6RixPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFOUQsNEdBQWMsdUJBQXVCLENBQUM7QUFDdEMsd0NBQWMsdUJBQXVCLENBQUM7QUFXdEMsTUFBTSxPQUFPLGdCQUFnQjtBQUFHOzRDQVQvQixRQUFRLFNBQUM7RUFDUixTQUFTLEVBQUUsc0JBQ1QsMEJBQ0UsT0FBTyxFQUFFLFdBQVcsMEJBQ3BCLFFBQVEsRUFBRSxpQkFBaUI7UUFDM0I7RUFBSSxFQUFFLENBQUMsZUFBZSxFQUFFO21CQUErQixDQUFDO0NBQ3pELGtCQUNGLGVBQ0Y7Ozs7Ozs7Ozs7Ozs7OzBCQUNJO0FBQUMsV0FLOEMsdUJBQXVCO0FBRTNFLE1BQU0sT0FBTyxtQkFBbUI7QUFBRzsrQ0FKbEMsUUFBUSxTQUFDLGtCQUNSO01BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDLGtCQUMzQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLElBQXlCLEVBQUMsQ0FBQyxlQUM1RTs7Ozs7Ozs7MEJBQ0k7QUFBQztBQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRlQWRhcHRlciwgTUFUX0RBVEVfRk9STUFUUywgTUFUX0RBVEVfTE9DQUxFfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX01PTUVOVF9EQVRFX0FEQVBURVJfT1BUSU9OUywgTW9tZW50RGF0ZUFkYXB0ZXJ9IGZyb20gJy4vbW9tZW50LWRhdGUtYWRhcHRlcic7XG5pbXBvcnQge01BVF9NT01FTlRfREFURV9GT1JNQVRTfSBmcm9tICcuL21vbWVudC1kYXRlLWZvcm1hdHMnO1xuXG5leHBvcnQgKiBmcm9tICcuL21vbWVudC1kYXRlLWFkYXB0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9tb21lbnQtZGF0ZS1mb3JtYXRzJztcblxuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogRGF0ZUFkYXB0ZXIsXG4gICAgICB1c2VDbGFzczogTW9tZW50RGF0ZUFkYXB0ZXIsXG4gICAgICBkZXBzOiBbTUFUX0RBVEVfTE9DQUxFLCBNQVRfTU9NRU5UX0RBVEVfQURBUFRFUl9PUFRJT05TXVxuICAgIH1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTW9tZW50RGF0ZU1vZHVsZSB7fVxuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNb21lbnREYXRlTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9EQVRFX0ZPUk1BVFMsIHVzZVZhbHVlOiBNQVRfTU9NRU5UX0RBVEVfRk9STUFUU31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRNb21lbnREYXRlTW9kdWxlIHt9XG4iXX0=