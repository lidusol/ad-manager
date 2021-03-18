import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMapsAPIWrapper } from './../google-maps-api-wrapper';
import * as ɵngcc0 from '@angular/core';
var MarkerManager = /** @class */ (function () {
    function MarkerManager(_mapsWrapper, _zone) {
        this._mapsWrapper = _mapsWrapper;
        this._zone = _zone;
        this._markers = new Map();
    }
    MarkerManager.prototype.convertAnimation = function (uiAnim) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (uiAnim === null) {
                    return [2 /*return*/, null];
                }
                else {
                    return [2 /*return*/, this._mapsWrapper.getNativeMap().then(function () { return google.maps.Animation[uiAnim]; })];
                }
                return [2 /*return*/];
            });
        });
    };
    MarkerManager.prototype.deleteMarker = function (marker) {
        var _this = this;
        var m = this._markers.get(marker);
        if (m == null) {
            // marker already deleted
            return Promise.resolve();
        }
        return m.then(function (m) {
            return _this._zone.run(function () {
                m.setMap(null);
                _this._markers.delete(marker);
            });
        });
    };
    MarkerManager.prototype.updateMarkerPosition = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setPosition({ lat: marker.latitude, lng: marker.longitude }); });
    };
    MarkerManager.prototype.updateTitle = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setTitle(marker.title); });
    };
    MarkerManager.prototype.updateLabel = function (marker) {
        return this._markers.get(marker).then(function (m) { m.setLabel(marker.label); });
    };
    MarkerManager.prototype.updateDraggable = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setDraggable(marker.draggable); });
    };
    MarkerManager.prototype.updateIcon = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setIcon(marker.iconUrl); });
    };
    MarkerManager.prototype.updateOpacity = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setOpacity(marker.opacity); });
    };
    MarkerManager.prototype.updateVisible = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setVisible(marker.visible); });
    };
    MarkerManager.prototype.updateZIndex = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setZIndex(marker.zIndex); });
    };
    MarkerManager.prototype.updateClickable = function (marker) {
        return this._markers.get(marker).then(function (m) { return m.setClickable(marker.clickable); });
    };
    MarkerManager.prototype.updateAnimation = function (marker) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var m, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._markers.get(marker)];
                    case 1:
                        m = _c.sent();
                        _b = (_a = m).setAnimation;
                        return [4 /*yield*/, this.convertAnimation(marker.animation)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    MarkerManager.prototype.addMarker = function (marker) {
        var _this = this;
        var markerPromise = new Promise(function (resolve) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this._mapsWrapper).createMarker;
                        _c = {
                            position: { lat: marker.latitude, lng: marker.longitude },
                            label: marker.label,
                            draggable: marker.draggable,
                            icon: marker.iconUrl,
                            opacity: marker.opacity,
                            visible: marker.visible,
                            zIndex: marker.zIndex,
                            title: marker.title,
                            clickable: marker.clickable
                        };
                        return [4 /*yield*/, this.convertAnimation(marker.animation)];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_c.animation = _d.sent(),
                                _c)]).then(resolve)];
                }
            });
        }); });
        this._markers.set(marker, markerPromise);
    };
    MarkerManager.prototype.getNativeMarker = function (marker) {
        return this._markers.get(marker);
    };
    MarkerManager.prototype.createEventObservable = function (eventName, marker) {
        var _this = this;
        return new Observable(function (observer) {
            _this._markers.get(marker).then(function (m) {
                m.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
            });
        });
    };
    MarkerManager.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper },
        { type: NgZone }
    ]; };
    MarkerManager = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [GoogleMapsAPIWrapper, NgZone])
    ], MarkerManager);
