import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import { MarkerManager } from './marker-manager';
import * as ɵngcc0 from '@angular/core';
var InfoWindowManager = /** @class */ (function () {
    function InfoWindowManager(_mapsWrapper, _zone, _markerManager) {
        this._mapsWrapper = _mapsWrapper;
        this._zone = _zone;
        this._markerManager = _markerManager;
        this._infoWindows = new Map();
    }
    InfoWindowManager.prototype.deleteInfoWindow = function (infoWindow) {
        var _this = this;
        var iWindow = this._infoWindows.get(infoWindow);
        if (iWindow == null) {
            // info window already deleted
            return Promise.resolve();
        }
        return iWindow.then(function (i) {
            return _this._zone.run(function () {
                i.close();
                _this._infoWindows.delete(infoWindow);
            });
        });
    };
    InfoWindowManager.prototype.setPosition = function (infoWindow) {
        return this._infoWindows.get(infoWindow).then(function (i) { return i.setPosition({
            lat: infoWindow.latitude,
            lng: infoWindow.longitude,
        }); });
    };
    InfoWindowManager.prototype.setZIndex = function (infoWindow) {
        return this._infoWindows.get(infoWindow)
            .then(function (i) { return i.setZIndex(infoWindow.zIndex); });
    };
    InfoWindowManager.prototype.open = function (infoWindow) {
        var _this = this;
        return this._infoWindows.get(infoWindow).then(function (w) {
            if (infoWindow.hostMarker != null) {
                return _this._markerManager.getNativeMarker(infoWindow.hostMarker).then(function (marker) {
                    return _this._mapsWrapper.getNativeMap().then(function (map) { return w.open(map, marker); });
                });
            }
            return _this._mapsWrapper.getNativeMap().then(function (map) { return w.open(map); });
        });
    };
    InfoWindowManager.prototype.close = function (infoWindow) {
        return this._infoWindows.get(infoWindow).then(function (w) { return w.close(); });
    };
    InfoWindowManager.prototype.setOptions = function (infoWindow, options) {
        return this._infoWindows.get(infoWindow).then(function (i) { return i.setOptions(options); });
    };
    InfoWindowManager.prototype.addInfoWindow = function (infoWindow) {
        var options = {
            content: infoWindow.content,
            maxWidth: infoWindow.maxWidth,
            zIndex: infoWindow.zIndex,
            disableAutoPan: infoWindow.disableAutoPan,
        };
        if (typeof infoWindow.latitude === 'number' && typeof infoWindow.longitude === 'number') {
            options.position = { lat: infoWindow.latitude, lng: infoWindow.longitude };
        }
        var infoWindowPromise = this._mapsWrapper.createInfoWindow(options);
        this._infoWindows.set(infoWindow, infoWindowPromise);
    };
    /**
     * Creates a Google Maps event listener for the given InfoWindow as an Observable
     */
    InfoWindowManager.prototype.createEventObservable = function (eventName, infoWindow) {
        var _this = this;
        return new Observable(function (observer) {
            _this._infoWindows.get(infoWindow).then(function (i) {
                i.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
            });
        });
    };
    InfoWindowManager.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper },
        { type: NgZone },
        { type: MarkerManager }
    ]; };
    InfoWindowManager = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [GoogleMapsAPIWrapper, NgZone,
            MarkerManager])
    ], InfoWindowManager);
