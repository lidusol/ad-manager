import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, timer } from 'rxjs';
import { flatMap, map, sample, shareReplay, switchMap, } from 'rxjs/operators';
import { MapsAPILoader } from './maps-api-loader/maps-api-loader';
/**
 * Class to implement when you what to be able to make it work with the auto fit bounds feature
 * of AGM.
 */
import * as ɵngcc0 from '@angular/core';
var FitBoundsAccessor = /** @class */ (function () {
    function FitBoundsAccessor() {
    }
    return FitBoundsAccessor;
}());
export { FitBoundsAccessor };
/**
 * The FitBoundsService is responsible for computing the bounds of the a single map.
 */
var FitBoundsService = /** @class */ (function () {
    function FitBoundsService(loader) {
        var _this = this;
        this._boundsChangeSampleTime$ = new BehaviorSubject(200);
        this._includeInBounds$ = new BehaviorSubject(new Map());
        this.bounds$ = from(loader.load()).pipe(flatMap(function () { return _this._includeInBounds$; }), sample(this._boundsChangeSampleTime$.pipe(switchMap(function (time) { return timer(0, time); }))), map(function (includeInBounds) { return _this._generateBounds(includeInBounds); }), shareReplay(1));
    }
    FitBoundsService.prototype._generateBounds = function (includeInBounds) {
        var bounds = new google.maps.LatLngBounds();
        includeInBounds.forEach(function (b) { return bounds.extend(b); });
        return bounds;
    };
    FitBoundsService.prototype.addToBounds = function (latLng) {
        var id = this._createIdentifier(latLng);
        if (this._includeInBounds$.value.has(id)) {
            return;
        }
        var map = this._includeInBounds$.value;
        map.set(id, latLng);
        this._includeInBounds$.next(map);
    };
    FitBoundsService.prototype.removeFromBounds = function (latLng) {
        var map = this._includeInBounds$.value;
        map.delete(this._createIdentifier(latLng));
        this._includeInBounds$.next(map);
    };
    FitBoundsService.prototype.changeFitBoundsChangeSampleTime = function (timeMs) {
        this._boundsChangeSampleTime$.next(timeMs);
    };
    FitBoundsService.prototype.getBounds$ = function () {
        return this.bounds$;
    };
    FitBoundsService.prototype._createIdentifier = function (latLng) {
        return latLng.lat + "+" + latLng.lng;
    };
    FitBoundsService.ctorParameters = function () { return [
        { type: MapsAPILoader }
    ]; };
    FitBoundsService = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [MapsAPILoader])
    ], FitBoundsService);
