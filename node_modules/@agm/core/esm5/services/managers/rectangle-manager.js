import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import * as ɵngcc0 from '@angular/core';
var RectangleManager = /** @class */ (function () {
    function RectangleManager(_apiWrapper, _zone) {
        this._apiWrapper = _apiWrapper;
        this._zone = _zone;
        this._rectangles = new Map();
    }
    RectangleManager.prototype.addRectangle = function (rectangle) {
        this._rectangles.set(rectangle, this._apiWrapper.createRectangle({
            bounds: {
                north: rectangle.north,
                east: rectangle.east,
                south: rectangle.south,
                west: rectangle.west,
            },
            clickable: rectangle.clickable,
            draggable: rectangle.draggable,
            editable: rectangle.editable,
            fillColor: rectangle.fillColor,
            fillOpacity: rectangle.fillOpacity,
            strokeColor: rectangle.strokeColor,
            strokeOpacity: rectangle.strokeOpacity,
            strokePosition: rectangle.strokePosition,
            strokeWeight: rectangle.strokeWeight,
            visible: rectangle.visible,
            zIndex: rectangle.zIndex,
        }));
    };
    /**
     * Removes the given rectangle from the map.
     */
    RectangleManager.prototype.removeRectangle = function (rectangle) {
        var _this = this;
        return this._rectangles.get(rectangle).then(function (r) {
            r.setMap(null);
            _this._rectangles.delete(rectangle);
        });
    };
    RectangleManager.prototype.setOptions = function (rectangle, options) {
        return this._rectangles.get(rectangle).then(function (r) { return r.setOptions(options); });
    };
    RectangleManager.prototype.getBounds = function (rectangle) {
        return this._rectangles.get(rectangle).then(function (r) { return r.getBounds(); });
    };
    RectangleManager.prototype.setBounds = function (rectangle) {
        return this._rectangles.get(rectangle).then(function (r) {
            return r.setBounds({
                north: rectangle.north,
                east: rectangle.east,
                south: rectangle.south,
                west: rectangle.west,
            });
        });
    };
    RectangleManager.prototype.setEditable = function (rectangle) {
        return this._rectangles.get(rectangle).then(function (r) {
            return r.setEditable(rectangle.editable);
        });
    };
    RectangleManager.prototype.setDraggable = function (rectangle) {
        return this._rectangles.get(rectangle).then(function (r) {
            return r.setDraggable(rectangle.draggable);
        });
    };
    RectangleManager.prototype.setVisible = function (rectangle) {
        return this._rectangles.get(rectangle).then(function (r) {
            return r.setVisible(rectangle.visible);
        });
    };
    RectangleManager.prototype.createEventObservable = function (eventName, rectangle) {
        var _this = this;
        return Observable.create(function (observer) {
            var listener = null;
            _this._rectangles.get(rectangle).then(function (r) {
                listener = r.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
            });
            return function () {
                if (listener !== null) {
                    listener.remove();
                }
            };
        });
    };
    RectangleManager.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper },
        { type: NgZone }
    ]; };
    RectangleManager = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [GoogleMapsAPIWrapper, NgZone])
    ], RectangleManager);
