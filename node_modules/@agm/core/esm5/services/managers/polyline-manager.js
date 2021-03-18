import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { createMVCEventObservable } from '../../utils/mvcarray-utils';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import * as ɵngcc0 from '@angular/core';
var PolylineManager = /** @class */ (function () {
    function PolylineManager(_mapsWrapper, _zone) {
        this._mapsWrapper = _mapsWrapper;
        this._zone = _zone;
        this._polylines = new Map();
    }
    PolylineManager_1 = PolylineManager;
    PolylineManager._convertPoints = function (line) {
        var path = line._getPoints().map(function (point) {
            return { lat: point.latitude, lng: point.longitude };
        });
        return path;
    };
    PolylineManager._convertPath = function (path) {
        var symbolPath = google.maps.SymbolPath[path];
        if (typeof symbolPath === 'number') {
            return symbolPath;
        }
        else {
            return path;
        }
    };
    PolylineManager._convertIcons = function (line) {
        var icons = line._getIcons().map(function (agmIcon) { return ({
            fixedRotation: agmIcon.fixedRotation,
            offset: agmIcon.offset,
            repeat: agmIcon.repeat,
            icon: {
                anchor: new google.maps.Point(agmIcon.anchorX, agmIcon.anchorY),
                fillColor: agmIcon.fillColor,
                fillOpacity: agmIcon.fillOpacity,
                path: PolylineManager_1._convertPath(agmIcon.path),
                rotation: agmIcon.rotation,
                scale: agmIcon.scale,
                strokeColor: agmIcon.strokeColor,
                strokeOpacity: agmIcon.strokeOpacity,
                strokeWeight: agmIcon.strokeWeight,
            },
        }); });
        // prune undefineds;
        icons.forEach(function (icon) {
            Object.entries(icon).forEach(function (_a) {
                var _b = tslib_1.__read(_a, 2), key = _b[0], val = _b[1];
                if (typeof val === 'undefined') {
                    delete icon[key];
                }
            });
            if (typeof icon.icon.anchor.x === 'undefined' ||
                typeof icon.icon.anchor.y === 'undefined') {
                delete icon.icon.anchor;
            }
        });
        return icons;
    };
    PolylineManager.prototype.addPolyline = function (line) {
        var _this = this;
        var polylinePromise = this._mapsWrapper.getNativeMap()
            .then(function () { return [PolylineManager_1._convertPoints(line),
            PolylineManager_1._convertIcons(line)]; })
            .then(function (_a) {
            var _b = tslib_1.__read(_a, 2), path = _b[0], icons = _b[1];
            return _this._mapsWrapper.createPolyline({
                clickable: line.clickable,
                draggable: line.draggable,
                editable: line.editable,
                geodesic: line.geodesic,
                strokeColor: line.strokeColor,
                strokeOpacity: line.strokeOpacity,
                strokeWeight: line.strokeWeight,
                visible: line.visible,
                zIndex: line.zIndex,
                path: path,
                icons: icons,
            });
        });
        this._polylines.set(line, polylinePromise);
    };
    PolylineManager.prototype.updatePolylinePoints = function (line) {
        var _this = this;
        var path = PolylineManager_1._convertPoints(line);
        var m = this._polylines.get(line);
        if (m == null) {
            return Promise.resolve();
        }
        return m.then(function (l) { return _this._zone.run(function () { l.setPath(path); }); });
    };
    PolylineManager.prototype.updateIconSequences = function (line) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var icons, m;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._mapsWrapper.getNativeMap()];
                    case 1:
                        _a.sent();
                        icons = PolylineManager_1._convertIcons(line);
                        m = this._polylines.get(line);
                        if (m == null) {
                            return [2 /*return*/];
                        }
                        return [2 /*return*/, m.then(function (l) { return _this._zone.run(function () { return l.setOptions({ icons: icons }); }); })];
                }
            });
        });
    };
    PolylineManager.prototype.setPolylineOptions = function (line, options) {
        return this._polylines.get(line).then(function (l) { l.setOptions(options); });
    };
    PolylineManager.prototype.deletePolyline = function (line) {
        var _this = this;
        var m = this._polylines.get(line);
        if (m == null) {
            return Promise.resolve();
        }
        return m.then(function (l) {
            return _this._zone.run(function () {
                l.setMap(null);
                _this._polylines.delete(line);
            });
        });
    };
    PolylineManager.prototype.getMVCPath = function (agmPolyline) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var polyline;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._polylines.get(agmPolyline)];
                    case 1:
                        polyline = _a.sent();
                        return [2 /*return*/, polyline.getPath()];
                }
            });
        });
    };
    PolylineManager.prototype.getPath = function (agmPolyline) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMVCPath(agmPolyline)];
                    case 1: return [2 /*return*/, (_a.sent()).getArray()];
                }
            });
        });
    };
    PolylineManager.prototype.createEventObservable = function (eventName, line) {
        var _this = this;
        return new Observable(function (observer) {
            _this._polylines.get(line).then(function (l) {
                l.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
            });
        });
    };
    PolylineManager.prototype.createPathEventObservable = function (line) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mvcPath;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMVCPath(line)];
                    case 1:
                        mvcPath = _a.sent();
                        return [2 /*return*/, createMVCEventObservable(mvcPath)];
                }
            });
        });
    };
    var PolylineManager_1;
    PolylineManager.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper },
        { type: NgZone }
    ]; };
    PolylineManager = PolylineManager_1 = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [GoogleMapsAPIWrapper, NgZone])
    ], PolylineManager);
