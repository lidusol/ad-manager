import * as tslib_1 from "tslib";
import { Directive, Input } from '@angular/core';
import { LayerManager } from '../services/managers/layer-manager';
import * as ɵngcc0 from '@angular/core';
let layerId = 0;
/*
 * This directive adds a bicycling layer to a google map instance
 * <agm-bicycling-layer [visible]="true|false"> <agm-bicycling-layer>
 * */
let AgmBicyclingLayer = class AgmBicyclingLayer {
    constructor(_manager) {
        this._manager = _manager;
        this._addedToManager = false;
        this._id = (layerId++).toString();
        /**
         * Hide/show bicycling layer
         */
        this.visible = true;
    }
    ngOnInit() {
        if (this._addedToManager) {
            return;
        }
        this._manager.addBicyclingLayer(this, { visible: this.visible });
        this._addedToManager = true;
    }
    ngOnChanges(changes) {
        if (!this._addedToManager) {
            return;
        }
        if (changes['visible'] != null) {
            this._manager.toggleLayerVisibility(this, { visible: changes['visible'].currentValue });
        }
    }
    /** @internal */
    id() { return this._id; }
    /** @internal */
    toString() { return `AgmBicyclingLayer-${this._id.toString()}`; }
    /** @internal */
    ngOnDestroy() {
        this._manager.deleteLayer(this);
    }
};
AgmBicyclingLayer.ɵfac = function AgmBicyclingLayer_Factory(t) { return new (t || AgmBicyclingLayer)(ɵngcc0.ɵɵdirectiveInject(LayerManager)); };
AgmBicyclingLayer.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: AgmBicyclingLayer, selectors: [["agm-bicycling-layer"]], inputs: { visible: "visible" }, features: [ɵngcc0.ɵɵNgOnChangesFeature] });
AgmBicyclingLayer.ctorParameters = () => [
    { type: LayerManager }
];
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AgmBicyclingLayer.prototype, "visible", void 0);
AgmBicyclingLayer = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [LayerManager])
], AgmBicyclingLayer);
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmBicyclingLayer, [{
        type: Directive,
        args: [{
                selector: 'agm-bicycling-layer'
            }]
    }], function () { return [{ type: LayerManager }]; }, { visible: [{
            type: Input
        }] }); })();
export { AgmBicyclingLayer };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmljeWNsaW5nLWxheWVyLmpzIiwic291cmNlcyI6WyJuZzovQGFnbS9jb3JlL2RpcmVjdGl2ZXMvYmljeWNsaW5nLWxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9DQUFvQyxDQUFDOztBQUVsRSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFFaEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUtMLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0FBQUcsSUFTN0IsWUFBcUIsUUFBc0I7QUFBSSxRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFjO0FBQUMsUUFScEMsb0JBQWUsR0FBRyxLQUFLLENBQUM7QUFDcEMsUUFBWSxRQUFHLEdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2pELFFBQ0k7QUFDSjtBQUNJLFdBQUc7QUFDUCxRQUFhLFlBQU8sR0FBRyxJQUFJLENBQUM7QUFDNUIsSUFDbUQsQ0FBQztBQUNwRCxJQUNJLFFBQVE7QUFDWixRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUNsQyxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNULFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDdkUsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUNwQyxJQUFJLENBQUM7QUFDTCxJQUNJLFdBQVcsQ0FBQyxPQUFzQjtBQUN0QyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ25DLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1QsUUFBUSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDeEMsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQztBQUNsRyxTQUFTO0FBQ1QsSUFBSSxDQUFDO0FBQ0wsSUFDSSxnQkFBZ0I7QUFDcEIsSUFBSSxFQUFFLEtBQWEsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyQyxJQUNJLGdCQUFnQjtBQUNwQixJQUFJLFFBQVEsS0FBYSxPQUFPLHFCQUFxQixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdFLElBQ0ksZ0JBQWdCO0FBQ3BCLElBQUksV0FBVztBQUNmLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsSUFBSSxDQUFDO0FBQ0wsQ0FDQzs7OExBQUE7QUFDRDtBQUEyQyxZQS9CUixZQUFZO0FBQUc7QUFGckM7QUFFVCxJQUZDLEtBQUssRUFBRTtBQUFFO0FBRWdCLGtEQUZGO0FBUGYsaUJBQWlCLDRCQUo3QixTQUFTLENBQUMsVUFDUCxRQUFRLEVBQUUscUJBQXFCLHhEQUdoQywwQ0FTZ0MsWUFBWTtNQVg5QyxDQUFDLFBBV2dELEdBVHJDLGlCQUFpQixDQXVDN0I7Ozs7Ozs7O29CQUNEO0FBQUMsU0F4Q1ksaUJBQWlCO0FBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllck1hbmFnZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9tYW5hZ2Vycy9sYXllci1tYW5hZ2VyJztcblxubGV0IGxheWVySWQgPSAwO1xuXG4vKlxuICogVGhpcyBkaXJlY3RpdmUgYWRkcyBhIGJpY3ljbGluZyBsYXllciB0byBhIGdvb2dsZSBtYXAgaW5zdGFuY2VcbiAqIDxhZ20tYmljeWNsaW5nLWxheWVyIFt2aXNpYmxlXT1cInRydWV8ZmFsc2VcIj4gPGFnbS1iaWN5Y2xpbmctbGF5ZXI+XG4gKiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdhZ20tYmljeWNsaW5nLWxheWVyJyxcbn0pXG5cbmV4cG9ydCBjbGFzcyBBZ21CaWN5Y2xpbmdMYXllciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3l7XG4gICAgcHJpdmF0ZSBfYWRkZWRUb01hbmFnZXIgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9pZDogc3RyaW5nID0gKGxheWVySWQrKykudG9TdHJpbmcoKTtcblxuICAgIC8qKlxuICAgICAqIEhpZGUvc2hvdyBiaWN5Y2xpbmcgbGF5ZXJcbiAgICAgKi9cbiAgICBASW5wdXQoKSB2aXNpYmxlID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIF9tYW5hZ2VyOiBMYXllck1hbmFnZXIgKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hZGRlZFRvTWFuYWdlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hbmFnZXIuYWRkQmljeWNsaW5nTGF5ZXIodGhpcywge3Zpc2libGU6IHRoaXMudmlzaWJsZX0pO1xuICAgICAgICB0aGlzLl9hZGRlZFRvTWFuYWdlciA9IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoIXRoaXMuX2FkZGVkVG9NYW5hZ2VyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZXNbJ3Zpc2libGUnXSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9tYW5hZ2VyLnRvZ2dsZUxheWVyVmlzaWJpbGl0eSh0aGlzLCB7dmlzaWJsZTogY2hhbmdlc1sndmlzaWJsZSddLmN1cnJlbnRWYWx1ZX0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pZDsgfVxuXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBgQWdtQmljeWNsaW5nTGF5ZXItJHt0aGlzLl9pZC50b1N0cmluZygpfWA7IH1cblxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fbWFuYWdlci5kZWxldGVMYXllcih0aGlzKTtcbiAgICB9XG5cbn1cbiJdfQ==