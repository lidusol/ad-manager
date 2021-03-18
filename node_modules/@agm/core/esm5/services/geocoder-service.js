import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { bindCallback, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { map, multicast, switchMap } from 'rxjs/operators';
import { GeocoderStatus } from './google-maps-types';
import { MapsAPILoader } from './maps-api-loader/maps-api-loader';
import * as i0 from "@angular/core";
import * as i1 from "./maps-api-loader/maps-api-loader";
import * as ɵngcc0 from '@angular/core';
var AgmGeocoder = /** @class */ (function () {
    function AgmGeocoder(loader) {
        var _this = this;
        var connectableGeocoder$ = new Observable(function (subscriber) {
            loader.load().then(function () { return subscriber.next(); });
        })
            .pipe(map(function () { return _this._createGeocoder(); }), multicast(new ReplaySubject(1)));
        connectableGeocoder$.connect(); // ignore the subscription
        // since we will remain subscribed till application exits
        this.geocoder$ = connectableGeocoder$;
    }
    AgmGeocoder.prototype.geocode = function (request) {
        var _this = this;
        return this.geocoder$.pipe(switchMap(function (geocoder) { return _this._getGoogleResults(geocoder, request); }));
    };
    AgmGeocoder.prototype._getGoogleResults = function (geocoder, request) {
        var geocodeObservable = bindCallback(geocoder.geocode);
        return geocodeObservable(request).pipe(switchMap(function (_a) {
            var _b = tslib_1.__read(_a, 2), results = _b[0], status = _b[1];
            if (status === GeocoderStatus.OK) {
                return of(results);
            }
            return throwError(status);
        }));
    };
    AgmGeocoder.prototype._createGeocoder = function () {
        return new google.maps.Geocoder();
    };
    AgmGeocoder.ctorParameters = function () { return [
        { type: MapsAPILoader }
    ]; };
    AgmGeocoder.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function AgmGeocoder_Factory() { return new AgmGeocoder(i0.ɵɵinject(i1.MapsAPILoader)); }, token: AgmGeocoder, providedIn: "root" });
    AgmGeocoder = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [MapsAPILoader])
    ], AgmGeocoder);