MarkerManager.ɵfac = function MarkerManager_Factory(t) { return new (t || MarkerManager)(ɵngcc0.ɵɵinject(GoogleMapsAPIWrapper), ɵngcc0.ɵɵinject(ɵngcc0.NgZone)); };
MarkerManager.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: MarkerManager, factory: function (t) { return MarkerManager.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(MarkerManager, [{
        type: Injectable
    }], function () { return [{ type: GoogleMapsAPIWrapper }, { type: ɵngcc0.NgZone }]; }, null); })();
    return MarkerManager;
}());
export { MarkerManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2VyLW1hbmFnZXIuanMiLCJzb3VyY2VzIjpbIm5nOi9AYWdtL2NvcmUvc2VydmljZXMvbWFuYWdlcnMvbWFya2VyLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxNQUFNLENBQUM7QUFJNUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOEJBQThCLENBQUM7O0FBTXBFO0FBQ29CLElBR2xCLHVCQUFzQixZQUFrQyxFQUFZLEtBQWE7QUFBSSxRQUEvRCxpQkFBWSxHQUFaLFlBQVksQ0FBc0I7QUFBQyxRQUFXLFVBQUssR0FBTCxLQUFLLENBQVE7QUFBQyxRQUh4RSxhQUFRLEdBQ2QsSUFBSSxHQUFHLEVBQThCLENBQUM7QUFDNUMsSUFDc0YsQ0FBQztBQUN2RixJQUNRLHdDQUFnQixHQUF0QixVQUF1QixNQUFnQztBQUFJO0FBR25EO0FBQ2dELGdCQUh0RCxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDekIsb0JBQU0sc0JBQU8sSUFBSSxFQUFDO0FBQ2xCLGlCQUFLO0FBQUMscUJBQUs7QUFDWCxvQkFBTSxzQkFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQTdCLENBQTZCLENBQUMsRUFBQztBQUN4RixpQkFBSztBQUNMO0FBRWtDO0FBQWdCO0FBQ3ZDLEtBSFI7QUFFSCxJQUFFLG9DQUFZLEdBQVosVUFBYSxNQUFpQjtBQUFJLFFBQWxDLGlCQVlDO0FBQ0gsUUFaSSxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QyxRQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtBQUNuQixZ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LFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBUztBQUFJLGdCQUMzQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxVQUFDLENBQUksSUFBSyxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFoQixDQUFnQixDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztBQUNuRixZQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1QsUUFBSSxDQUFDLENBQUMsQ0FBQztBQUNQLElBQUUsQ0FBQztBQUNGO0FBQ3dELGdCQS9GbkIsb0JBQW9CO0FBQUksZ0JBQWUsTUFBTTtBQUFHO0FBRS9FLElBTk0sYUFBYSxnQ0FEekIsVUFBVSxFQUFFLHJCQUNMLDBDQUk4QixvQkFBb0IsRUFBbUIsTUFBTTtBQUFHLE9BSnpFLGFBQWEsQ0FrR3pCOzs7Ozt1R0FDRDtBQUFDLElBREQsb0JBQUM7QUFDQSxDQURBLEFBbEdELElBa0dDO0FBQ0QsU0FuR2EsYUFBYTtBQUN6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQWdtTWFya2VyIH0gZnJvbSAnLi8uLi8uLi9kaXJlY3RpdmVzL21hcmtlcic7XG5cbmltcG9ydCB7IEdvb2dsZU1hcHNBUElXcmFwcGVyIH0gZnJvbSAnLi8uLi9nb29nbGUtbWFwcy1hcGktd3JhcHBlcic7XG5pbXBvcnQgeyBNYXJrZXIgfSBmcm9tICcuLy4uL2dvb2dsZS1tYXBzLXR5cGVzJztcblxuZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXJrZXJNYW5hZ2VyIHtcbiAgcHJvdGVjdGVkIF9tYXJrZXJzOiBNYXA8QWdtTWFya2VyLCBQcm9taXNlPE1hcmtlcj4+ID1cbiAgICAgIG5ldyBNYXA8QWdtTWFya2VyLCBQcm9taXNlPE1hcmtlcj4+KCk7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9tYXBzV3JhcHBlcjogR29vZ2xlTWFwc0FQSVdyYXBwZXIsIHByb3RlY3RlZCBfem9uZTogTmdab25lKSB7fVxuXG4gIGFzeW5jIGNvbnZlcnRBbmltYXRpb24odWlBbmltOiAnQk9VTkNFJyB8ICdEUk9QJyB8IG51bGwpOiBQcm9taXNlPGFueT57XG4gICAgaWYgKHVpQW5pbSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXBzV3JhcHBlci5nZXROYXRpdmVNYXAoKS50aGVuKCgpID0+IGdvb2dsZS5tYXBzLkFuaW1hdGlvblt1aUFuaW1dKTtcbiAgICB9XG4gIH1cblxuICBkZWxldGVNYXJrZXIobWFya2VyOiBBZ21NYXJrZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBtID0gdGhpcy5fbWFya2Vycy5nZXQobWFya2VyKTtcbiAgICBpZiAobSA9PSBudWxsKSB7XG4gICAgICAvLyBtYXJrZXIgYWxyZWFkeSBkZWxldGVkXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBtLnRoZW4oKG06IE1hcmtlcikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgbS5zZXRNYXAobnVsbCk7XG4gICAgICAgIHRoaXMuX21hcmtlcnMuZGVsZXRlKG1hcmtlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZU1hcmtlclBvc2l0aW9uKG1hcmtlcjogQWdtTWFya2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmtlcnMuZ2V0KG1hcmtlcikudGhlbihcbiAgICAgICAgKG06IE1hcmtlcikgPT4gbS5zZXRQb3NpdGlvbih7bGF0OiBtYXJrZXIubGF0aXR1ZGUsIGxuZzogbWFya2VyLmxvbmdpdHVkZX0pKTtcbiAgfVxuXG4gIHVwZGF0ZVRpdGxlKG1hcmtlcjogQWdtTWFya2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmtlcnMuZ2V0KG1hcmtlcikudGhlbigobTogTWFya2VyKSA9PiBtLnNldFRpdGxlKG1hcmtlci50aXRsZSkpO1xuICB9XG5cbiAgdXBkYXRlTGFiZWwobWFya2VyOiBBZ21NYXJrZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2Vycy5nZXQobWFya2VyKS50aGVuKChtOiBNYXJrZXIpID0+IHsgbS5zZXRMYWJlbChtYXJrZXIubGFiZWwpOyB9KTtcbiAgfVxuXG4gIHVwZGF0ZURyYWdnYWJsZShtYXJrZXI6IEFnbU1hcmtlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9tYXJrZXJzLmdldChtYXJrZXIpLnRoZW4oKG06IE1hcmtlcikgPT4gbS5zZXREcmFnZ2FibGUobWFya2VyLmRyYWdnYWJsZSkpO1xuICB9XG5cbiAgdXBkYXRlSWNvbihtYXJrZXI6IEFnbU1hcmtlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9tYXJrZXJzLmdldChtYXJrZXIpLnRoZW4oKG06IE1hcmtlcikgPT4gbS5zZXRJY29uKG1hcmtlci5pY29uVXJsKSk7XG4gIH1cblxuICB1cGRhdGVPcGFjaXR5KG1hcmtlcjogQWdtTWFya2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmtlcnMuZ2V0KG1hcmtlcikudGhlbigobTogTWFya2VyKSA9PiBtLnNldE9wYWNpdHkobWFya2VyLm9wYWNpdHkpKTtcbiAgfVxuXG4gIHVwZGF0ZVZpc2libGUobWFya2VyOiBBZ21NYXJrZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2Vycy5nZXQobWFya2VyKS50aGVuKChtOiBNYXJrZXIpID0+IG0uc2V0VmlzaWJsZShtYXJrZXIudmlzaWJsZSkpO1xuICB9XG5cbiAgdXBkYXRlWkluZGV4KG1hcmtlcjogQWdtTWFya2VyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmtlcnMuZ2V0KG1hcmtlcikudGhlbigobTogTWFya2VyKSA9PiBtLnNldFpJbmRleChtYXJrZXIuekluZGV4KSk7XG4gIH1cblxuICB1cGRhdGVDbGlja2FibGUobWFya2VyOiBBZ21NYXJrZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2Vycy5nZXQobWFya2VyKS50aGVuKChtOiBNYXJrZXIpID0+IG0uc2V0Q2xpY2thYmxlKG1hcmtlci5jbGlja2FibGUpKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUFuaW1hdGlvbihtYXJrZXI6IEFnbU1hcmtlcikge1xuICAgIGNvbnN0IG0gPSBhd2FpdCB0aGlzLl9tYXJrZXJzLmdldChtYXJrZXIpO1xuICAgIG0uc2V0QW5pbWF0aW9uKGF3YWl0IHRoaXMuY29udmVydEFuaW1hdGlvbihtYXJrZXIuYW5pbWF0aW9uKSk7XG4gIH1cblxuICBhZGRNYXJrZXIobWFya2VyOiBBZ21NYXJrZXIpIHtcbiAgICBjb25zdCBtYXJrZXJQcm9taXNlID0gbmV3IFByb21pc2U8TWFya2VyPihhc3luYyAocmVzb2x2ZSkgPT5cbiAgICAgdGhpcy5fbWFwc1dyYXBwZXIuY3JlYXRlTWFya2VyKHtcbiAgICAgICAgcG9zaXRpb246IHtsYXQ6IG1hcmtlci5sYXRpdHVkZSwgbG5nOiBtYXJrZXIubG9uZ2l0dWRlfSxcbiAgICAgICAgbGFiZWw6IG1hcmtlci5sYWJlbCxcbiAgICAgICAgZHJhZ2dhYmxlOiBtYXJrZXIuZHJhZ2dhYmxlLFxuICAgICAgICBpY29uOiBtYXJrZXIuaWNvblVybCxcbiAgICAgICAgb3BhY2l0eTogbWFya2VyLm9wYWNpdHksXG4gICAgICAgIHZpc2libGU6IG1hcmtlci52aXNpYmxlLFxuICAgICAgICB6SW5kZXg6IG1hcmtlci56SW5kZXgsXG4gICAgICAgIHRpdGxlOiBtYXJrZXIudGl0bGUsXG4gICAgICAgIGNsaWNrYWJsZTogbWFya2VyLmNsaWNrYWJsZSxcbiAgICAgICAgYW5pbWF0aW9uOiBhd2FpdCB0aGlzLmNvbnZlcnRBbmltYXRpb24obWFya2VyLmFuaW1hdGlvbiksXG4gICAgICB9KS50aGVuKHJlc29sdmUpKTtcbiAgICB0aGlzLl9tYXJrZXJzLnNldChtYXJrZXIsIG1hcmtlclByb21pc2UpO1xuICB9XG5cbiAgZ2V0TmF0aXZlTWFya2VyKG1hcmtlcjogQWdtTWFya2VyKTogUHJvbWlzZTxNYXJrZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2Vycy5nZXQobWFya2VyKTtcbiAgfVxuXG4gIGNyZWF0ZUV2ZW50T2JzZXJ2YWJsZTxUPihldmVudE5hbWU6IHN0cmluZywgbWFya2VyOiBBZ21NYXJrZXIpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyOiBPYnNlcnZlcjxUPikgPT4ge1xuICAgICAgdGhpcy5fbWFya2Vycy5nZXQobWFya2VyKS50aGVuKChtOiBNYXJrZXIpID0+IHtcbiAgICAgICAgbS5hZGRMaXN0ZW5lcihldmVudE5hbWUsIChlOiBUKSA9PiB0aGlzLl96b25lLnJ1bigoKSA9PiBvYnNlcnZlci5uZXh0KGUpKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19