import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
/**
 * This class manages Transit and Bicycling Layers for a Google Map instance.
 */
import * as ɵngcc0 from '@angular/core';
var LayerManager = /** @class */ (function () {
    function LayerManager(_wrapper) {
        this._wrapper = _wrapper;
        this._layers = new Map();
    }
    /**
     * Adds a transit layer to a map instance.
     * @param {AgmTransitLayer} layer - a TransitLayer object
     * @param {TransitLayerOptions} options - TransitLayerOptions options
     * @returns void
     */
    LayerManager.prototype.addTransitLayer = function (layer, options) {
        var newLayer = this._wrapper.createTransitLayer(options);
        this._layers.set(layer, newLayer);
    };
    /**
     * Adds a bicycling layer to a map instance.
     * @param {AgmBicyclingLayer} layer - a bicycling layer object
     * @param {BicyclingLayerOptions} options - BicyclingLayer options
     * @returns void
     */
    LayerManager.prototype.addBicyclingLayer = function (layer, options) {
        var newLayer = this._wrapper.createBicyclingLayer(options);
        this._layers.set(layer, newLayer);
    };
    /**
     * Deletes a map layer
     * @param {AgmTransitLayer|AgmBicyclingLayer} layer - the layer to delete
     * @returns  Promise<void>
     */
    LayerManager.prototype.deleteLayer = function (layer) {
        var _this = this;
        return this._layers.get(layer).then(function (currentLayer) {
            currentLayer.setMap(null);
            _this._layers.delete(layer);
        });
    };
    /**
     * Hide/Show a google map layer
     * @param { AgmTransitLayer|AgmBicyclingLayer} layer - the layer to hide/show
     * @param {TransitLayerOptions|BicyclingLayerOptions} options - used to set visibility of the layer
     * @returns Promise<void>
     */
    LayerManager.prototype.toggleLayerVisibility = function (layer, options) {
        var _this = this;
        return this._layers.get(layer).then(function (currentLayer) {
            if (!options.visible) {
                currentLayer.setMap(null);
                return;
            }
            else {
                return _this._wrapper.getNativeMap().then(function (map) {
                    currentLayer.setMap(map);
                });
            }
        });
    };
    LayerManager.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper }
    ]; };
    LayerManager = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [GoogleMapsAPIWrapper])
    ], LayerManager);
