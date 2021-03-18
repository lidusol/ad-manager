import { InjectionToken } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { HammerOptions, HammerInstance } from './gesture-annotations';
export declare const LY_HAMMER_OPTIONS: InjectionToken<HammerOptions>;
export declare class LyHammerGestureConfig extends HammerGestureConfig {
    private _hammerOptions;
    events: string[];
    constructor(_hammerOptions: HammerOptions);
    buildHammer(element: HTMLElement): HammerInstance;
    /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
    private _createRecognizer;
}
