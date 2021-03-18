import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import * as ɵngcc0 from '@angular/core';
var CircleManager = /** @class */ (function () {
    function CircleManager(_apiWrapper, _zone) {
        this._apiWrapper = _apiWrapper;
        this._zone = _zone;
        this._circles = new Map();
    }
    CircleManager.prototype.addCircle = function (circle) {
        this._circles.set(circle, this._apiWrapper.createCircle({
            center: { lat: circle.latitude, lng: circle.longitude },
            clickable: circle.clickable,
            draggable: circle.draggable,
            editable: circle.editable,
            fillColor: circle.fillColor,
            fillOpacity: circle.fillOpacity,
            radius: circle.radius,
            strokeColor: circle.strokeColor,
            strokeOpacity: circle.strokeOpacity,
            strokePosition: circle.strokePosition,
            strokeWeight: circle.strokeWeight,
            visible: circle.visible,
            zIndex: circle.zIndex,
        }));
    };
    /**
     * Removes the given circle from the map.
     */
    CircleManager.prototype.removeCircle = function (circle) {
        var _this = this;
        return this._circles.get(circle).then(function (c) {
            c.setMap(null);
            _this._circles.delete(circle);
        });
    };
    CircleManager.prototype.setOptions = function (circle, options) {
        return this._circles.get(circle).then(function (c) {
            if (typeof options.strokePosition === 'string') {
                options.strokePosition = google.maps.StrokePosition[options.strokePosition];
            }
            c.setOptions(options);
        });
    };
    CircleManager.prototype.getBounds = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.getBounds(); });
    };
    CircleManager.prototype.getCenter = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.getCenter(); });
    };
    CircleManager.prototype.getRadius = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.getRadius(); });
    };
    CircleManager.prototype.setCenter = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.setCenter({ lat: circle.latitude, lng: circle.longitude }); });
    };
    CircleManager.prototype.setEditable = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.setEditable(circle.editable); });
    };
    CircleManager.prototype.setDraggable = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.setDraggable(circle.draggable); });
    };
    CircleManager.prototype.setVisible = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.setVisible(circle.visible); });
    };
    CircleManager.prototype.setRadius = function (circle) {
        return this._circles.get(circle).then(function (c) { return c.setRadius(circle.radius); });
    };
    CircleManager.prototype.getNativeCircle = function (circle) {
        return this._circles.get(circle);
    };
    CircleManager.prototype.createEventObservable = function (eventName, circle) {
        var _this = this;
        return new Observable(function (observer) {
            var listener = null;
            _this._circles.get(circle).then(function (c) {
                listener = c.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
            });
            return function () {
                if (listener !== null) {
                    listener.remove();
                }
            };
        });
    };
    CircleManager.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper },
        { type: NgZone }
    ]; };
    CircleManager = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [GoogleMapsAPIWrapper, NgZone])
    ], CircleManager);