PolylineManager.ɵfac = function PolylineManager_Factory(t) { return new (t || PolylineManager)(ɵngcc0.ɵɵinject(GoogleMapsAPIWrapper), ɵngcc0.ɵɵinject(ɵngcc0.NgZone)); };
PolylineManager.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: PolylineManager, factory: function (t) { return PolylineManager.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(PolylineManager, [{
        type: Injectable
    }], function () { return [{ type: GoogleMapsAPIWrapper }, { type: ɵngcc0.NgZone }]; }, null); })();
    return PolylineManager;
}());
export { PolylineManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtbWFuYWdlci5qcyIsInNvdXJjZXMiOlsibmc6L0BhZ20vY29yZS9zZXJ2aWNlcy9tYW5hZ2Vycy9wb2x5bGluZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBSTVDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQU1sRTtBQUNvQixJQUdsQix5QkFBb0IsWUFBa0MsRUFBVSxLQUFhO0FBQUksUUFBN0QsaUJBQVksR0FBWixZQUFZLENBQXNCO0FBQUMsUUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO0FBQUMsUUFIdEUsZUFBVSxHQUNkLElBQUksR0FBRyxFQUFrQyxDQUFDO0FBQ2hELElBQ2tGLENBQUM7QUFDbkYsd0JBTGEsZUFBZTtBQUFFLElBTWIsOEJBQWMsR0FBN0IsVUFBOEIsSUFBaUI7QUFBSSxRQUNqRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBdUI7QUFBSSxZQUM3RCxPQUFPLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQWtCLENBQUM7QUFDMUUsUUFBSSxDQUFDLENBQUMsQ0FBQztBQUNQLFFBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsSUFBRSxDQUFDO0FBRUgsSUFBaUIsNEJBQVksR0FBM0IsVUFBNEIsSUFDRztBQUFJLFFBQ2pDLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELFFBQUksSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7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Q0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBSSxJQUFLLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQyxDQUFDO0FBQ25GLFlBQU0sQ0FBQyxDQUFDLENBQUM7QUFDVCxRQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ1AsSUFBRSxDQUFDO0FBRUgsSUFBUSxtREFBeUIsR0FBL0IsVUFBZ0MsSUFBaUI7QUFBSTtBQUNsQjtBQUN4QjtBQUdTO0FBQW9DLDRCQUp0QyxxQkFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFBO0FBQUM7QUFDckIsd0JBRGpCLE9BQU8sR0FBRyxTQUEyQjtBQUMvQyx3QkFBSSxzQkFBTyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsRUFBQztBQUM3QztBQUVZO0FBQWdCO0FBQVksS0FGckM7QUFDRjtBQUN5QjtBQUE0RCxnQkFuSWxELG9CQUFvQjtBQUFJLGdCQUFhLE1BQU07QUFBRztBQUUzRSxJQU5NLGVBQWUsb0RBRDNCLFVBQVUsRUFBRSxyQkFDTCwwQ0FJNEIsb0JBQW9CLEVBQWlCLE1BQU07QUFBRyxPQUpyRSxlQUFlLENBc0kzQjs7Ozs7dUdBQ0Q7QUFBQyxJQURELHNCQUFDO0FBQ0EsQ0FEQSxBQXRJRCxJQXNJQztBQUNELFNBdklhLGVBQWU7QUFDM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFnbVBvbHlsaW5lLCBQYXRoRXZlbnQgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3BvbHlsaW5lJztcbmltcG9ydCB7IEFnbVBvbHlsaW5lUG9pbnQgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3BvbHlsaW5lLXBvaW50JztcbmltcG9ydCB7IGNyZWF0ZU1WQ0V2ZW50T2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL3V0aWxzL212Y2FycmF5LXV0aWxzJztcbmltcG9ydCB7IEdvb2dsZU1hcHNBUElXcmFwcGVyIH0gZnJvbSAnLi4vZ29vZ2xlLW1hcHMtYXBpLXdyYXBwZXInO1xuaW1wb3J0IHsgSWNvblNlcXVlbmNlLCBMYXRMbmcsIExhdExuZ0xpdGVyYWwsIE1WQ0FycmF5LCBQb2x5bGluZSB9IGZyb20gJy4uL2dvb2dsZS1tYXBzLXR5cGVzJztcblxuZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5bGluZU1hbmFnZXIge1xuICBwcml2YXRlIF9wb2x5bGluZXM6IE1hcDxBZ21Qb2x5bGluZSwgUHJvbWlzZTxQb2x5bGluZT4+ID1cbiAgICAgIG5ldyBNYXA8QWdtUG9seWxpbmUsIFByb21pc2U8UG9seWxpbmU+PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21hcHNXcmFwcGVyOiBHb29nbGVNYXBzQVBJV3JhcHBlciwgcHJpdmF0ZSBfem9uZTogTmdab25lKSB7fVxuXG4gIHByaXZhdGUgc3RhdGljIF9jb252ZXJ0UG9pbnRzKGxpbmU6IEFnbVBvbHlsaW5lKTogQXJyYXk8TGF0TG5nTGl0ZXJhbD4ge1xuICAgIGNvbnN0IHBhdGggPSBsaW5lLl9nZXRQb2ludHMoKS5tYXAoKHBvaW50OiBBZ21Qb2x5bGluZVBvaW50KSA9PiB7XG4gICAgICByZXR1cm4ge2xhdDogcG9pbnQubGF0aXR1ZGUsIGxuZzogcG9pbnQubG9uZ2l0dWRlfSBhcyBMYXRMbmdMaXRlcmFsO1xuICAgIH0pO1xuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX2NvbnZlcnRQYXRoKHBhdGg6ICdDSVJDTEUnIHwgJ0JBQ0tXQVJEX0NMT1NFRF9BUlJPVycgfCAnQkFDS1dBUkRfT1BFTl9BUlJPVycgfCAnRk9SV0FSRF9DTE9TRURfQVJST1cnIHxcbiAgJ0ZPUldBUkRfQ0xPU0VEX0FSUk9XJyB8IHN0cmluZyk6IG51bWJlciB8IHN0cmluZ3tcbiAgICBjb25zdCBzeW1ib2xQYXRoID0gZ29vZ2xlLm1hcHMuU3ltYm9sUGF0aFtwYXRoXTtcbiAgICBpZiAodHlwZW9mIHN5bWJvbFBhdGggPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gc3ltYm9sUGF0aDtcbiAgICB9IGVsc2V7XG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfY29udmVydEljb25zKGxpbmU6IEFnbVBvbHlsaW5lKTogQXJyYXk8SWNvblNlcXVlbmNlPiB7XG4gICAgY29uc3QgaWNvbnMgPSBsaW5lLl9nZXRJY29ucygpLm1hcChhZ21JY29uID0+ICh7XG4gICAgICBmaXhlZFJvdGF0aW9uOiBhZ21JY29uLmZpeGVkUm90YXRpb24sXG4gICAgICBvZmZzZXQ6IGFnbUljb24ub2Zmc2V0LFxuICAgICAgcmVwZWF0OiBhZ21JY29uLnJlcGVhdCxcbiAgICAgIGljb246IHtcbiAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoYWdtSWNvbi5hbmNob3JYLCBhZ21JY29uLmFuY2hvclkpLFxuICAgICAgICBmaWxsQ29sb3I6IGFnbUljb24uZmlsbENvbG9yLFxuICAgICAgICBmaWxsT3BhY2l0eTogYWdtSWNvbi5maWxsT3BhY2l0eSxcbiAgICAgICAgcGF0aDogUG9seWxpbmVNYW5hZ2VyLl9jb252ZXJ0UGF0aChhZ21JY29uLnBhdGgpLFxuICAgICAgICByb3RhdGlvbjogYWdtSWNvbi5yb3RhdGlvbixcbiAgICAgICAgc2NhbGU6IGFnbUljb24uc2NhbGUsXG4gICAgICAgIHN0cm9rZUNvbG9yOiBhZ21JY29uLnN0cm9rZUNvbG9yLFxuICAgICAgICBzdHJva2VPcGFjaXR5OiBhZ21JY29uLnN0cm9rZU9wYWNpdHksXG4gICAgICAgIHN0cm9rZVdlaWdodDogYWdtSWNvbi5zdHJva2VXZWlnaHQsXG4gICAgICB9LFxuICAgIH0gYXMgSWNvblNlcXVlbmNlKSk7XG4gICAgLy8gcHJ1bmUgdW5kZWZpbmVkcztcbiAgICBpY29ucy5mb3JFYWNoKGljb24gPT4ge1xuICAgICAgT2JqZWN0LmVudHJpZXMoaWNvbikuZm9yRWFjaCgoW2tleSwgdmFsXSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBkZWxldGUgKGljb24gYXMgYW55KVtrZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgaWNvbi5pY29uLmFuY2hvci54ID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICB0eXBlb2YgaWNvbi5pY29uLmFuY2hvci55ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGRlbGV0ZSBpY29uLmljb24uYW5jaG9yO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGljb25zO1xuICB9XG5cbiAgYWRkUG9seWxpbmUobGluZTogQWdtUG9seWxpbmUpIHtcbiAgICBjb25zdCBwb2x5bGluZVByb21pc2UgPSB0aGlzLl9tYXBzV3JhcHBlci5nZXROYXRpdmVNYXAoKVxuICAgIC50aGVuKCgpID0+IFsgUG9seWxpbmVNYW5hZ2VyLl9jb252ZXJ0UG9pbnRzKGxpbmUpLFxuICAgICAgICAgICAgICAgICAgUG9seWxpbmVNYW5hZ2VyLl9jb252ZXJ0SWNvbnMobGluZSldKVxuICAgIC50aGVuKChbcGF0aCwgaWNvbnNdOiBbTGF0TG5nTGl0ZXJhbFtdLCBJY29uU2VxdWVuY2VbXV0pID0+XG4gICAgICB0aGlzLl9tYXBzV3JhcHBlci5jcmVhdGVQb2x5bGluZSh7XG4gICAgICAgIGNsaWNrYWJsZTogbGluZS5jbGlja2FibGUsXG4gICAgICAgIGRyYWdnYWJsZTogbGluZS5kcmFnZ2FibGUsXG4gICAgICAgIGVkaXRhYmxlOiBsaW5lLmVkaXRhYmxlLFxuICAgICAgICBnZW9kZXNpYzogbGluZS5nZW9kZXNpYyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGxpbmUuc3Ryb2tlQ29sb3IsXG4gICAgICAgIHN0cm9rZU9wYWNpdHk6IGxpbmUuc3Ryb2tlT3BhY2l0eSxcbiAgICAgICAgc3Ryb2tlV2VpZ2h0OiBsaW5lLnN0cm9rZVdlaWdodCxcbiAgICAgICAgdmlzaWJsZTogbGluZS52aXNpYmxlLFxuICAgICAgICB6SW5kZXg6IGxpbmUuekluZGV4LFxuICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICBpY29uczogaWNvbnMsXG4gICAgfSkpO1xuICAgIHRoaXMuX3BvbHlsaW5lcy5zZXQobGluZSwgcG9seWxpbmVQcm9taXNlKTtcbiAgfVxuXG4gIHVwZGF0ZVBvbHlsaW5lUG9pbnRzKGxpbmU6IEFnbVBvbHlsaW5lKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGF0aCA9IFBvbHlsaW5lTWFuYWdlci5fY29udmVydFBvaW50cyhsaW5lKTtcbiAgICBjb25zdCBtID0gdGhpcy5fcG9seWxpbmVzLmdldChsaW5lKTtcbiAgICBpZiAobSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBtLnRoZW4oKGw6IFBvbHlsaW5lKSA9PiB7IHJldHVybiB0aGlzLl96b25lLnJ1bigoKSA9PiB7IGwuc2V0UGF0aChwYXRoKTsgfSk7IH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlSWNvblNlcXVlbmNlcyhsaW5lOiBBZ21Qb2x5bGluZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX21hcHNXcmFwcGVyLmdldE5hdGl2ZU1hcCgpO1xuICAgIGNvbnN0IGljb25zID0gUG9seWxpbmVNYW5hZ2VyLl9jb252ZXJ0SWNvbnMobGluZSk7XG4gICAgY29uc3QgbSA9IHRoaXMuX3BvbHlsaW5lcy5nZXQobGluZSk7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gbS50aGVuKGwgPT4gdGhpcy5fem9uZS5ydW4oKCkgPT4gbC5zZXRPcHRpb25zKHtpY29uczogaWNvbnN9KSApICk7XG4gIH1cblxuICBzZXRQb2x5bGluZU9wdGlvbnMobGluZTogQWdtUG9seWxpbmUsIG9wdGlvbnM6IHtbcHJvcE5hbWU6IHN0cmluZ106IGFueX0pOlxuICAgICAgUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lcy5nZXQobGluZSkudGhlbigobDogUG9seWxpbmUpID0+IHsgbC5zZXRPcHRpb25zKG9wdGlvbnMpOyB9KTtcbiAgfVxuXG4gIGRlbGV0ZVBvbHlsaW5lKGxpbmU6IEFnbVBvbHlsaW5lKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbSA9IHRoaXMuX3BvbHlsaW5lcy5nZXQobGluZSk7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gbS50aGVuKChsOiBQb2x5bGluZSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgbC5zZXRNYXAobnVsbCk7XG4gICAgICAgIHRoaXMuX3BvbHlsaW5lcy5kZWxldGUobGluZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0TVZDUGF0aChhZ21Qb2x5bGluZTogQWdtUG9seWxpbmUpOiBQcm9taXNlPE1WQ0FycmF5PExhdExuZz4+IHtcbiAgICBjb25zdCBwb2x5bGluZSA9IGF3YWl0IHRoaXMuX3BvbHlsaW5lcy5nZXQoYWdtUG9seWxpbmUpO1xuICAgIHJldHVybiBwb2x5bGluZS5nZXRQYXRoKCk7XG4gIH1cblxuICBhc3luYyBnZXRQYXRoKGFnbVBvbHlsaW5lOiBBZ21Qb2x5bGluZSk6IFByb21pc2U8QXJyYXk8TGF0TG5nPj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRNVkNQYXRoKGFnbVBvbHlsaW5lKSkuZ2V0QXJyYXkoKTtcbiAgfVxuXG4gIGNyZWF0ZUV2ZW50T2JzZXJ2YWJsZTxUPihldmVudE5hbWU6IHN0cmluZywgbGluZTogQWdtUG9seWxpbmUpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyOiBPYnNlcnZlcjxUPikgPT4ge1xuICAgICAgdGhpcy5fcG9seWxpbmVzLmdldChsaW5lKS50aGVuKChsOiBQb2x5bGluZSkgPT4ge1xuICAgICAgICBsLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgKGU6IFQpID0+IHRoaXMuX3pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQoZSkpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlUGF0aEV2ZW50T2JzZXJ2YWJsZShsaW5lOiBBZ21Qb2x5bGluZSk6IFByb21pc2U8T2JzZXJ2YWJsZTxQYXRoRXZlbnQ+PiB7XG4gICAgY29uc3QgbXZjUGF0aCA9IGF3YWl0IHRoaXMuZ2V0TVZDUGF0aChsaW5lKTtcbiAgICByZXR1cm4gY3JlYXRlTVZDRXZlbnRPYnNlcnZhYmxlKG12Y1BhdGgpO1xuICB9XG59XG4iXX0=