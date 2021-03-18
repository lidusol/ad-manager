import { ElementRef, OnDestroy } from '@angular/core';
export declare class MutationObserverFactory {
    create(callback: MutationCallback): MutationObserver | null;
}
export declare class ElementObserver implements OnDestroy {
    private _mutationObserverFactory;
    private _observedElements;
    constructor(_mutationObserverFactory: MutationObserverFactory);
    ngOnDestroy(): void;
    observe(elementOrRef: Element | ElementRef<Element>, fn: MutationCallback, options?: MutationObserverInit): MutationObserver;
    /**
     * Destroy Observer
     */
    destroy(elementOrRef: Element | ElementRef<Element>): void;
}
