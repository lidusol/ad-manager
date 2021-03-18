import { Constructor } from './constructor';
import { Color } from '@alyle/ui/color';
export interface CanColor {
    color: string | number | Color;
    /**
     * It is only used for common behavior, therefore, it should not be used for other purposes.
     */
    readonly _superHyperInternalPropertyColor: string | number | Color;
}
export declare function mixinColor<T extends Constructor>(base: T): Constructor<CanColor> & T;
