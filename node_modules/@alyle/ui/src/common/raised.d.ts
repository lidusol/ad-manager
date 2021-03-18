import { Constructor } from './constructor';
export interface CanRaised {
    raised: boolean;
    /**
     * It is only used for common behavior, therefore, it should not be used for other purposes.
     */
    readonly _superHyperInternalPropertyRaised: boolean;
}
export declare function mixinRaised<T extends Constructor>(base: T): Constructor<CanRaised> & T;
