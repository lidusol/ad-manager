import { OnInit, ElementRef, EventEmitter } from '@angular/core';
import Cropper from 'cropperjs';
export interface ImageCropperSetting {
    width: number;
    height: number;
}
export interface ImageCropperResult {
    imageData: Cropper.ImageData;
    cropData: Cropper.CropBoxData;
    blob?: Blob;
    dataUrl?: string;
}
export declare class CropperComponent implements OnInit {
    image: ElementRef;
    imageUrl: any;
    settings: ImageCropperSetting;
    cropbox: Cropper.CropBoxData;
    loadImageErrorText: string;
    cropperOptions: any;
    export: EventEmitter<ImageCropperResult>;
    ready: EventEmitter<{}>;
    isLoading: boolean;
    cropper: Cropper;
    imageElement: HTMLImageElement;
    loadError: any;
    constructor();
    ngOnInit(): void;
    /**
     * Image loaded
     * @param ev
     */
    imageLoaded(ev: Event): void;
    /**
     * Image load error
     * @param event
     */
    imageLoadError(event: any): void;
    /**
     * Export canvas
     * @param base64
     */
    exportCanvas(base64?: any): void;
}