RectangleManager.ɵfac = function RectangleManager_Factory(t) { return new (t || RectangleManager)(ɵngcc0.ɵɵinject(GoogleMapsAPIWrapper), ɵngcc0.ɵɵinject(ɵngcc0.NgZone)); };
RectangleManager.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: RectangleManager, factory: function (t) { return RectangleManager.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RectangleManager, [{
        type: Injectable
    }], function () { return [{ type: GoogleMapsAPIWrapper }, { type: ɵngcc0.NgZone }]; }, null); })();
    return RectangleManager;
}());
export { RectangleManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlLW1hbmFnZXIuanMiLCJzb3VyY2VzIjpbIm5nOi9AYWdtL2NvcmUvc2VydmljZXMvbWFuYWdlcnMvcmVjdGFuZ2xlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxNQUFNLENBQUM7QUFHNUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBSWxFO0FBQ29CLElBR2xCLDBCQUFvQixXQUFpQyxFQUFVLEtBQWE7QUFBSSxRQUE1RCxnQkFBVyxHQUFYLFdBQVcsQ0FBc0I7QUFBQyxRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7QUFBQyxRQUhyRSxnQkFBVyxHQUNmLElBQUksR0FBRyxFQUE2QyxDQUFDO0FBQzNELElBQ2lGLENBQUM7QUFDbEYsSUFDRSx1Q0FBWSxHQUFaLFVBQWEsU0FBdUI7QUFDdEMsUUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDckUsWUFBTSxNQUFNLEVBQUU7QUFDZCxnQkFBUSxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUs7QUFDOUIsZ0JBQVEsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO0FBQzVCLGdCQUFRLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSztBQUM5QixnQkFBUSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7QUFDNUIsYUFBTztBQUNQLFlBQU0sU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO0FBQ3BDLFlBQU0sU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO0FBQ3BDLFlBQU0sUUFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRO0FBQ2xDLFlBQU0sU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO0FBQ3BDLFlBQU0sV0FBVyxFQUFFLFNBQVMsQ0FB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QUNBLENBREEsQUF6RkQsSUF5RkM7QUFDRCxTQTFGYSxnQkFBZ0I7QUFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQWdtUmVjdGFuZ2xlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yZWN0YW5nbGUnO1xuaW1wb3J0IHsgR29vZ2xlTWFwc0FQSVdyYXBwZXIgfSBmcm9tICcuLi9nb29nbGUtbWFwcy1hcGktd3JhcHBlcic7XG5pbXBvcnQgKiBhcyBtYXBUeXBlcyBmcm9tICcuLi9nb29nbGUtbWFwcy10eXBlcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGVNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBfcmVjdGFuZ2xlczogTWFwPEFnbVJlY3RhbmdsZSwgUHJvbWlzZTxtYXBUeXBlcy5SZWN0YW5nbGU+PiA9XG4gICAgICBuZXcgTWFwPEFnbVJlY3RhbmdsZSwgUHJvbWlzZTxtYXBUeXBlcy5SZWN0YW5nbGU+PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2FwaVdyYXBwZXI6IEdvb2dsZU1hcHNBUElXcmFwcGVyLCBwcml2YXRlIF96b25lOiBOZ1pvbmUpIHt9XG5cbiAgYWRkUmVjdGFuZ2xlKHJlY3RhbmdsZTogQWdtUmVjdGFuZ2xlKSB7XG4gICAgdGhpcy5fcmVjdGFuZ2xlcy5zZXQocmVjdGFuZ2xlLCB0aGlzLl9hcGlXcmFwcGVyLmNyZWF0ZVJlY3RhbmdsZSh7XG4gICAgICBib3VuZHM6IHtcbiAgICAgICAgbm9ydGg6IHJlY3RhbmdsZS5ub3J0aCxcbiAgICAgICAgZWFzdDogcmVjdGFuZ2xlLmVhc3QsXG4gICAgICAgIHNvdXRoOiByZWN0YW5nbGUuc291dGgsXG4gICAgICAgIHdlc3Q6IHJlY3RhbmdsZS53ZXN0LFxuICAgICAgfSxcbiAgICAgIGNsaWNrYWJsZTogcmVjdGFuZ2xlLmNsaWNrYWJsZSxcbiAgICAgIGRyYWdnYWJsZTogcmVjdGFuZ2xlLmRyYWdnYWJsZSxcbiAgICAgIGVkaXRhYmxlOiByZWN0YW5nbGUuZWRpdGFibGUsXG4gICAgICBmaWxsQ29sb3I6IHJlY3RhbmdsZS5maWxsQ29sb3IsXG4gICAgICBmaWxsT3BhY2l0eTogcmVjdGFuZ2xlLmZpbGxPcGFjaXR5LFxuICAgICAgc3Ryb2tlQ29sb3I6IHJlY3RhbmdsZS5zdHJva2VDb2xvcixcbiAgICAgIHN0cm9rZU9wYWNpdHk6IHJlY3RhbmdsZS5zdHJva2VPcGFjaXR5LFxuICAgICAgc3Ryb2tlUG9zaXRpb246IHJlY3RhbmdsZS5zdHJva2VQb3NpdGlvbixcbiAgICAgIHN0cm9rZVdlaWdodDogcmVjdGFuZ2xlLnN0cm9rZVdlaWdodCxcbiAgICAgIHZpc2libGU6IHJlY3RhbmdsZS52aXNpYmxlLFxuICAgICAgekluZGV4OiByZWN0YW5nbGUuekluZGV4LFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBnaXZlbiByZWN0YW5nbGUgZnJvbSB0aGUgbWFwLlxuICAgKi9cbiAgcmVtb3ZlUmVjdGFuZ2xlKHJlY3RhbmdsZTogQWdtUmVjdGFuZ2xlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY3RhbmdsZXMuZ2V0KHJlY3RhbmdsZSkudGhlbigocikgPT4ge1xuICAgICAgci5zZXRNYXAobnVsbCk7XG4gICAgICB0aGlzLl9yZWN0YW5nbGVzLmRlbGV0ZShyZWN0YW5nbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0T3B0aW9ucyhyZWN0YW5nbGU6IEFnbVJlY3RhbmdsZSwgb3B0aW9uczogbWFwVHlwZXMuUmVjdGFuZ2xlT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9yZWN0YW5nbGVzLmdldChyZWN0YW5nbGUpLnRoZW4oKHIpID0+IHIuc2V0T3B0aW9ucyhvcHRpb25zKSk7XG4gIH1cblxuICBnZXRCb3VuZHMocmVjdGFuZ2xlOiBBZ21SZWN0YW5nbGUpOiBQcm9taXNlPG1hcFR5cGVzLkxhdExuZ0JvdW5kcz4ge1xuICAgIHJldHVybiB0aGlzLl9yZWN0YW5nbGVzLmdldChyZWN0YW5nbGUpLnRoZW4oKHIpID0+IHIuZ2V0Qm91bmRzKCkpO1xuICB9XG5cbiAgc2V0Qm91bmRzKHJlY3RhbmdsZTogQWdtUmVjdGFuZ2xlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY3RhbmdsZXMuZ2V0KHJlY3RhbmdsZSkudGhlbigocikgPT4ge1xuICAgICAgcmV0dXJuIHIuc2V0Qm91bmRzKHtcbiAgICAgICAgbm9ydGg6IHJlY3RhbmdsZS5ub3J0aCxcbiAgICAgICAgZWFzdDogcmVjdGFuZ2xlLmVhc3QsXG4gICAgICAgIHNvdXRoOiByZWN0YW5nbGUuc291dGgsXG4gICAgICAgIHdlc3Q6IHJlY3RhbmdsZS53ZXN0LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRFZGl0YWJsZShyZWN0YW5nbGU6IEFnbVJlY3RhbmdsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9yZWN0YW5nbGVzLmdldChyZWN0YW5nbGUpLnRoZW4oKHIpID0+IHtcbiAgICAgIHJldHVybiByLnNldEVkaXRhYmxlKHJlY3RhbmdsZS5lZGl0YWJsZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXREcmFnZ2FibGUocmVjdGFuZ2xlOiBBZ21SZWN0YW5nbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fcmVjdGFuZ2xlcy5nZXQocmVjdGFuZ2xlKS50aGVuKChyKSA9PiB7XG4gICAgICByZXR1cm4gci5zZXREcmFnZ2FibGUocmVjdGFuZ2xlLmRyYWdnYWJsZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRWaXNpYmxlKHJlY3RhbmdsZTogQWdtUmVjdGFuZ2xlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY3RhbmdsZXMuZ2V0KHJlY3RhbmdsZSkudGhlbigocikgPT4ge1xuICAgICAgcmV0dXJuIHIuc2V0VmlzaWJsZShyZWN0YW5nbGUudmlzaWJsZSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVFdmVudE9ic2VydmFibGU8VD4oZXZlbnROYW1lOiBzdHJpbmcsIHJlY3RhbmdsZTogQWdtUmVjdGFuZ2xlKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IHtcbiAgICAgIGxldCBsaXN0ZW5lcjogbWFwVHlwZXMuTWFwc0V2ZW50TGlzdGVuZXIgPSBudWxsO1xuICAgICAgdGhpcy5fcmVjdGFuZ2xlcy5nZXQocmVjdGFuZ2xlKS50aGVuKChyKSA9PiB7XG4gICAgICAgIGxpc3RlbmVyID0gci5hZGRMaXN0ZW5lcihldmVudE5hbWUsIChlOiBUKSA9PiB0aGlzLl96b25lLnJ1bigoKSA9PiBvYnNlcnZlci5uZXh0KGUpKSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGxpc3RlbmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==