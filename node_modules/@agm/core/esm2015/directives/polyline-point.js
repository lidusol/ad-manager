import * as tslib_1 from "tslib";
import * as ɵngcc0 from '@angular/core';
var AgmPolylinePoint_1;
import { Directive, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { FitBoundsAccessor } from '../services/fit-bounds';
/**
 * AgmPolylinePoint represents one element of a polyline within a  {@link
 * AgmPolyline}
 */
let AgmPolylinePoint = AgmPolylinePoint_1 = class AgmPolylinePoint {
    constructor() {
        /**
         * This event emitter gets emitted when the position of the point changed.
         */
        this.positionChanged = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes['latitude'] || changes['longitude']) {
            const position = {
                lat: changes['latitude'] ? changes['latitude'].currentValue : this.latitude,
                lng: changes['longitude'] ? changes['longitude'].currentValue : this.longitude,
            };
            this.positionChanged.emit(position);
        }
    }
    /** @internal */
    getFitBoundsDetails$() {
        return this.positionChanged.pipe(startWith({ lat: this.latitude, lng: this.longitude }), map(position => ({ latLng: position })));
    }
};
AgmPolylinePoint.ɵfac = function AgmPolylinePoint_Factory(t) { return new (t || AgmPolylinePoint)(); };
AgmPolylinePoint.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: AgmPolylinePoint, selectors: [["agm-polyline-point"]], inputs: { latitude: "latitude", longitude: "longitude" }, outputs: { positionChanged: "positionChanged" }, features: [ɵngcc0.ɵɵProvidersFeature([
            { provide: FitBoundsAccessor, useExisting: forwardRef(() => AgmPolylinePoint_1) },
        ]), ɵngcc0.ɵɵNgOnChangesFeature] });
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], AgmPolylinePoint.prototype, "latitude", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], AgmPolylinePoint.prototype, "longitude", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmPolylinePoint.prototype, "positionChanged", void 0);
AgmPolylinePoint = AgmPolylinePoint_1 = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [])
], AgmPolylinePoint);
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmPolylinePoint, [{
        type: Directive,
        args: [{
                selector: 'agm-polyline-point',
                providers: [
                    { provide: FitBoundsAccessor, useExisting: forwardRef(() => AgmPolylinePoint_1) },
                ]
            }]
    }], function () { return []; }, { positionChanged: [{
            type: Output
        }], latitude: [{
            type: Input
        }], longitude: [{
            type: Input
        }] }); })();
