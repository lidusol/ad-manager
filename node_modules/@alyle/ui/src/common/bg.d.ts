import { Constructor } from './constructor';
import { Color } from '@alyle/ui/color';
export interface CanBg {
    bg: string | number | Color;
    /**
     * It is only used for common behavior, therefore, it should not be used for other purposes.
     */
    readonly _superHyperInternalPropertyBg: string | number | Color;
}
export declare function mixinBg<T extends Constructor>(base: T): Constructor<CanBg> & T;
