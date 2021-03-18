import { Constructor } from './constructor';
import { CanColor } from './color';
import { CanBg } from './bg';
import { CanDisable } from './disabled';
import { CanRaised } from './raised';
import { CanElevation } from './elevation';
import { CanOutlined } from './outlined';
import { CanShadowColor } from './shadow-color';
import { LyTheme2 } from '../theme/theme2.service';
import { ElementRef } from '@angular/core';
export interface RequireParamsStyleUpdater {
    _theme: LyTheme2;
}
export interface CanStyleUpdater {
    _theme: LyTheme2;
    updateStyle: (element: ElementRef | Element) => void;
    setAutoContrast: () => void;
}
export declare type CanStyleUpdaterCtor = Constructor<RequireParamsStyleUpdater & Partial<CanColor & CanBg & CanDisable & CanRaised & CanElevation & CanOutlined & CanShadowColor>>;
export declare function mixinStyleUpdater<T extends CanStyleUpdaterCtor>(base: T): Constructor<CanStyleUpdater> & T;
