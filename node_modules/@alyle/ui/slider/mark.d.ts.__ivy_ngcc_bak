import { Renderer2, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { LySlider } from './slider';
import { LyTick } from './tick';
export declare class LyMark implements OnInit, OnDestroy {
    private _slider;
    private _renderer;
    private _el;
    /** @docs-private */
    readonly classes: Pick<{
        $priority: string;
        root: string;
        track: string;
        bg: string;
        thumbContainer: string;
        thumbContent: string;
        thumb: string;
        thumbLabel: string;
        thumbLabelValue: string;
        horizontal: string;
        vertical: string;
        marked: string;
        mark: string;
        markActive: string;
        tick: string;
        tickActive: string;
        thumbVisible: string;
        thumbNotVisible: string;
        thumbContentFocused: string;
        sliding: string;
        disabled: string;
    }, "root" | "track" | "bg" | "thumbContainer" | "thumbContent" | "thumb" | "thumbLabel" | "thumbLabelValue" | "horizontal" | "vertical" | "marked" | "mark" | "markActive" | "tick" | "tickActive" | "thumbVisible" | "thumbNotVisible" | "thumbContentFocused" | "sliding" | "disabled">;
    private _markActiveClass?;
    _tick: LyTick;
    value: number;
    constructor(_slider: LySlider, _renderer: Renderer2, _el: ElementRef);
    ngOnInit(): void;
    private _updateMark;
    ngOnDestroy(): void;
    private _getHostElement;
}
