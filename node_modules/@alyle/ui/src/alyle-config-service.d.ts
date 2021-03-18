import { InjectionToken } from '@angular/core';
export declare const THEME_VARIABLES: InjectionToken<PaletteVariables>;
export declare const IS_CORE_THEME: InjectionToken<true>;
export interface Default {
    [key: string]: any;
}
export interface PaletteVariables {
    default?: string;
    contrast?: string;
    [key: string]: string | undefined;
}
export interface ColorScheme {
    background?: {
        default?: string;
        paper?: string;
        [key: string]: any;
    };
    text?: {
        default: string;
        primary?: string;
        secondary?: string;
        disabled?: string;
        hint?: string;
        [key: string]: any;
    };
    divider?: string;
    /** Components variables */
    colorShadow?: string;
    bar?: string;
    input?: {
        label?: string;
        underline?: string;
    };
    [key: string]: any;
}
