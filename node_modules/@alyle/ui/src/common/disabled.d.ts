import { Constructor } from './constructor';
export interface CanDisable {
    disabled: boolean;
    /**
     * It is only used for common behavior, therefore, it should not be used for other purposes.
     */
    readonly _superHyperInternalPropertyDisabled: boolean;
}
/** @docs-private */
export declare type CanDisableCtor = Constructor<CanDisable>;
export declare function mixinDisabled<T extends Constructor>(base: T): CanDisableCtor & T;
