import { Constructor } from './constructor';
export interface CanOutlined {
    outlined: boolean;
    /**
     * It is only used for common behavior, therefore, it should not be used for other purposes.
     */
    readonly _superHyperInternalPropertyOutlined: boolean;
}
export declare function mixinOutlined<T extends Constructor>(base: T): Constructor<CanOutlined> & T;
