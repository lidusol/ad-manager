import { Constructor } from './constructor';
import { Color } from '@alyle/ui/color';
export interface CanShadowColor {
    shadowColor: string | number | Color;
    /**
     * It is only used for common behavior, therefore, it should not be used for other purposes.
     */
    readonly _superHyperInternalPropertyShadowColor: string | number | Color;
}
export declare function mixinShadowColor<T extends Constructor>(base: T): Constructor<CanShadowColor> & T;
