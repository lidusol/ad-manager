import { Constructor } from './constructor';
export interface CanElevation {
    elevation: number;
    /**
     * It is only used for common behavior, therefore, it should not be used for other purposes.
     */
    readonly _superHyperInternalPropertyElevation: number;
}
export declare function mixinElevation<T extends Constructor>(base: T): Constructor<CanElevation> & T;