InfoWindowManager.ɵfac = function InfoWindowManager_Factory(t) { return new (t || InfoWindowManager)(ɵngcc0.ɵɵinject(GoogleMapsAPIWrapper), ɵngcc0.ɵɵinject(ɵngcc0.NgZone), ɵngcc0.ɵɵinject(MarkerManager)); };
InfoWindowManager.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: InfoWindowManager, factory: function (t) { return InfoWindowManager.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(InfoWindowManager, [{
        type: Injectable
    }], function () { return [{ type: GoogleMapsAPIWrapper }, { type: ɵngcc0.NgZone }, { type: MarkerManager }]; }, null); })();
    return InfoWindowManager;
}());
export { InfoWindowManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mby13aW5kb3ctbWFuYWdlci5qcyIsInNvdXJjZXMiOlsibmc6L0BhZ20vY29yZS9zZXJ2aWNlcy9tYW5hZ2Vycy9pbmZvLXdpbmRvdy1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBSTVDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRWxFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7QUFHakQ7QUFDb0IsSUFHbEIsMkJBQ1ksWUFBa0MsRUFBVSxLQUFhLEVBQ3pELGNBQTZCO0FBQUksUUFEakMsaUJBQVksR0FBWixZQUFZLENBQXNCO0FBQUMsUUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO0FBQUMsUUFDMUQsbUJBQWMsR0FBZCxjQUFjLENBQWU7QUFBQyxRQUxsQyxpQkFBWSxHQUNoQixJQUFJLEdBQUcsRUFBc0MsQ0FBQztBQUNwRCxJQUc4QyxDQUFDO0FBQy9DLElBQ0UsNENBQWdCLEdBQWhCLFVBQWlCLFVBQXlCO0FBQUksUUFBOUMsaUJBWUM7QUFDSCxRQVpJLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RELFFBQUksSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0FBQ3pCLFlBQU0sOEJBQThCO0FBQ3BDLFlBQU0sT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsU0FBSztBQUNMLFFBQUksT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBYTtBQUFJLFlBQ3BDLE9BQU8sS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDdEIsZ0JBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xCLGdCQUFRLEtBQUks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Q0wsMENBS29CLG9CQUFvQixFQUFpQixNQUFNO0FBQ3ZFLFlBQThCLGFBQWE7QUFBRyxPQU5qQyxpQkFBaUIsQ0E2RTdCOzs7OztnSUFDRDtBQUFDLElBREQsd0JBQUM7QUFDQSxDQURBLEFBN0VELElBNkVDO0FBQ0QsU0E5RWEsaUJBQWlCO0FBQzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBBZ21JbmZvV2luZG93IH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9pbmZvLXdpbmRvdyc7XG5cbmltcG9ydCB7IEdvb2dsZU1hcHNBUElXcmFwcGVyIH0gZnJvbSAnLi4vZ29vZ2xlLW1hcHMtYXBpLXdyYXBwZXInO1xuaW1wb3J0IHsgSW5mb1dpbmRvdywgSW5mb1dpbmRvd09wdGlvbnMgfSBmcm9tICcuLi9nb29nbGUtbWFwcy10eXBlcyc7XG5pbXBvcnQgeyBNYXJrZXJNYW5hZ2VyIH0gZnJvbSAnLi9tYXJrZXItbWFuYWdlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJbmZvV2luZG93TWFuYWdlciB7XG4gIHByaXZhdGUgX2luZm9XaW5kb3dzOiBNYXA8QWdtSW5mb1dpbmRvdywgUHJvbWlzZTxJbmZvV2luZG93Pj4gPVxuICAgICAgbmV3IE1hcDxBZ21JbmZvV2luZG93LCBQcm9taXNlPEluZm9XaW5kb3c+PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfbWFwc1dyYXBwZXI6IEdvb2dsZU1hcHNBUElXcmFwcGVyLCBwcml2YXRlIF96b25lOiBOZ1pvbmUsXG4gICAgICBwcml2YXRlIF9tYXJrZXJNYW5hZ2VyOiBNYXJrZXJNYW5hZ2VyKSB7fVxuXG4gIGRlbGV0ZUluZm9XaW5kb3coaW5mb1dpbmRvdzogQWdtSW5mb1dpbmRvdyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlXaW5kb3cgPSB0aGlzLl9pbmZvV2luZG93cy5nZXQoaW5mb1dpbmRvdyk7XG4gICAgaWYgKGlXaW5kb3cgPT0gbnVsbCkge1xuICAgICAgLy8gaW5mbyB3aW5kb3cgYWxyZWFkeSBkZWxldGVkXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBpV2luZG93LnRoZW4oKGk6IEluZm9XaW5kb3cpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl96b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIGkuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5faW5mb1dpbmRvd3MuZGVsZXRlKGluZm9XaW5kb3cpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRQb3NpdGlvbihpbmZvV2luZG93OiBBZ21JbmZvV2luZG93KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2luZm9XaW5kb3dzLmdldChpbmZvV2luZG93KS50aGVuKChpOiBJbmZvV2luZG93KSA9PiBpLnNldFBvc2l0aW9uKHtcbiAgICAgIGxhdDogaW5mb1dpbmRvdy5sYXRpdHVkZSxcbiAgICAgIGxuZzogaW5mb1dpbmRvdy5sb25naXR1ZGUsXG4gICAgfSkpO1xuICB9XG5cbiAgc2V0WkluZGV4KGluZm9XaW5kb3c6IEFnbUluZm9XaW5kb3cpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5faW5mb1dpbmRvd3MuZ2V0KGluZm9XaW5kb3cpXG4gICAgICAgIC50aGVuKChpOiBJbmZvV2luZG93KSA9PiBpLnNldFpJbmRleChpbmZvV2luZG93LnpJbmRleCkpO1xuICB9XG5cbiAgb3BlbihpbmZvV2luZG93OiBBZ21JbmZvV2luZG93KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2luZm9XaW5kb3dzLmdldChpbmZvV2luZG93KS50aGVuKCh3KSA9PiB7XG4gICAgICBpZiAoaW5mb1dpbmRvdy5ob3N0TWFya2VyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtlck1hbmFnZXIuZ2V0TmF0aXZlTWFya2VyKGluZm9XaW5kb3cuaG9zdE1hcmtlcikudGhlbigobWFya2VyKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX21hcHNXcmFwcGVyLmdldE5hdGl2ZU1hcCgpLnRoZW4oKG1hcCkgPT4gdy5vcGVuKG1hcCwgbWFya2VyKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX21hcHNXcmFwcGVyLmdldE5hdGl2ZU1hcCgpLnRoZW4oKG1hcCkgPT4gdy5vcGVuKG1hcCkpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xvc2UoaW5mb1dpbmRvdzogQWdtSW5mb1dpbmRvdyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9pbmZvV2luZG93cy5nZXQoaW5mb1dpbmRvdykudGhlbigodykgPT4gdy5jbG9zZSgpKTtcbiAgfVxuXG4gIHNldE9wdGlvbnMoaW5mb1dpbmRvdzogQWdtSW5mb1dpbmRvdywgb3B0aW9uczogSW5mb1dpbmRvd09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5faW5mb1dpbmRvd3MuZ2V0KGluZm9XaW5kb3cpLnRoZW4oKGk6IEluZm9XaW5kb3cpID0+IGkuc2V0T3B0aW9ucyhvcHRpb25zKSk7XG4gIH1cblxuICBhZGRJbmZvV2luZG93KGluZm9XaW5kb3c6IEFnbUluZm9XaW5kb3cpIHtcbiAgICBjb25zdCBvcHRpb25zOiBJbmZvV2luZG93T3B0aW9ucyA9IHtcbiAgICAgIGNvbnRlbnQ6IGluZm9XaW5kb3cuY29udGVudCxcbiAgICAgIG1heFdpZHRoOiBpbmZvV2luZG93Lm1heFdpZHRoLFxuICAgICAgekluZGV4OiBpbmZvV2luZG93LnpJbmRleCxcbiAgICAgIGRpc2FibGVBdXRvUGFuOiBpbmZvV2luZG93LmRpc2FibGVBdXRvUGFuLFxuICAgIH07XG4gICAgaWYgKHR5cGVvZiBpbmZvV2luZG93LmxhdGl0dWRlID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgaW5mb1dpbmRvdy5sb25naXR1ZGUgPT09ICdudW1iZXInKSB7XG4gICAgICBvcHRpb25zLnBvc2l0aW9uID0ge2xhdDogaW5mb1dpbmRvdy5sYXRpdHVkZSwgbG5nOiBpbmZvV2luZG93LmxvbmdpdHVkZX07XG4gICAgfVxuICAgIGNvbnN0IGluZm9XaW5kb3dQcm9taXNlID0gdGhpcy5fbWFwc1dyYXBwZXIuY3JlYXRlSW5mb1dpbmRvdyhvcHRpb25zKTtcbiAgICB0aGlzLl9pbmZvV2luZG93cy5zZXQoaW5mb1dpbmRvdywgaW5mb1dpbmRvd1Byb21pc2UpO1xuICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlcyBhIEdvb2dsZSBNYXBzIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgZ2l2ZW4gSW5mb1dpbmRvdyBhcyBhbiBPYnNlcnZhYmxlXG4gICAgKi9cbiAgY3JlYXRlRXZlbnRPYnNlcnZhYmxlPFQ+KGV2ZW50TmFtZTogc3RyaW5nLCBpbmZvV2luZG93OiBBZ21JbmZvV2luZG93KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IHtcbiAgICAgIHRoaXMuX2luZm9XaW5kb3dzLmdldChpbmZvV2luZG93KS50aGVuKChpOiBJbmZvV2luZG93KSA9PiB7XG4gICAgICAgIGkuYWRkTGlzdGVuZXIoZXZlbnROYW1lLCAoZTogVCkgPT4gdGhpcy5fem9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dChlKSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==