AgmGeocoder.ɵfac = function AgmGeocoder_Factory(t) { return new (t || AgmGeocoder)(ɵngcc0.ɵɵinject(MapsAPILoader)); };
AgmGeocoder.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: AgmGeocoder, factory: function (t) { return AgmGeocoder.ɵfac(t); }, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmGeocoder, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: MapsAPILoader }]; }, null); })();
    return AgmGeocoder;
}());
export { AgmGeocoder };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvY29kZXItc2VydmljZS5qcyIsInNvdXJjZXMiOlsibmc6L0BhZ20vY29yZS9zZXJ2aWNlcy9nZW9jb2Rlci1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQXlCLFVBQVUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0RyxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQTZDLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRTtBQUdVOztBQUNWO0FBQ29CLElBRWxCLHFCQUFZLE1BQXFCO0FBQ25DLFFBREUsaUJBYUM7QUFDSCxRQWJJLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBQSxVQUFVO0FBQUksWUFDeEQsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7QUFDbEQsUUFBSSxDQUFDLENBQUM7QUFDTixhQUFPLElBQUksQ0FDSCxHQUFHLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxlQUFlLEVBQUUsRUFBdEIsQ0FBc0IsQ0FBQyxFQUNqQyxTQUFTLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDRyxDQUFDO0FBQzNDLFFBQ0ksb0JBQW9CLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQywwQkFBMEI7QUFDOUQsUUFBSSx5REFBeUQ7QUFDN0QsUUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQzFDLElBQUUsQ0FBQztBQUNILElBQ0UsNkJBQU8sR0FBUCxVQUFRLE9BQXdCO0FBQUksUUFBcEMsaUJBSUM7QUFDSCxRQUpJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ3hCLFNBQVMsQ0FBQyxVQUFDLFFBQVEsSUFBSyxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQXpDLENBQXlDLENBQUMsQ0FDbkUsQ0FBQztBQUNOLElBQUUsQ0FBQztBQUVILElBQVUsdUNBQWlCLEdBQXpCLFVBQTBCLFFBQWtCLEVBQUUsT0FBd0I7QUFBSSxRQUN4RSxJQUFNLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0QsUUFBSSxPQUFPLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDcEMsU0FBUyxDQUFDLFVBQUMsRUFBaUI7QUFBSSxnQkFBckIsMEJBQWlCLEVBQWhCLGVBQU8sRUFBRSxjQUFNO0FBQUUsWUFDM0IsSUFBSSxNQUFNLEtBQUssY0FBYyxDQUFDLEVBQUUsRUFBRTtBQUMxQyxnQkFBVSxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixhQUFTO0FBQ1QsWUFDUSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxRQUFNLENBQUMsQ0FBQyxDQUNILENBQUM7QUFDTixJQUFFLENBQUM7QUFFSCxJQUFVLHFDQUFlLEdBQXZCO0FBQWMsUUFDWixPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQWMsQ0FBQztBQUNsRCxJQUFFLENBQUM7QUFDRjtBQUNzRCxnQkF0Q2pDLGFBQWE7QUFBRztBQUM3QjtBQUt1QixJQVRuQixXQUFXLGdDQUR2QixVQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsM0NBQzNCLDBDQUdjLGFBQWE7QUFBRyxPQUh6QixXQUFXLENBd0N2Qjs7Ozs7O3VFQUNEO0FBQUMsc0JBbEREO0FBQUUsQ0FpREQsQUF4Q0QsSUF3Q0M7QUFDRCxTQXpDYSxXQUFXO0FBQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgYmluZENhbGxiYWNrLCBDb25uZWN0YWJsZU9ic2VydmFibGUsIE9ic2VydmFibGUsIG9mLCBSZXBsYXlTdWJqZWN0LCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIG11bHRpY2FzdCwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgR2VvY29kZXIsIEdlb2NvZGVyUmVxdWVzdCwgR2VvY29kZXJSZXN1bHQsIEdlb2NvZGVyU3RhdHVzIH0gZnJvbSAnLi9nb29nbGUtbWFwcy10eXBlcyc7XG5pbXBvcnQgeyBNYXBzQVBJTG9hZGVyIH0gZnJvbSAnLi9tYXBzLWFwaS1sb2FkZXIvbWFwcy1hcGktbG9hZGVyJztcblxuZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgQWdtR2VvY29kZXIge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ2VvY29kZXIkOiBPYnNlcnZhYmxlPEdlb2NvZGVyPjtcblxuICBjb25zdHJ1Y3Rvcihsb2FkZXI6IE1hcHNBUElMb2FkZXIpIHtcbiAgICBjb25zdCBjb25uZWN0YWJsZUdlb2NvZGVyJCA9IG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgICAgbG9hZGVyLmxvYWQoKS50aGVuKCgpID0+IHN1YnNjcmliZXIubmV4dCgpKTtcbiAgICB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgoKSA9PiB0aGlzLl9jcmVhdGVHZW9jb2RlcigpKSxcbiAgICAgICAgbXVsdGljYXN0KG5ldyBSZXBsYXlTdWJqZWN0KDEpKSxcbiAgICAgICkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPEdlb2NvZGVyPjtcblxuICAgIGNvbm5lY3RhYmxlR2VvY29kZXIkLmNvbm5lY3QoKTsgLy8gaWdub3JlIHRoZSBzdWJzY3JpcHRpb25cbiAgICAvLyBzaW5jZSB3ZSB3aWxsIHJlbWFpbiBzdWJzY3JpYmVkIHRpbGwgYXBwbGljYXRpb24gZXhpdHNcblxuICAgIHRoaXMuZ2VvY29kZXIkID0gY29ubmVjdGFibGVHZW9jb2RlciQ7XG4gIH1cblxuICBnZW9jb2RlKHJlcXVlc3Q6IEdlb2NvZGVyUmVxdWVzdCk6IE9ic2VydmFibGU8R2VvY29kZXJSZXN1bHRbXT4ge1xuICAgIHJldHVybiB0aGlzLmdlb2NvZGVyJC5waXBlKFxuICAgICAgc3dpdGNoTWFwKChnZW9jb2RlcikgPT4gdGhpcy5fZ2V0R29vZ2xlUmVzdWx0cyhnZW9jb2RlciwgcmVxdWVzdCkpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEdvb2dsZVJlc3VsdHMoZ2VvY29kZXI6IEdlb2NvZGVyLCByZXF1ZXN0OiBHZW9jb2RlclJlcXVlc3QpOiBPYnNlcnZhYmxlPEdlb2NvZGVyUmVzdWx0W10+IHtcbiAgICBjb25zdCBnZW9jb2RlT2JzZXJ2YWJsZSA9IGJpbmRDYWxsYmFjayhnZW9jb2Rlci5nZW9jb2RlKTtcbiAgICByZXR1cm4gZ2VvY29kZU9ic2VydmFibGUocmVxdWVzdCkucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoW3Jlc3VsdHMsIHN0YXR1c10pID0+IHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gR2VvY29kZXJTdGF0dXMuT0spIHtcbiAgICAgICAgICByZXR1cm4gb2YocmVzdWx0cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihzdGF0dXMpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlR2VvY29kZXIoKTogR2VvY29kZXIge1xuICAgIHJldHVybiBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKSBhcyBHZW9jb2RlcjtcbiAgfVxufVxuIl19