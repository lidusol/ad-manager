import { Type, TemplateRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { LyOverlay, LyTheme2 } from '@alyle/ui';
import { LyDialogRef } from './dialog-ref';
import { LyDialogConfig } from './dialog-config';
export declare class LyDialog {
    private _overlay;
    private _componentFactoryResolver;
    private _theme;
    private _injector;
    constructor(_overlay: LyOverlay, _componentFactoryResolver: ComponentFactoryResolver, _theme: LyTheme2, _injector: Injector);
    open<T, DATA = unknown>(componentOrTemplateRef: Type<T> | TemplateRef<T>, config?: LyDialogConfig<DATA>): LyDialogRef;
}