FitBoundsService.ɵfac = function FitBoundsService_Factory(t) { return new (t || FitBoundsService)(ɵngcc0.ɵɵinject(MapsAPILoader)); };
FitBoundsService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: FitBoundsService, factory: function (t) { return FitBoundsService.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(FitBoundsService, [{
        type: Injectable
    }], function () { return [{ type: MapsAPILoader }]; }, null); })();
    return FitBoundsService;
}());
export { FitBoundsService };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml0LWJvdW5kcy5qcyIsInNvdXJjZXMiOlsibmc6L0BhZ20vY29yZS9zZXJ2aWNlcy9maXQtYm91bmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFjLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNoRSxPQUFPLEVBQ0wsT0FBTyxFQUNQLEdBQUcsRUFDSCxNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsR0FDVixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQWFsRTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUNIO0FBQ1csSUFEWDtBQUErQixJQUUvQixDQUFDO0FBQ0QsSUFEQSx3QkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUVIO0FBQ29CLElBSWxCLDBCQUFZLE1BQXFCO0FBQ25DLFFBREUsaUJBU0M7QUFDSCxRQWJxQiw2QkFBd0IsR0FBRyxJQUFJLGVBQWUsQ0FBUyxHQUFHLENBQUMsQ0FBQztBQUNqRixRQUFxQixzQkFBaUIsR0FBRyxJQUFJLGVBQWUsQ0FBWSxJQUFJLEdBQUcsRUFBa0MsQ0FBQyxDQUFDO0FBQ25ILFFBRUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUNyQyxPQUFPLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsRUFBdEIsQ0FBc0IsQ0FBQyxFQUNyQyxNQUFNLENBQ0osSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDLENBQ3RFLEVBQ0QsR0FBRyxDQUFDLFVBQUEsZUFBZSxJQUFJLE9BQUEsS0FBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxFQUM3RCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQ2YsQ0FBQztBQUNOLElBQUUsQ0FBQztBQUNILElBQ1UsMENBQWUsR0FBdkIsVUFDRSxlQUFvRDtBQUN0RCxRQUNFLElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQWtCLENBQUM7QUFDbEUsUUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO0FBQ25ELFFBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsSUFBRSxDQUFDO0FBRUgsSUFBRSxzQ0FBVyxHQUFYLFVBQVksTUFBOEI7QUFDNUMsUUFBSSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsUUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzlDLFlBQU0sT0FBTztBQUNiLFNBQUs7QUFDTCxRQUFJLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7QUFDN0MsUUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4QixRQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsSUFBRSxDQUFDO0FBRUgsSUFBRSwyQ0FBZ0IsR0FBaEIsVUFBaUIsTUFBOEI7QUFDakQsUUFBSSxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDO0FBQzdDLFFBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMvQyxRQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsSUFBRSxDQUFDO0FBRUgsSUFBRSwwREFBK0IsR0FBL0IsVUFBZ0MsTUFBYztBQUNoRCxRQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0MsSUFBRSxDQUFDO0FBRUgsSUFBRSxxQ0FBVSxHQUFWO0FBQWMsUUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDeEIsSUFBRSxDQUFDO0FBRUgsSUFBWSw0Q0FBaUIsR0FBM0IsVUFBNEIsTUFBOEI7QUFBSSxRQUM1RCxPQUFVLE1BQU0sQ0FBQyxHQUFHLFNBQUksTUFBTSxDQUFDLEdBQUssQ0FBQztBQUN6QyxJQUFFLENBQUM7QUFDRjtBQUMyRCxnQkEvQ3RDLGFBQWE7QUFBRztBQUM3QixJQU5JLGdCQUFnQixnQ0FENUIsVUFBVSxFQUFFLHJCQUNMLDBDQUtjLGFBQWE7QUFBRyxPQUx6QixnQkFBZ0IsQ0FtRDVCOzs7Ozt1RUFDRDtBQUFDLElBREQsdUJBQUM7QUFDQSxDQURBLEFBbkRELElBbURDO0FBQ0QsU0FwRGEsZ0JBQWdCO0FBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBmcm9tLCBPYnNlcnZhYmxlLCB0aW1lciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgZmxhdE1hcCxcbiAgbWFwLFxuICBzYW1wbGUsXG4gIHNoYXJlUmVwbGF5LFxuICBzd2l0Y2hNYXAsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IExhdExuZywgTGF0TG5nQm91bmRzLCBMYXRMbmdMaXRlcmFsIH0gZnJvbSAnLi9nb29nbGUtbWFwcy10eXBlcyc7XG5pbXBvcnQgeyBNYXBzQVBJTG9hZGVyIH0gZnJvbSAnLi9tYXBzLWFwaS1sb2FkZXIvbWFwcy1hcGktbG9hZGVyJztcblxuZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRml0Qm91bmRzRGV0YWlscyB7XG4gIGxhdExuZzogTGF0TG5nIHwgTGF0TG5nTGl0ZXJhbDtcbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IHR5cGUgQm91bmRzTWFwID0gTWFwPHN0cmluZywgTGF0TG5nIHwgTGF0TG5nTGl0ZXJhbD47XG5cbi8qKlxuICogQ2xhc3MgdG8gaW1wbGVtZW50IHdoZW4geW91IHdoYXQgdG8gYmUgYWJsZSB0byBtYWtlIGl0IHdvcmsgd2l0aCB0aGUgYXV0byBmaXQgYm91bmRzIGZlYXR1cmVcbiAqIG9mIEFHTS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZpdEJvdW5kc0FjY2Vzc29yIHtcbiAgYWJzdHJhY3QgZ2V0Rml0Qm91bmRzRGV0YWlscyQoKTogT2JzZXJ2YWJsZTxGaXRCb3VuZHNEZXRhaWxzPjtcbn1cblxuLyoqXG4gKiBUaGUgRml0Qm91bmRzU2VydmljZSBpcyByZXNwb25zaWJsZSBmb3IgY29tcHV0aW5nIHRoZSBib3VuZHMgb2YgdGhlIGEgc2luZ2xlIG1hcC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpdEJvdW5kc1NlcnZpY2Uge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgYm91bmRzJDogT2JzZXJ2YWJsZTxMYXRMbmdCb3VuZHM+O1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX2JvdW5kc0NoYW5nZVNhbXBsZVRpbWUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KDIwMCk7XG4gIHByb3RlY3RlZCByZWFkb25seSBfaW5jbHVkZUluQm91bmRzJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Qm91bmRzTWFwPihuZXcgTWFwPHN0cmluZywgTGF0TG5nIHwgTGF0TG5nTGl0ZXJhbD4oKSk7XG5cbiAgY29uc3RydWN0b3IobG9hZGVyOiBNYXBzQVBJTG9hZGVyKSB7XG4gICAgdGhpcy5ib3VuZHMkID0gZnJvbShsb2FkZXIubG9hZCgpKS5waXBlKFxuICAgICAgZmxhdE1hcCgoKSA9PiB0aGlzLl9pbmNsdWRlSW5Cb3VuZHMkKSxcbiAgICAgIHNhbXBsZShcbiAgICAgICAgdGhpcy5fYm91bmRzQ2hhbmdlU2FtcGxlVGltZSQucGlwZShzd2l0Y2hNYXAodGltZSA9PiB0aW1lcigwLCB0aW1lKSkpLFxuICAgICAgKSxcbiAgICAgIG1hcChpbmNsdWRlSW5Cb3VuZHMgPT4gdGhpcy5fZ2VuZXJhdGVCb3VuZHMoaW5jbHVkZUluQm91bmRzKSksXG4gICAgICBzaGFyZVJlcGxheSgxKSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuZXJhdGVCb3VuZHMoXG4gICAgaW5jbHVkZUluQm91bmRzOiBNYXA8c3RyaW5nLCBMYXRMbmcgfCBMYXRMbmdMaXRlcmFsPixcbiAgKSB7XG4gICAgY29uc3QgYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpIGFzIExhdExuZ0JvdW5kcztcbiAgICBpbmNsdWRlSW5Cb3VuZHMuZm9yRWFjaChiID0+IGJvdW5kcy5leHRlbmQoYikpO1xuICAgIHJldHVybiBib3VuZHM7XG4gIH1cblxuICBhZGRUb0JvdW5kcyhsYXRMbmc6IExhdExuZyB8IExhdExuZ0xpdGVyYWwpIHtcbiAgICBjb25zdCBpZCA9IHRoaXMuX2NyZWF0ZUlkZW50aWZpZXIobGF0TG5nKTtcbiAgICBpZiAodGhpcy5faW5jbHVkZUluQm91bmRzJC52YWx1ZS5oYXMoaWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2luY2x1ZGVJbkJvdW5kcyQudmFsdWU7XG4gICAgbWFwLnNldChpZCwgbGF0TG5nKTtcbiAgICB0aGlzLl9pbmNsdWRlSW5Cb3VuZHMkLm5leHQobWFwKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21Cb3VuZHMobGF0TG5nOiBMYXRMbmcgfCBMYXRMbmdMaXRlcmFsKSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5faW5jbHVkZUluQm91bmRzJC52YWx1ZTtcbiAgICBtYXAuZGVsZXRlKHRoaXMuX2NyZWF0ZUlkZW50aWZpZXIobGF0TG5nKSk7XG4gICAgdGhpcy5faW5jbHVkZUluQm91bmRzJC5uZXh0KG1hcCk7XG4gIH1cblxuICBjaGFuZ2VGaXRCb3VuZHNDaGFuZ2VTYW1wbGVUaW1lKHRpbWVNczogbnVtYmVyKSB7XG4gICAgdGhpcy5fYm91bmRzQ2hhbmdlU2FtcGxlVGltZSQubmV4dCh0aW1lTXMpO1xuICB9XG5cbiAgZ2V0Qm91bmRzJCgpOiBPYnNlcnZhYmxlPExhdExuZ0JvdW5kcz4ge1xuICAgIHJldHVybiB0aGlzLmJvdW5kcyQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NyZWF0ZUlkZW50aWZpZXIobGF0TG5nOiBMYXRMbmcgfCBMYXRMbmdMaXRlcmFsKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7bGF0TG5nLmxhdH0rJHtsYXRMbmcubG5nfWA7XG4gIH1cbn1cbiJdfQ==