CircleManager.ɵfac = function CircleManager_Factory(t) { return new (t || CircleManager)(ɵngcc0.ɵɵinject(GoogleMapsAPIWrapper), ɵngcc0.ɵɵinject(ɵngcc0.NgZone)); };
CircleManager.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: CircleManager, factory: function (t) { return CircleManager.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(CircleManager, [{
        type: Injectable
    }], function () { return [{ type: GoogleMapsAPIWrapper }, { type: ɵngcc0.NgZone }]; }, null); })();
    return CircleManager;
}());
export { CircleManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlLW1hbmFnZXIuanMiLCJzb3VyY2VzIjpbIm5nOi9AYWdtL2NvcmUvc2VydmljZXMvbWFuYWdlcnMvY2lyY2xlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxNQUFNLENBQUM7QUFHNUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBTWxFO0FBQ29CLElBR2xCLHVCQUFvQixXQUFpQyxFQUFVLEtBQWE7QUFBSSxRQUE1RCxnQkFBVyxHQUFYLFdBQVcsQ0FBc0I7QUFBQyxRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7QUFBQyxRQUhyRSxhQUFRLEdBQ1osSUFBSSxHQUFHLEVBQXVDLENBQUM7QUFDckQsSUFDaUYsQ0FBQztBQUNsRixJQUNFLGlDQUFTLEdBQVQsVUFBVSxNQUFpQjtBQUM3QixRQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztBQUM1RCxZQUFNLE1BQU0sRUFBRSxFQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFDO0FBQzNELFlBQU0sU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO0FBQ2pDLFlBQU0sU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO0FBQ2pDLFlBQU0sUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO0FBQy9CLFlBQU0sU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO0FBQ2pDLFlBQU0sV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO0FBQ3JDLFlBQU0sTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO0FBQzNCLFlBQU0sV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO0FBQ3JDLFlBQU0sYUFBYSxFQUFF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R0FBK0IsSUFBSSxDQUFDO0FBQ3RELFlBQU0sS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztBQUFJLGdCQUNuQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBQyxDQUFJLElBQUssT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQUM7QUFDOUYsWUFBTSxDQUFDLENBQUMsQ0FBQztBQUNULFlBQ00sT0FBTztBQUNQLGdCQUFFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtBQUMvQixvQkFBVSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDNUIsaUJBQVM7QUFDVCxZQUFNLENBQUMsQ0FBQztBQUNSLFFBQUksQ0FBQyxDQUFDLENBQUM7QUFDUCxJQUFFLENBQUM7QUFDRjtBQUN3RCxnQkEzRnRCLG9CQUFvQjtBQUFJLGdCQUFhLE1BQU07QUFBRztBQUUxRSxJQU5NLGFBQWEsZ0NBRHpCLFVBQVUsRUFBRSxyQkFDTCwwQ0FJMkIsb0JBQW9CLEVBQWlCLE1BQU07QUFBRyxPQUpwRSxhQUFhLENBOEZ6Qjs7Ozs7dUdBQ0Q7QUFBQyxJQURELG9CQUFDO0FBQ0EsQ0FEQSxBQTlGRCxJQThGQztBQUNELFNBL0ZhLGFBQWE7QUFDekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQWdtQ2lyY2xlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jaXJjbGUnO1xuaW1wb3J0IHsgR29vZ2xlTWFwc0FQSVdyYXBwZXIgfSBmcm9tICcuLi9nb29nbGUtbWFwcy1hcGktd3JhcHBlcic7XG5pbXBvcnQgKiBhcyBtYXBUeXBlcyBmcm9tICcuLi9nb29nbGUtbWFwcy10eXBlcyc7XG5cbmRlY2xhcmUgdmFyIGdvb2dsZTogYW55O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2lyY2xlTWFuYWdlciB7XG4gIHByaXZhdGUgX2NpcmNsZXM6IE1hcDxBZ21DaXJjbGUsIFByb21pc2U8bWFwVHlwZXMuQ2lyY2xlPj4gPVxuICAgICAgbmV3IE1hcDxBZ21DaXJjbGUsIFByb21pc2U8bWFwVHlwZXMuQ2lyY2xlPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9hcGlXcmFwcGVyOiBHb29nbGVNYXBzQVBJV3JhcHBlciwgcHJpdmF0ZSBfem9uZTogTmdab25lKSB7fVxuXG4gIGFkZENpcmNsZShjaXJjbGU6IEFnbUNpcmNsZSkge1xuICAgIHRoaXMuX2NpcmNsZXMuc2V0KGNpcmNsZSwgdGhpcy5fYXBpV3JhcHBlci5jcmVhdGVDaXJjbGUoe1xuICAgICAgY2VudGVyOiB7bGF0OiBjaXJjbGUubGF0aXR1ZGUsIGxuZzogY2lyY2xlLmxvbmdpdHVkZX0sXG4gICAgICBjbGlja2FibGU6IGNpcmNsZS5jbGlja2FibGUsXG4gICAgICBkcmFnZ2FibGU6IGNpcmNsZS5kcmFnZ2FibGUsXG4gICAgICBlZGl0YWJsZTogY2lyY2xlLmVkaXRhYmxlLFxuICAgICAgZmlsbENvbG9yOiBjaXJjbGUuZmlsbENvbG9yLFxuICAgICAgZmlsbE9wYWNpdHk6IGNpcmNsZS5maWxsT3BhY2l0eSxcbiAgICAgIHJhZGl1czogY2lyY2xlLnJhZGl1cyxcbiAgICAgIHN0cm9rZUNvbG9yOiBjaXJjbGUuc3Ryb2tlQ29sb3IsXG4gICAgICBzdHJva2VPcGFjaXR5OiBjaXJjbGUuc3Ryb2tlT3BhY2l0eSxcbiAgICAgIHN0cm9rZVBvc2l0aW9uOiBjaXJjbGUuc3Ryb2tlUG9zaXRpb24sXG4gICAgICBzdHJva2VXZWlnaHQ6IGNpcmNsZS5zdHJva2VXZWlnaHQsXG4gICAgICB2aXNpYmxlOiBjaXJjbGUudmlzaWJsZSxcbiAgICAgIHpJbmRleDogY2lyY2xlLnpJbmRleCxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gY2lyY2xlIGZyb20gdGhlIG1hcC5cbiAgICovXG4gIHJlbW92ZUNpcmNsZShjaXJjbGU6IEFnbUNpcmNsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9jaXJjbGVzLmdldChjaXJjbGUpLnRoZW4oKGMpID0+IHtcbiAgICAgIGMuc2V0TWFwKG51bGwpO1xuICAgICAgdGhpcy5fY2lyY2xlcy5kZWxldGUoY2lyY2xlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldE9wdGlvbnMoY2lyY2xlOiBBZ21DaXJjbGUsIG9wdGlvbnM6IG1hcFR5cGVzLkNpcmNsZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2lyY2xlcy5nZXQoY2lyY2xlKS50aGVuKChjKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc3Ryb2tlUG9zaXRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG9wdGlvbnMuc3Ryb2tlUG9zaXRpb24gPSBnb29nbGUubWFwcy5TdHJva2VQb3NpdGlvbltvcHRpb25zLnN0cm9rZVBvc2l0aW9uXTtcbiAgICAgIH1cbiAgICAgIGMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEJvdW5kcyhjaXJjbGU6IEFnbUNpcmNsZSk6IFByb21pc2U8bWFwVHlwZXMuTGF0TG5nQm91bmRzPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NpcmNsZXMuZ2V0KGNpcmNsZSkudGhlbigoYykgPT4gYy5nZXRCb3VuZHMoKSk7XG4gIH1cblxuICBnZXRDZW50ZXIoY2lyY2xlOiBBZ21DaXJjbGUpOiBQcm9taXNlPG1hcFR5cGVzLkxhdExuZz4ge1xuICAgIHJldHVybiB0aGlzLl9jaXJjbGVzLmdldChjaXJjbGUpLnRoZW4oKGMpID0+IGMuZ2V0Q2VudGVyKCkpO1xuICB9XG5cbiAgZ2V0UmFkaXVzKGNpcmNsZTogQWdtQ2lyY2xlKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fY2lyY2xlcy5nZXQoY2lyY2xlKS50aGVuKChjKSA9PiBjLmdldFJhZGl1cygpKTtcbiAgfVxuXG4gIHNldENlbnRlcihjaXJjbGU6IEFnbUNpcmNsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9jaXJjbGVzLmdldChjaXJjbGUpLnRoZW4oXG4gICAgICAgIChjKSA9PiB7IHJldHVybiBjLnNldENlbnRlcih7bGF0OiBjaXJjbGUubGF0aXR1ZGUsIGxuZzogY2lyY2xlLmxvbmdpdHVkZX0pOyB9KTtcbiAgfVxuXG4gIHNldEVkaXRhYmxlKGNpcmNsZTogQWdtQ2lyY2xlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NpcmNsZXMuZ2V0KGNpcmNsZSkudGhlbigoYykgPT4geyByZXR1cm4gYy5zZXRFZGl0YWJsZShjaXJjbGUuZWRpdGFibGUpOyB9KTtcbiAgfVxuXG4gIHNldERyYWdnYWJsZShjaXJjbGU6IEFnbUNpcmNsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9jaXJjbGVzLmdldChjaXJjbGUpLnRoZW4oKGMpID0+IHsgcmV0dXJuIGMuc2V0RHJhZ2dhYmxlKGNpcmNsZS5kcmFnZ2FibGUpOyB9KTtcbiAgfVxuXG4gIHNldFZpc2libGUoY2lyY2xlOiBBZ21DaXJjbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2lyY2xlcy5nZXQoY2lyY2xlKS50aGVuKChjKSA9PiB7IHJldHVybiBjLnNldFZpc2libGUoY2lyY2xlLnZpc2libGUpOyB9KTtcbiAgfVxuXG4gIHNldFJhZGl1cyhjaXJjbGU6IEFnbUNpcmNsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9jaXJjbGVzLmdldChjaXJjbGUpLnRoZW4oKGMpID0+IHsgcmV0dXJuIGMuc2V0UmFkaXVzKGNpcmNsZS5yYWRpdXMpOyB9KTtcbiAgfVxuXG4gIGdldE5hdGl2ZUNpcmNsZShjaXJjbGU6IEFnbUNpcmNsZSk6IFByb21pc2U8bWFwVHlwZXMuQ2lyY2xlPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NpcmNsZXMuZ2V0KGNpcmNsZSk7XG4gIH1cblxuICBjcmVhdGVFdmVudE9ic2VydmFibGU8VD4oZXZlbnROYW1lOiBzdHJpbmcsIGNpcmNsZTogQWdtQ2lyY2xlKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IHtcbiAgICAgIGxldCBsaXN0ZW5lcjogbWFwVHlwZXMuTWFwc0V2ZW50TGlzdGVuZXIgPSBudWxsO1xuICAgICAgdGhpcy5fY2lyY2xlcy5nZXQoY2lyY2xlKS50aGVuKChjKSA9PiB7XG4gICAgICAgIGxpc3RlbmVyID0gYy5hZGRMaXN0ZW5lcihldmVudE5hbWUsIChlOiBUKSA9PiB0aGlzLl96b25lLnJ1bigoKSA9PiBvYnNlcnZlci5uZXh0KGUpKSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGxpc3RlbmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==