import * as tslib_1 from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { map, skip, startWith, switchMap } from 'rxjs/operators';
import { createMVCEventObservable } from '../../utils/mvcarray-utils';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import * as ɵngcc0 from '@angular/core';
var PolygonManager = /** @class */ (function () {
    function PolygonManager(_mapsWrapper, _zone) {
        this._mapsWrapper = _mapsWrapper;
        this._zone = _zone;
        this._polygons = new Map();
    }
    PolygonManager.prototype.addPolygon = function (path) {
        var polygonPromise = this._mapsWrapper.createPolygon({
            clickable: path.clickable,
            draggable: path.draggable,
            editable: path.editable,
            fillColor: path.fillColor,
            fillOpacity: path.fillOpacity,
            geodesic: path.geodesic,
            paths: path.paths,
            strokeColor: path.strokeColor,
            strokeOpacity: path.strokeOpacity,
            strokeWeight: path.strokeWeight,
            visible: path.visible,
            zIndex: path.zIndex,
        });
        this._polygons.set(path, polygonPromise);
    };
    PolygonManager.prototype.updatePolygon = function (polygon) {
        var _this = this;
        var m = this._polygons.get(polygon);
        if (m == null) {
            return Promise.resolve();
        }
        return m.then(function (l) { return _this._zone.run(function () { l.setPaths(polygon.paths); }); });
    };
    PolygonManager.prototype.setPolygonOptions = function (path, options) {
        return this._polygons.get(path).then(function (l) { l.setOptions(options); });
    };
    PolygonManager.prototype.deletePolygon = function (paths) {
        var _this = this;
        var m = this._polygons.get(paths);
        if (m == null) {
            return Promise.resolve();
        }
        return m.then(function (l) {
            return _this._zone.run(function () {
                l.setMap(null);
                _this._polygons.delete(paths);
            });
        });
    };
    PolygonManager.prototype.getPath = function (polygon) {
        return this._polygons.get(polygon)
            .then(function (polygon) { return polygon.getPath().getArray(); });
    };
    PolygonManager.prototype.getPaths = function (polygon) {
        return this._polygons.get(polygon)
            .then(function (polygon) { return polygon.getPaths().getArray().map(function (p) { return p.getArray(); }); });
    };
    PolygonManager.prototype.createEventObservable = function (eventName, path) {
        var _this = this;
        return new Observable(function (observer) {
            _this._polygons.get(path).then(function (l) {
                l.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
            });
        });
    };
    PolygonManager.prototype.createPathEventObservable = function (agmPolygon) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var polygon, paths, pathsChanges$;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._polygons.get(agmPolygon)];
                    case 1:
                        polygon = _a.sent();
                        paths = polygon.getPaths();
                        pathsChanges$ = createMVCEventObservable(paths);
                        return [2 /*return*/, pathsChanges$.pipe(startWith({ newArr: paths.getArray() }), // in order to subscribe to them all
                            switchMap(function (parentMVEvent) { return merge.apply(void 0, tslib_1.__spread(// rest parameter
                            parentMVEvent.newArr.map(function (chMVC, index) {
                                return createMVCEventObservable(chMVC)
                                    .pipe(map(function (chMVCEvent) { return ({ parentMVEvent: parentMVEvent, chMVCEvent: chMVCEvent, pathIndex: index }); }));
                            }))).pipe(startWith({ parentMVEvent: parentMVEvent, chMVCEvent: null, pathIndex: null })); }), // start the merged ob with an event signinifing change to parent
                            skip(1), // skip the manually added event
                            map(function (_a) {
                                var parentMVEvent = _a.parentMVEvent, chMVCEvent = _a.chMVCEvent, pathIndex = _a.pathIndex;
                                var retVal;
                                if (!chMVCEvent) {
                                    retVal = {
                                        newArr: parentMVEvent.newArr.map(function (subArr) { return subArr.getArray().map(function (latLng) { return latLng.toJSON(); }); }),
                                        eventName: parentMVEvent.evName,
                                        index: parentMVEvent.index,
                                    };
                                    if (parentMVEvent.previous) {
                                        retVal.previous = parentMVEvent.previous.getArray();
                                    }
                                }
                                else {
                                    retVal = {
                                        newArr: parentMVEvent.newArr.map(function (subArr) { return subArr.getArray().map(function (latLng) { return latLng.toJSON(); }); }),
                                        pathIndex: pathIndex,
                                        eventName: chMVCEvent.evName,
                                        index: chMVCEvent.index,
                                    };
                                    if (chMVCEvent.previous) {
                                        retVal.previous = chMVCEvent.previous;
                                    }
                                }
                                return retVal;
                            }))];
                }
            });
        });
    };
    PolygonManager.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper },
        { type: NgZone }
    ]; };
    PolygonManager = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [GoogleMapsAPIWrapper, NgZone])
    ], PolygonManager);
