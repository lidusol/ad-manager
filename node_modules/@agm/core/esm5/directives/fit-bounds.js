import * as tslib_1 from "tslib";
import { Directive, Input, Self } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FitBoundsAccessor, FitBoundsDetails, FitBoundsService } from '../services/fit-bounds';
/**
 * Adds the given directive to the auto fit bounds feature when the value is true.
 * To make it work with you custom AGM component, you also have to implement the {@link FitBoundsAccessor} abstract class.
 * @example
 * <agm-marker [agmFitBounds]="true"></agm-marker>
 */
import * as ɵngcc0 from '@angular/core';
var AgmFitBounds = /** @class */ (function () {
    function AgmFitBounds(_fitBoundsAccessor, _fitBoundsService) {
        this._fitBoundsAccessor = _fitBoundsAccessor;
        this._fitBoundsService = _fitBoundsService;
        /**
         * If the value is true, the element gets added to the bounds of the map.
         * Default: true.
         */
        this.agmFitBounds = true;
        this._destroyed$ = new Subject();
        this._latestFitBoundsDetails = null;
    }
    /**
     * @internal
     */
    AgmFitBounds.prototype.ngOnChanges = function () {
        this._updateBounds();
    };
    /**
     * @internal
     */
    AgmFitBounds.prototype.ngOnInit = function () {
        var _this = this;
        this._fitBoundsAccessor
            .getFitBoundsDetails$()
            .pipe(distinctUntilChanged(function (x, y) {
            return x.latLng.lat === y.latLng.lat && x.latLng.lng === y.latLng.lng;
        }), takeUntil(this._destroyed$))
            .subscribe(function (details) { return _this._updateBounds(details); });
    };
    /*
     Either the location changed, or visible status changed.
     Possible state changes are
     invisible -> visible
     visible -> invisible
     visible -> visible (new location)
    */
    AgmFitBounds.prototype._updateBounds = function (newFitBoundsDetails) {
        // either visibility will change, or location, so remove the old one anyway
        if (this._latestFitBoundsDetails) {
            this._fitBoundsService.removeFromBounds(this._latestFitBoundsDetails.latLng);
            // don't set latestFitBoundsDetails to null, because we can toggle visibility from
            // true -> false -> true, in which case we still need old value cached here
        }
        if (newFitBoundsDetails) {
            this._latestFitBoundsDetails = newFitBoundsDetails;
        }
        if (!this._latestFitBoundsDetails) {
            return;
        }
        if (this.agmFitBounds === true) {
            this._fitBoundsService.addToBounds(this._latestFitBoundsDetails.latLng);
        }
    };
    /**
     * @internal
     */
    AgmFitBounds.prototype.ngOnDestroy = function () {
        this._destroyed$.next();
        this._destroyed$.complete();
        if (this._latestFitBoundsDetails !== null) {
            this._fitBoundsService.removeFromBounds(this._latestFitBoundsDetails.latLng);
        }
    };
    AgmFitBounds.ctorParameters = function () { return [
        { type: FitBoundsAccessor, decorators: [{ type: Self }] },
        { type: FitBoundsService }
    ]; };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmFitBounds.prototype, "agmFitBounds", void 0);
    AgmFitBounds = tslib_1.__decorate([ tslib_1.__param(0, Self()),
        tslib_1.__metadata("design:paramtypes", [FitBoundsAccessor,
            FitBoundsService])
    ], AgmFitBounds);
AgmFitBounds.ɵfac = function AgmFitBounds_Factory(t) { return new (t || AgmFitBounds)(ɵngcc0.ɵɵdirectiveInject(FitBoundsAccessor, 2), ɵngcc0.ɵɵdirectiveInject(FitBoundsService)); };
AgmFitBounds.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: AgmFitBounds, selectors: [["", "agmFitBounds", ""]], inputs: { agmFitBounds: "agmFitBounds" }, features: [ɵngcc0.ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmFitBounds, [{
        type: Directive,
        args: [{
                selector: '[agmFitBounds]'
            }]
    }], function () { return [{ type: FitBoundsAccessor, decorators: [{
                type: Self
            }] }, { type: FitBoundsService }]; }, { agmFitBounds: [{
            type: Input
        }] }); })();
    return AgmFitBounds;
}());
export { AgmFitBounds };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml0LWJvdW5kcy5qcyIsInNvdXJjZXMiOlsibmc6L0BhZ20vY29yZS9kaXJlY3RpdmVzL2ZpdC1ib3VuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFnQyxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFakUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBSUg7QUFBZ0QsSUFVOUMsc0JBQzJCLGtCQUFxQyxFQUM3QyxpQkFBbUM7QUFDdEQsUUFGMkIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtBQUFDLFFBQzlDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7QUFBQyxRQVh2RDtBQUNGO0FBQ007QUFFQSxXQUREO0FBQ0wsUUFBVyxpQkFBWSxHQUFHLElBQUksQ0FBQztBQUMvQixRQUNVLGdCQUFXLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7QUFDM0QsUUFBVSw0QkFBdUIsR0FBNEIsSUFBSSxDQUFDO0FBQ2xFLElBSUssQ0FBQztBQUNOLElBQ0U7QUFDRjtBQUNFLE9BQUc7QUFDTCxJQUFFLGtDQUFXLEdBQVg7QUFBYyxRQUNaLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUN6QixJQUFFLENBQUM7QUFFSCxJQUFFO0FBQ0Y7QUFDRSxPQUFHO0FBQ0wsSUFBRSwrQkFBUSxHQUFSO0FBQ0QsUUFEQyxpQkFXQztBQUNILFFBWEksSUFBSSxDQUFDLGtCQUFrQjtBQUMzQixhQUFPLG9CQUFvQixFQUFFO0FBQzdCLGFBQU8sSUFBSSxDQUNILG9CQUFvQixDQUNsQixVQUFDLENBQW1CLEVBQUUsQ0FBbUI7QUFBSSxZQUMzQyxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRztBQUMxRSxRQURZLENBQThELENBQ2pFLEVBQ0QsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FDNUI7QUFDUCxhQUFPLFNBQVMsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQztBQUN6RCxJQUFFLENBQUM7QUFFSCxJQUFFO0FBQ0Y7QUFDRTtBQUNFO0FBQ0U7QUFDRTtBQUVILE1BREQ7QUFDSixJQUFVLG9DQUFhLEdBQXJCLFVBQXNCLG1CQUFzQztBQUM5RCxRQUFJLDJFQUEyRTtBQUMvRSxRQUFJLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO0FBQ3RDLFlBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRixZQUFNLGtGQUFrRjtBQUN4RixZQUFNLDJFQUEyRTtBQUNqRixTQUFLO0FBQ0wsUUFDSSxJQUFJLG1CQUFtQixFQUFFO0FBQzdCLFlBQU0sSUFBSSxDQUFDLHVCQUF1QixHQUFHLG1CQUFtQixDQUFDO0FBQ3pELFNBQUs7QUFDTCxRQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUU7QUFDdkMsWUFBTSxPQUFPO0FBQ2IsU0FBSztBQUNMLFFBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksRUFBRTtBQUNwQyxZQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlFLFNBQUs7QUFDTCxJQUFFLENBQUM7QUFFSCxJQUFFO0FBQ0Y7QUFDRSxPQUFHO0FBQ0wsSUFBRSxrQ0FBVyxHQUFYO0FBQWMsUUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVCLFFBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQyxRQUFJLElBQUksSUFBSSxDQUFDLHVCQUF1QixLQUFLLElBQUksRUFBRTtBQUMvQyxZQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkYsU0FBSztBQUNMLElBQUUsQ0FBQztBQUNGO0FBQ3VELGdCQWhFUCxpQkFBaUIsdUJBQTdELElBQUk7QUFBTyxnQkFDd0IsZ0JBQWdCO0FBQ3ZEO0FBRUUsSUFWUTtBQUNYLFFBREcsS0FBSyxFQUFFO0FBQUU7QUFFaUIsc0RBRkU7QUFFL0IsSUFQYSxZQUFZLGdDQUh4QixTQUFTLENBQUMsbkJBR0gsQ0FXSCxtQkFBQSxJQUFJLEVBQUUsQ0FBQTtJQWJULFFBQVEsRUFBRSxnQkFBZ0IsV0FDM0IsQ0FBQywxQ0FZVyxpREFBb0MsaUJBQWlCO0FBQ2xFLFlBQXdDLGdCQUFnQjtBQUN2RCxPQWJZLFlBQVksQ0EwRXhCOzs7Ozs7Ozs7Ozs7b0JBQ0Q7QUFBQyxJQURELG1CQUFDO0FBQ0EsQ0FEQSxBQTFFRCxJQTBFQztBQUNELFNBM0VhLFlBQVk7QUFBSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEZpdEJvdW5kc0FjY2Vzc29yLCBGaXRCb3VuZHNEZXRhaWxzLCBGaXRCb3VuZHNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZml0LWJvdW5kcyc7XG5cbi8qKlxuICogQWRkcyB0aGUgZ2l2ZW4gZGlyZWN0aXZlIHRvIHRoZSBhdXRvIGZpdCBib3VuZHMgZmVhdHVyZSB3aGVuIHRoZSB2YWx1ZSBpcyB0cnVlLlxuICogVG8gbWFrZSBpdCB3b3JrIHdpdGggeW91IGN1c3RvbSBBR00gY29tcG9uZW50LCB5b3UgYWxzbyBoYXZlIHRvIGltcGxlbWVudCB0aGUge0BsaW5rIEZpdEJvdW5kc0FjY2Vzc29yfSBhYnN0cmFjdCBjbGFzcy5cbiAqIEBleGFtcGxlXG4gKiA8YWdtLW1hcmtlciBbYWdtRml0Qm91bmRzXT1cInRydWVcIj48L2FnbS1tYXJrZXI+XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thZ21GaXRCb3VuZHNdJyxcbn0pXG5leHBvcnQgY2xhc3MgQWdtRml0Qm91bmRzIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBJZiB0aGUgdmFsdWUgaXMgdHJ1ZSwgdGhlIGVsZW1lbnQgZ2V0cyBhZGRlZCB0byB0aGUgYm91bmRzIG9mIHRoZSBtYXAuXG4gICAqIERlZmF1bHQ6IHRydWUuXG4gICAqL1xuICBASW5wdXQoKSBhZ21GaXRCb3VuZHMgPSB0cnVlO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9sYXRlc3RGaXRCb3VuZHNEZXRhaWxzOiBGaXRCb3VuZHNEZXRhaWxzIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQFNlbGYoKSBwcml2YXRlIHJlYWRvbmx5IF9maXRCb3VuZHNBY2Nlc3NvcjogRml0Qm91bmRzQWNjZXNzb3IsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZml0Qm91bmRzU2VydmljZTogRml0Qm91bmRzU2VydmljZSxcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3VwZGF0ZUJvdW5kcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZml0Qm91bmRzQWNjZXNzb3JcbiAgICAgIC5nZXRGaXRCb3VuZHNEZXRhaWxzJCgpXG4gICAgICAucGlwZShcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoXG4gICAgICAgICAgKHg6IEZpdEJvdW5kc0RldGFpbHMsIHk6IEZpdEJvdW5kc0RldGFpbHMpID0+XG4gICAgICAgICAgICB4LmxhdExuZy5sYXQgPT09IHkubGF0TG5nLmxhdCAmJiB4LmxhdExuZy5sbmcgPT09IHkubGF0TG5nLmxuZyxcbiAgICAgICAgKSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCQpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShkZXRhaWxzID0+IHRoaXMuX3VwZGF0ZUJvdW5kcyhkZXRhaWxzKSk7XG4gIH1cblxuICAvKlxuICAgRWl0aGVyIHRoZSBsb2NhdGlvbiBjaGFuZ2VkLCBvciB2aXNpYmxlIHN0YXR1cyBjaGFuZ2VkLlxuICAgUG9zc2libGUgc3RhdGUgY2hhbmdlcyBhcmVcbiAgIGludmlzaWJsZSAtPiB2aXNpYmxlXG4gICB2aXNpYmxlIC0+IGludmlzaWJsZVxuICAgdmlzaWJsZSAtPiB2aXNpYmxlIChuZXcgbG9jYXRpb24pXG4gICovXG4gIHByaXZhdGUgX3VwZGF0ZUJvdW5kcyhuZXdGaXRCb3VuZHNEZXRhaWxzPzogRml0Qm91bmRzRGV0YWlscykge1xuICAgIC8vIGVpdGhlciB2aXNpYmlsaXR5IHdpbGwgY2hhbmdlLCBvciBsb2NhdGlvbiwgc28gcmVtb3ZlIHRoZSBvbGQgb25lIGFueXdheVxuICAgIGlmICh0aGlzLl9sYXRlc3RGaXRCb3VuZHNEZXRhaWxzKSB7XG4gICAgICB0aGlzLl9maXRCb3VuZHNTZXJ2aWNlLnJlbW92ZUZyb21Cb3VuZHModGhpcy5fbGF0ZXN0Rml0Qm91bmRzRGV0YWlscy5sYXRMbmcpO1xuICAgICAgLy8gZG9uJ3Qgc2V0IGxhdGVzdEZpdEJvdW5kc0RldGFpbHMgdG8gbnVsbCwgYmVjYXVzZSB3ZSBjYW4gdG9nZ2xlIHZpc2liaWxpdHkgZnJvbVxuICAgICAgLy8gdHJ1ZSAtPiBmYWxzZSAtPiB0cnVlLCBpbiB3aGljaCBjYXNlIHdlIHN0aWxsIG5lZWQgb2xkIHZhbHVlIGNhY2hlZCBoZXJlXG4gICAgfVxuXG4gICAgaWYgKG5ld0ZpdEJvdW5kc0RldGFpbHMpIHtcbiAgICAgIHRoaXMuX2xhdGVzdEZpdEJvdW5kc0RldGFpbHMgPSBuZXdGaXRCb3VuZHNEZXRhaWxzO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2xhdGVzdEZpdEJvdW5kc0RldGFpbHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuYWdtRml0Qm91bmRzID09PSB0cnVlKSB7XG4gICAgICB0aGlzLl9maXRCb3VuZHNTZXJ2aWNlLmFkZFRvQm91bmRzKHRoaXMuX2xhdGVzdEZpdEJvdW5kc0RldGFpbHMubGF0TG5nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQkLmNvbXBsZXRlKCk7XG4gICAgaWYgKHRoaXMuX2xhdGVzdEZpdEJvdW5kc0RldGFpbHMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2ZpdEJvdW5kc1NlcnZpY2UucmVtb3ZlRnJvbUJvdW5kcyh0aGlzLl9sYXRlc3RGaXRCb3VuZHNEZXRhaWxzLmxhdExuZyk7XG4gICAgfVxuICB9XG59XG4iXX0=