import { Constructor } from './constructor';
import { CanDisable } from './disabled';
/** @docs-private */
export interface HasTabIndex {
    tabIndex: number;
}
/** @docs-private */
export declare type HasTabIndexCtor = Constructor<HasTabIndex>;
export declare function mixinTabIndex<T extends Constructor<CanDisable>>(base: T): Constructor<HasTabIndex> & T;
