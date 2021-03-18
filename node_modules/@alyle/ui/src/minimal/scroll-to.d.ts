/**
 * @experimental
 * Element to move, time in ms to animate
 */
export declare function scrollTo(element: HTMLElement, duration: number): void;
/**
 * @experimental
 */
export declare function scrollWithAnimation(element: HTMLElement, to: number, duration: number, p?: 'x' | 'y', motion?: (t: number) => number): void;
