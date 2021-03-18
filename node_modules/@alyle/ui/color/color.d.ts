export declare class Color {
    private readonly _color;
    constructor(hex: number, alpha?: number);
    constructor(r: number, g: number, b: number, alpha?: number);
    constructor(...args: number[]);
    rgba(): number[];
    /**
     * Get the color opacity
     */
    alpha(): number;
    /**
     * Set the color opacity
     * @param value opacity
     */
    alpha(value: number): Color;
    /**
     * Returns the relative brightness
     */
    luminance(): number;
    /**
     * Normalized to 0 for darkest black and 1 for lightest white.
     * @param lum 0 to 1
     */
    luminance(lum: number): Color;
    /**
     * Changes the saturation of a color by manipulating the Lch chromaticity.
     * @param amount default: 1
     */
    saturate(amount?: number): Color;
    /**
     * Similar to saturate, but the opposite direction.
     * @param amount default: 1
     */
    desaturate(amount?: number): Color;
    /**
     * @param amount default: 1
     */
    darken(amount?: number): Color;
    /**
     * The opposite of darken
     * @param amount default 1
     */
    brighten(amount?: number): Color;
    css(): string;
    toString(): string;
}
export declare function hexColorToInt(_color: string): number;
export declare function color(hex: number, alpha?: number): Color;
export declare function color(r: number, g: number, b: number, alpha?: number): Color;
export declare function color(...args: number[]): Color;