export { AgmPolylinePoint };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtcG9pbnQuanMiLCJzb3VyY2VzIjpbIm5nOi9AYWdtL2NvcmUvZGlyZWN0aXZlcy9wb2x5bGluZS1wb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFN0csT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRCxPQUFPLEVBQUUsaUJBQWlCLEVBQW9CLE1BQU0sd0JBQXdCLENBQUM7QUFFN0U7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQU9ILElBQWEsZ0JBQWdCLHdCQUE3QixNQUFhLGdCQUFnQjtBQUFHLElBZ0I5QjtBQUFnQixRQUxoQjtBQUNGO0FBRUEsV0FESztBQUNMLFFBQVksb0JBQWUsR0FBZ0MsSUFBSSxZQUFZLEVBQWlCLENBQUM7QUFDN0YsSUFDaUIsQ0FBQztBQUNsQixJQUNFLFdBQVcsQ0FBQyxPQUFzQjtBQUFJLFFBQ3BDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUNyRCxZQUFNLE1BQU0sUUFBUSxHQUFrQjtBQUN0QyxnQkFBUSxHQUFHLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUTtBQUNuRixnQkFBUSxHQUFHLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUztBQUN0RixhQUF3QixDQUFDO0FBQ3pCLFlBQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsU0FBSztBQUNMLElBQUUsQ0FBQztBQUNILElBQ0UsZ0JBQWdCO0FBQ2xCLElBQUUsb0JBQW9CO0FBQUssUUFDdkIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FDOUIsU0FBUyxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUMsQ0FBQyxFQUNwRCxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FDdEMsQ0FBQztBQUNOLElBQUUsQ0FBQztBQUNILENBQUM7Ozs7NENBQUE7QUEvQlU7QUFBcUIsSUFBN0IsS0FBSyxFQUFFO0FBQUU7QUFHRyxrREFIb0I7QUFLeEI7QUFBcUIsSUFBN0IsS0FBSyxFQUFFO0FBQUU7QUFHRSxtREFIc0I7QUFLeEI7QUFBcUIsSUFBOUIsTUFBTSxFQUFFO0FBQUUsc0NBQWdCLFlBQVk7QUFBRSx5REFBa0Q7QUFkaEYsZ0JBQWdCLGlEQU41QixTQUFTLENBQUMsVUFDVCxRQUFRLEVBQUUsbkNBS1I7VUFMNEIsVUFDOUIscEJBSStDLEdBQXBDLGdCQUFnQixDQW1DNUI7T0F2Q1UsRUFBRSxjQUNULEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRTtDQUFVLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FBZ0IsQ0FBQyxFQUFDLFdBQzlFO0tBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7b0JBcUNGO0FBQUMsU0FwQ1ksZ0JBQWdCO0FBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5wdXQsIE9uQ2hhbmdlcywgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IExhdExuZ0xpdGVyYWwgfSBmcm9tICcuLi8uLi9jb3JlL3NlcnZpY2VzL2dvb2dsZS1tYXBzLXR5cGVzJztcbmltcG9ydCB7IEZpdEJvdW5kc0FjY2Vzc29yLCBGaXRCb3VuZHNEZXRhaWxzIH0gZnJvbSAnLi4vc2VydmljZXMvZml0LWJvdW5kcyc7XG5cbi8qKlxuICogQWdtUG9seWxpbmVQb2ludCByZXByZXNlbnRzIG9uZSBlbGVtZW50IG9mIGEgcG9seWxpbmUgd2l0aGluIGEgIHtAbGlua1xuICogQWdtUG9seWxpbmV9XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2FnbS1wb2x5bGluZS1wb2ludCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBGaXRCb3VuZHNBY2Nlc3NvciwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWdtUG9seWxpbmVQb2ludCl9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBBZ21Qb2x5bGluZVBvaW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBGaXRCb3VuZHNBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBUaGUgbGF0aXR1ZGUgcG9zaXRpb24gb2YgdGhlIHBvaW50LlxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGxhdGl0dWRlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBsb25naXR1ZGUgcG9zaXRpb24gb2YgdGhlIHBvaW50O1xuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGxvbmdpdHVkZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGVtaXR0ZXIgZ2V0cyBlbWl0dGVkIHdoZW4gdGhlIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBjaGFuZ2VkLlxuICAgKi9cbiAgQE91dHB1dCgpIHBvc2l0aW9uQ2hhbmdlZDogRXZlbnRFbWl0dGVyPExhdExuZ0xpdGVyYWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxMYXRMbmdMaXRlcmFsPigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogYW55IHtcbiAgICBpZiAoY2hhbmdlc1snbGF0aXR1ZGUnXSB8fCBjaGFuZ2VzWydsb25naXR1ZGUnXSkge1xuICAgICAgY29uc3QgcG9zaXRpb246IExhdExuZ0xpdGVyYWwgPSB7XG4gICAgICAgIGxhdDogY2hhbmdlc1snbGF0aXR1ZGUnXSA/IGNoYW5nZXNbJ2xhdGl0dWRlJ10uY3VycmVudFZhbHVlIDogdGhpcy5sYXRpdHVkZSxcbiAgICAgICAgbG5nOiBjaGFuZ2VzWydsb25naXR1ZGUnXSA/IGNoYW5nZXNbJ2xvbmdpdHVkZSddLmN1cnJlbnRWYWx1ZSA6IHRoaXMubG9uZ2l0dWRlLFxuICAgICAgfSBhcyBMYXRMbmdMaXRlcmFsO1xuICAgICAgdGhpcy5wb3NpdGlvbkNoYW5nZWQuZW1pdChwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBnZXRGaXRCb3VuZHNEZXRhaWxzJCgpOiBPYnNlcnZhYmxlPEZpdEJvdW5kc0RldGFpbHM+IHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbkNoYW5nZWQucGlwZShcbiAgICAgIHN0YXJ0V2l0aCh7bGF0OiB0aGlzLmxhdGl0dWRlLCBsbmc6IHRoaXMubG9uZ2l0dWRlfSksXG4gICAgICBtYXAocG9zaXRpb24gPT4gKHtsYXRMbmc6IHBvc2l0aW9ufSkpXG4gICAgKTtcbiAgfVxufVxuIl19