PolygonManager.ɵfac = function PolygonManager_Factory(t) { return new (t || PolygonManager)(ɵngcc0.ɵɵinject(GoogleMapsAPIWrapper), ɵngcc0.ɵɵinject(ɵngcc0.NgZone)); };
PolygonManager.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: PolygonManager, factory: function (t) { return PolygonManager.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(PolygonManager, [{
        type: Injectable
    }], function () { return [{ type: GoogleMapsAPIWrapper }, { type: ɵngcc0.NgZone }]; }, null); })();
    return PolygonManager;
}());
export { PolygonManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi1tYW5hZ2VyLmpzIiwic291cmNlcyI6WyJuZzovQGFnbS9jb3JlL3NlcnZpY2VzL21hbmFnZXJzL3BvbHlnb24tbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQVksTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR2pFLE9BQU8sRUFBRSx3QkFBd0IsRUFBWSxNQUFNLDRCQUE0QixDQUFDO0FBQ2hGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQUlsRTtBQUNvQixJQUdsQix3QkFBb0IsWUFBa0MsRUFBVSxLQUFhO0FBQUksUUFBN0QsaUJBQVksR0FBWixZQUFZLENBQXNCO0FBQUMsUUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO0FBQUMsUUFIdEUsY0FBUyxHQUNmLElBQUksR0FBRyxFQUFnQyxDQUFDO0FBQzVDLElBQ21GLENBQUM7QUFDcEYsSUFDRSxtQ0FBVSxHQUFWLFVBQVcsSUFBZ0I7QUFDN0IsUUFBSSxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztBQUMzRCxZQUFNLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUMvQixZQUFNLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUMvQixZQUFNLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtBQUM3QixZQUFNLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUMvQixZQUFNLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztBQUNuQyxZQUFNLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtBQUM3QixZQUFNLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztB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UUFBUSxFQUFFLENBQUM7QUFDakUscUNBQVc7QUFDWCxpQ0FBUztBQUFDLHFDQUFLO0FBQ2Ysb0NBQVUsTUFBTSxHQUFHO0FBQ25CLHdDQUFZLE1BQU0sRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQWYsQ0FBZSxDQUFDLEVBQWhELENBQWdELENBQUM7QUFDeEcsd0NBQVksU0FBUyxXQUFBO0FBQ3JCLHdDQUFZLFNBQVMsRUFBRSxVQUFVLENBQUMsTUFBTTtBQUN4Qyx3Q0FBWSxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7QUFDbkMscUNBQXlDLENBQUM7QUFDMUMsb0NBQVUsSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFO0FBQ25DLHdDQUFZLE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztBQUNsRCxxQ0FBVztBQUNYLGlDQUFTO0FBQ1QsZ0NBQVEsT0FBTyxNQUFNLENBQUM7QUFDdEIsNEJBQU0sQ0FBQyxDQUFDLENBQUMsRUFBQztBQUNWO0FBRVk7QUFBZ0I7QUFBWSxLQUZyQztBQUNGO0FBQ3lELGdCQXBHdEIsb0JBQW9CO0FBQUksZ0JBQWEsTUFBTTtBQUFHO0FBRTVFLElBTk8sY0FBYyxnQ0FEMUIsVUFBVSxFQUFFLHJCQUNMLDBDQUk0QixvQkFBb0IsRUFBaUIsTUFBTTtBQUFHLE9BSnJFLGNBQWMsQ0F1RzFCOzs7Ozt1R0FDRDtBQUFDLElBREQscUJBQUM7QUFDQSxDQURBLEFBdkdELElBdUdDO0FBQ0QsU0F4R2EsY0FBYztBQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgbWVyZ2UsIE9ic2VydmFibGUsIE9ic2VydmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIHNraXAsIHN0YXJ0V2l0aCwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBBZ21Qb2x5Z29uLCBQYXRoQ2hhbmdlUG9seWdvblBhdGhFdmVudCwgUGF0aENvbGxlY3Rpb25DaGFuZ2VQb2x5Z29uUGF0aEV2ZW50LCBQb2x5Z29uUGF0aEV2ZW50IH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9wb2x5Z29uJztcbmltcG9ydCB7IGNyZWF0ZU1WQ0V2ZW50T2JzZXJ2YWJsZSwgTVZDRXZlbnQgfSBmcm9tICcuLi8uLi91dGlscy9tdmNhcnJheS11dGlscyc7XG5pbXBvcnQgeyBHb29nbGVNYXBzQVBJV3JhcHBlciB9IGZyb20gJy4uL2dvb2dsZS1tYXBzLWFwaS13cmFwcGVyJztcbmltcG9ydCB7IExhdExuZywgTVZDQXJyYXksIFBvbHlnb24gfSBmcm9tICcuLi9nb29nbGUtbWFwcy10eXBlcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5Z29uTWFuYWdlciB7XG4gIHByaXZhdGUgX3BvbHlnb25zOiBNYXA8QWdtUG9seWdvbiwgUHJvbWlzZTxQb2x5Z29uPj4gPVxuICAgIG5ldyBNYXA8QWdtUG9seWdvbiwgUHJvbWlzZTxQb2x5Z29uPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tYXBzV3JhcHBlcjogR29vZ2xlTWFwc0FQSVdyYXBwZXIsIHByaXZhdGUgX3pvbmU6IE5nWm9uZSkgeyB9XG5cbiAgYWRkUG9seWdvbihwYXRoOiBBZ21Qb2x5Z29uKSB7XG4gICAgY29uc3QgcG9seWdvblByb21pc2UgPSB0aGlzLl9tYXBzV3JhcHBlci5jcmVhdGVQb2x5Z29uKHtcbiAgICAgIGNsaWNrYWJsZTogcGF0aC5jbGlja2FibGUsXG4gICAgICBkcmFnZ2FibGU6IHBhdGguZHJhZ2dhYmxlLFxuICAgICAgZWRpdGFibGU6IHBhdGguZWRpdGFibGUsXG4gICAgICBmaWxsQ29sb3I6IHBhdGguZmlsbENvbG9yLFxuICAgICAgZmlsbE9wYWNpdHk6IHBhdGguZmlsbE9wYWNpdHksXG4gICAgICBnZW9kZXNpYzogcGF0aC5nZW9kZXNpYyxcbiAgICAgIHBhdGhzOiBwYXRoLnBhdGhzLFxuICAgICAgc3Ryb2tlQ29sb3I6IHBhdGguc3Ryb2tlQ29sb3IsXG4gICAgICBzdHJva2VPcGFjaXR5OiBwYXRoLnN0cm9rZU9wYWNpdHksXG4gICAgICBzdHJva2VXZWlnaHQ6IHBhdGguc3Ryb2tlV2VpZ2h0LFxuICAgICAgdmlzaWJsZTogcGF0aC52aXNpYmxlLFxuICAgICAgekluZGV4OiBwYXRoLnpJbmRleCxcbiAgICB9KTtcbiAgICB0aGlzLl9wb2x5Z29ucy5zZXQocGF0aCwgcG9seWdvblByb21pc2UpO1xuICB9XG5cbiAgdXBkYXRlUG9seWdvbihwb2x5Z29uOiBBZ21Qb2x5Z29uKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbSA9IHRoaXMuX3BvbHlnb25zLmdldChwb2x5Z29uKTtcbiAgICBpZiAobSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBtLnRoZW4oKGw6IFBvbHlnb24pID0+IHRoaXMuX3pvbmUucnVuKCgpID0+IHsgbC5zZXRQYXRocyhwb2x5Z29uLnBhdGhzKTsgfSkpO1xuICB9XG5cbiAgc2V0UG9seWdvbk9wdGlvbnMocGF0aDogQWdtUG9seWdvbiwgb3B0aW9uczogeyBbcHJvcE5hbWU6IHN0cmluZ106IGFueSB9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlnb25zLmdldChwYXRoKS50aGVuKChsOiBQb2x5Z29uKSA9PiB7IGwuc2V0T3B0aW9ucyhvcHRpb25zKTsgfSk7XG4gIH1cblxuICBkZWxldGVQb2x5Z29uKHBhdGhzOiBBZ21Qb2x5Z29uKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbSA9IHRoaXMuX3BvbHlnb25zLmdldChwYXRocyk7XG4gICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gbS50aGVuKChsOiBQb2x5Z29uKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBsLnNldE1hcChudWxsKTtcbiAgICAgICAgdGhpcy5fcG9seWdvbnMuZGVsZXRlKHBhdGhzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGF0aChwb2x5Z29uOiBBZ21Qb2x5Z29uKTogUHJvbWlzZTxBcnJheTxMYXRMbmc+PiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlnb25zLmdldChwb2x5Z29uKVxuICAgICAgLnRoZW4oKHBvbHlnb24pID0+IHBvbHlnb24uZ2V0UGF0aCgpLmdldEFycmF5KCkpO1xuICB9XG5cbiAgZ2V0UGF0aHMocG9seWdvbjogQWdtUG9seWdvbik6IFByb21pc2U8QXJyYXk8QXJyYXk8TGF0TG5nPj4+IHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWdvbnMuZ2V0KHBvbHlnb24pXG4gICAgICAudGhlbigocG9seWdvbikgPT4gcG9seWdvbi5nZXRQYXRocygpLmdldEFycmF5KCkubWFwKChwKSA9PiBwLmdldEFycmF5KCkpKTtcbiAgfVxuXG4gIGNyZWF0ZUV2ZW50T2JzZXJ2YWJsZTxUPihldmVudE5hbWU6IHN0cmluZywgcGF0aDogQWdtUG9seWdvbik6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IE9ic2VydmVyPFQ+KSA9PiB7XG4gICAgICB0aGlzLl9wb2x5Z29ucy5nZXQocGF0aCkudGhlbigobDogUG9seWdvbikgPT4ge1xuICAgICAgICBsLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgKGU6IFQpID0+IHRoaXMuX3pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQoZSkpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlUGF0aEV2ZW50T2JzZXJ2YWJsZShhZ21Qb2x5Z29uOiBBZ21Qb2x5Z29uKTogUHJvbWlzZTxPYnNlcnZhYmxlPFBvbHlnb25QYXRoRXZlbnQ8YW55Pj4+IHtcbiAgICBjb25zdCBwb2x5Z29uID0gYXdhaXQgdGhpcy5fcG9seWdvbnMuZ2V0KGFnbVBvbHlnb24pO1xuICAgIGNvbnN0IHBhdGhzID0gcG9seWdvbi5nZXRQYXRocygpO1xuICAgIGNvbnN0IHBhdGhzQ2hhbmdlcyQgPSBjcmVhdGVNVkNFdmVudE9ic2VydmFibGUocGF0aHMpO1xuICAgIHJldHVybiBwYXRoc0NoYW5nZXMkLnBpcGUoc3RhcnRXaXRoKCh7IG5ld0FycjogcGF0aHMuZ2V0QXJyYXkoKSB9IGFzIE1WQ0V2ZW50PE1WQ0FycmF5PExhdExuZz4+KSksIC8vIGluIG9yZGVyIHRvIHN1YnNjcmliZSB0byB0aGVtIGFsbFxuICAgICAgc3dpdGNoTWFwKHBhcmVudE1WRXZlbnQgPT4gbWVyZ2UoLi4uLy8gcmVzdCBwYXJhbWV0ZXJcbiAgICAgICAgcGFyZW50TVZFdmVudC5uZXdBcnIubWFwKChjaE1WQywgaW5kZXgpID0+XG4gICAgICAgICAgY3JlYXRlTVZDRXZlbnRPYnNlcnZhYmxlKGNoTVZDKVxuICAgICAgICAgIC5waXBlKG1hcChjaE1WQ0V2ZW50ID0+ICh7IHBhcmVudE1WRXZlbnQsIGNoTVZDRXZlbnQsIHBhdGhJbmRleDogaW5kZXggfSkpKSkpXG4gICAgICAgIC5waXBlKHN0YXJ0V2l0aCh7IHBhcmVudE1WRXZlbnQsIGNoTVZDRXZlbnQ6IG51bGwsIHBhdGhJbmRleDogbnVsbCB9KSkpLCAvLyBzdGFydCB0aGUgbWVyZ2VkIG9iIHdpdGggYW4gZXZlbnQgc2lnbmluaWZpbmcgY2hhbmdlIHRvIHBhcmVudFxuICAgICAgc2tpcCgxKSwgLy8gc2tpcCB0aGUgbWFudWFsbHkgYWRkZWQgZXZlbnRcbiAgICAgIG1hcCgoeyBwYXJlbnRNVkV2ZW50LCBjaE1WQ0V2ZW50LCBwYXRoSW5kZXggfSkgPT4ge1xuICAgICAgICBsZXQgcmV0VmFsO1xuICAgICAgICBpZiAoIWNoTVZDRXZlbnQpIHtcbiAgICAgICAgICByZXRWYWwgPSB7XG4gICAgICAgICAgICBuZXdBcnI6IHBhcmVudE1WRXZlbnQubmV3QXJyLm1hcChzdWJBcnIgPT4gc3ViQXJyLmdldEFycmF5KCkubWFwKGxhdExuZyA9PiBsYXRMbmcudG9KU09OKCkpKSxcbiAgICAgICAgICAgIGV2ZW50TmFtZTogcGFyZW50TVZFdmVudC5ldk5hbWUsXG4gICAgICAgICAgICBpbmRleDogcGFyZW50TVZFdmVudC5pbmRleCxcbiAgICAgICAgICB9IGFzIFBhdGhDb2xsZWN0aW9uQ2hhbmdlUG9seWdvblBhdGhFdmVudDtcbiAgICAgICAgICBpZiAocGFyZW50TVZFdmVudC5wcmV2aW91cykge1xuICAgICAgICAgICAgcmV0VmFsLnByZXZpb3VzID0gIHBhcmVudE1WRXZlbnQucHJldmlvdXMuZ2V0QXJyYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0VmFsID0ge1xuICAgICAgICAgICAgbmV3QXJyOiBwYXJlbnRNVkV2ZW50Lm5ld0Fyci5tYXAoc3ViQXJyID0+IHN1YkFyci5nZXRBcnJheSgpLm1hcChsYXRMbmcgPT4gbGF0TG5nLnRvSlNPTigpKSksXG4gICAgICAgICAgICBwYXRoSW5kZXgsXG4gICAgICAgICAgICBldmVudE5hbWU6IGNoTVZDRXZlbnQuZXZOYW1lLFxuICAgICAgICAgICAgaW5kZXg6IGNoTVZDRXZlbnQuaW5kZXgsXG4gICAgICAgICAgfSBhcyBQYXRoQ2hhbmdlUG9seWdvblBhdGhFdmVudDtcbiAgICAgICAgICBpZiAoY2hNVkNFdmVudC5wcmV2aW91cykge1xuICAgICAgICAgICAgcmV0VmFsLnByZXZpb3VzID0gY2hNVkNFdmVudC5wcmV2aW91cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFZhbDtcbiAgICAgIH0pKTtcbiAgfVxufVxuIl19