LayerManager.ɵfac = function LayerManager_Factory(t) { return new (t || LayerManager)(ɵngcc0.ɵɵinject(GoogleMapsAPIWrapper)); };
LayerManager.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: LayerManager, factory: function (t) { return LayerManager.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(LayerManager, [{
        type: Injectable
    }], function () { return [{ type: GoogleMapsAPIWrapper }]; }, null); })();
    return LayerManager;
}());
export { LayerManager };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItbWFuYWdlci5qcyIsInNvdXJjZXMiOlsibmc6L0BhZ20vY29yZS9zZXJ2aWNlcy9tYW5hZ2Vycy9sYXllci1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBR2xFO0FBQ0E7QUFDQSxHQUFHOztBQUdIO0FBQ29CLElBR2hCLHNCQUFvQixRQUE4QjtBQUFJLFFBQWxDLGFBQVEsR0FBUixRQUFRLENBQXNCO0FBQUMsUUFIM0MsWUFBTyxHQUNYLElBQUksR0FBRyxFQUErRSxDQUFDO0FBQy9GLElBQ3lELENBQUM7QUFDMUQsSUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLElBQUksc0NBQWUsR0FBZixVQUFnQixLQUFzQixFQUFFLE9BQTRCO0FBQUksUUFDcEUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuRSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxQyxJQUFJLENBQUM7QUFFTCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsSUFBSSx3Q0FBaUIsR0FBakIsVUFBa0IsS0FBd0IsRUFBRSxPQUE4QjtBQUFJLFFBQzFFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckUsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUMsSUFBSSxDQUFDO0FBRUwsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxJQUFJLGtDQUFXLEdBQVgsVUFBWSxLQUEwQztBQUFJLFFBQTFELGlCQUtDO0FBQ0wsUUFMUSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFlBQVk7QUFBSSxZQUNoRCxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFlBQVksS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNYLElBQUksQ0FBQztBQUVMLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxJQUFJLDRDQUFxQixHQUFyQixVQUFzQixLQUEwQyxFQUFFLE9BQW9EO0FBQUksUUFBMUgsaUJBV0M7QUFDTCxRQVhRLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsWUFBWTtBQUFJLFlBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ2xDLGdCQUFnQixZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFDLGdCQUFnQixPQUFPO0FBQ3ZCLGFBQWE7QUFBQyxpQkFBSztBQUNuQixnQkFBZSxPQUFPLEtBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFFLFVBQUMsR0FBYztBQUFJLG9CQUN6RCxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUNuQixhQUFhO0FBQ2IsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNYLElBQUksQ0FBQztBQUNKO0FBQ3VELGdCQXZEdEIsb0JBQW9CO0FBQUc7QUFFbEQsSUFOTSxZQUFZLGdDQUR4QixVQUFVLEVBQUUsckJBQ0wsMENBSTBCLG9CQUFvQjtBQUFHLE9BSjVDLFlBQVksQ0EwRHhCOzs7Ozs4RUFDRDtBQUFDLElBREQsbUJBQUM7QUFDQSxDQURBLEFBMURELElBMERDO0FBQ0QsU0EzRGEsWUFBWTtBQUN4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFnbUJpY3ljbGluZ0xheWVyIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9iaWN5Y2xpbmctbGF5ZXInO1xuaW1wb3J0IHsgQWdtVHJhbnNpdExheWVyIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy90cmFuc2l0LWxheWVyJztcbmltcG9ydCB7IEdvb2dsZU1hcHNBUElXcmFwcGVyIH0gZnJvbSAnLi4vZ29vZ2xlLW1hcHMtYXBpLXdyYXBwZXInO1xuaW1wb3J0IHsgQmljeWNsaW5nTGF5ZXIsIEJpY3ljbGluZ0xheWVyT3B0aW9ucywgR29vZ2xlTWFwLCBUcmFuc2l0TGF5ZXIsIFRyYW5zaXRMYXllck9wdGlvbnMgfSBmcm9tICcuLi9nb29nbGUtbWFwcy10eXBlcyc7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBtYW5hZ2VzIFRyYW5zaXQgYW5kIEJpY3ljbGluZyBMYXllcnMgZm9yIGEgR29vZ2xlIE1hcCBpbnN0YW5jZS5cbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGF5ZXJNYW5hZ2VyIHtcbiAgICBwcml2YXRlIF9sYXllcnM6IE1hcDxBZ21UcmFuc2l0TGF5ZXIgfCBBZ21CaWN5Y2xpbmdMYXllciwgUHJvbWlzZTxUcmFuc2l0TGF5ZXIgfCBCaWN5Y2xpbmdMYXllcj4+ID1cbiAgICAgICAgbmV3IE1hcDxBZ21UcmFuc2l0TGF5ZXIgfCBBZ21CaWN5Y2xpbmdMYXllciwgUHJvbWlzZTxUcmFuc2l0TGF5ZXIgfCBCaWN5Y2xpbmdMYXllcj4+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF93cmFwcGVyOiBHb29nbGVNYXBzQVBJV3JhcHBlcikge31cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSB0cmFuc2l0IGxheWVyIHRvIGEgbWFwIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7QWdtVHJhbnNpdExheWVyfSBsYXllciAtIGEgVHJhbnNpdExheWVyIG9iamVjdFxuICAgICAqIEBwYXJhbSB7VHJhbnNpdExheWVyT3B0aW9uc30gb3B0aW9ucyAtIFRyYW5zaXRMYXllck9wdGlvbnMgb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBhZGRUcmFuc2l0TGF5ZXIobGF5ZXI6IEFnbVRyYW5zaXRMYXllciwgb3B0aW9uczogVHJhbnNpdExheWVyT3B0aW9ucyk6IHZvaWQge1xuICAgICAgICBjb25zdCBuZXdMYXllciA9IHRoaXMuX3dyYXBwZXIuY3JlYXRlVHJhbnNpdExheWVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9sYXllcnMuc2V0KGxheWVyLCBuZXdMYXllcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGJpY3ljbGluZyBsYXllciB0byBhIG1hcCBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge0FnbUJpY3ljbGluZ0xheWVyfSBsYXllciAtIGEgYmljeWNsaW5nIGxheWVyIG9iamVjdFxuICAgICAqIEBwYXJhbSB7QmljeWNsaW5nTGF5ZXJPcHRpb25zfSBvcHRpb25zIC0gQmljeWNsaW5nTGF5ZXIgb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBhZGRCaWN5Y2xpbmdMYXllcihsYXllcjogQWdtQmljeWNsaW5nTGF5ZXIsIG9wdGlvbnM6IEJpY3ljbGluZ0xheWVyT3B0aW9ucyk6IHZvaWQge1xuICAgICAgICBjb25zdCBuZXdMYXllciA9IHRoaXMuX3dyYXBwZXIuY3JlYXRlQmljeWNsaW5nTGF5ZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2xheWVycy5zZXQobGF5ZXIsIG5ld0xheWVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGVzIGEgbWFwIGxheWVyXG4gICAgICogQHBhcmFtIHtBZ21UcmFuc2l0TGF5ZXJ8QWdtQmljeWNsaW5nTGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIGRlbGV0ZVxuICAgICAqIEByZXR1cm5zICBQcm9taXNlPHZvaWQ+XG4gICAgICovXG4gICAgZGVsZXRlTGF5ZXIobGF5ZXI6IEFnbVRyYW5zaXRMYXllciB8IEFnbUJpY3ljbGluZ0xheWVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXllcnMuZ2V0KGxheWVyKS50aGVuKGN1cnJlbnRMYXllciA9PiB7XG4gICAgICAgICAgICBjdXJyZW50TGF5ZXIuc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgdGhpcy5fbGF5ZXJzLmRlbGV0ZShsYXllcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGUvU2hvdyBhIGdvb2dsZSBtYXAgbGF5ZXJcbiAgICAgKiBAcGFyYW0geyBBZ21UcmFuc2l0TGF5ZXJ8QWdtQmljeWNsaW5nTGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIGhpZGUvc2hvd1xuICAgICAqIEBwYXJhbSB7VHJhbnNpdExheWVyT3B0aW9uc3xCaWN5Y2xpbmdMYXllck9wdGlvbnN9IG9wdGlvbnMgLSB1c2VkIHRvIHNldCB2aXNpYmlsaXR5IG9mIHRoZSBsYXllclxuICAgICAqIEByZXR1cm5zIFByb21pc2U8dm9pZD5cbiAgICAgKi9cbiAgICB0b2dnbGVMYXllclZpc2liaWxpdHkobGF5ZXI6IEFnbVRyYW5zaXRMYXllciB8IEFnbUJpY3ljbGluZ0xheWVyLCBvcHRpb25zOiBUcmFuc2l0TGF5ZXJPcHRpb25zIHwgQmljeWNsaW5nTGF5ZXJPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXllcnMuZ2V0KGxheWVyKS50aGVuKGN1cnJlbnRMYXllciA9PiB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMYXllci5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93cmFwcGVyLmdldE5hdGl2ZU1hcCgpLnRoZW4oIChtYXA6IEdvb2dsZU1hcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMYXllci5zZXRNYXAobWFwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19