import * as tslib_1 from "tslib";
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { KmlLayerManager } from './../services/managers/kml-layer-manager';
import * as ɵngcc0 from '@angular/core';
var layerId = 0;
var AgmKmlLayer = /** @class */ (function () {
    function AgmKmlLayer(_manager) {
        this._manager = _manager;
        this._addedToManager = false;
        this._id = (layerId++).toString();
        this._subscriptions = [];
        /**
         * If true, the layer receives mouse events. Default value is true.
         */
        this.clickable = true;
        /**
         * By default, the input map is centered and zoomed to the bounding box of the contents of the
         * layer.
         * If this option is set to true, the viewport is left unchanged, unless the map's center and zoom
         * were never set.
         */
        this.preserveViewport = false;
        /**
         * Whether to render the screen overlays. Default true.
         */
        this.screenOverlays = true;
        /**
         * Suppress the rendering of info windows when layer features are clicked.
         */
        this.suppressInfoWindows = false;
        /**
         * The URL of the KML document to display.
         */
        this.url = null;
        /**
         * The z-index of the layer.
         */
        this.zIndex = null;
        /**
         * This event is fired when a feature in the layer is clicked.
         */
        this.layerClick = new EventEmitter();
        /**
         * This event is fired when the KML layers default viewport has changed.
         */
        this.defaultViewportChange = new EventEmitter();
        /**
         * This event is fired when the KML layer has finished loading.
         * At this point it is safe to read the status property to determine if the layer loaded
         * successfully.
         */
        this.statusChange = new EventEmitter();
    }
    AgmKmlLayer_1 = AgmKmlLayer;
    AgmKmlLayer.prototype.ngOnInit = function () {
        if (this._addedToManager) {
            return;
        }
        this._manager.addKmlLayer(this);
        this._addedToManager = true;
        this._addEventListeners();
    };
    AgmKmlLayer.prototype.ngOnChanges = function (changes) {
        if (!this._addedToManager) {
            return;
        }
        this._updatePolygonOptions(changes);
    };
    AgmKmlLayer.prototype._updatePolygonOptions = function (changes) {
        var options = Object.keys(changes)
            .filter(function (k) { return AgmKmlLayer_1._kmlLayerOptions.indexOf(k) !== -1; })
            .reduce(function (obj, k) {
            obj[k] = changes[k].currentValue;
            return obj;
        }, {});
        if (Object.keys(options).length > 0) {
            this._manager.setOptions(this, options);
        }
    };
    AgmKmlLayer.prototype._addEventListeners = function () {
        var _this = this;
        var listeners = [
            { name: 'click', handler: function (ev) { return _this.layerClick.emit(ev); } },
            { name: 'defaultviewport_changed', handler: function () { return _this.defaultViewportChange.emit(); } },
            { name: 'status_changed', handler: function () { return _this.statusChange.emit(); } },
        ];
        listeners.forEach(function (obj) {
            var os = _this._manager.createEventObservable(obj.name, _this).subscribe(obj.handler);
            _this._subscriptions.push(os);
        });
    };
    /** @internal */
    AgmKmlLayer.prototype.id = function () { return this._id; };
    /** @internal */
    AgmKmlLayer.prototype.toString = function () { return "AgmKmlLayer-" + this._id.toString(); };
    /** @internal */
    AgmKmlLayer.prototype.ngOnDestroy = function () {
        this._manager.deleteKmlLayer(this);
        // unsubscribe all registered observable subscriptions
        this._subscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    var AgmKmlLayer_1;
    AgmKmlLayer._kmlLayerOptions = ['clickable', 'preserveViewport', 'screenOverlays', 'suppressInfoWindows', 'url', 'zIndex'];
    AgmKmlLayer.ctorParameters = function () { return [
        { type: KmlLayerManager }
    ]; };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmKmlLayer.prototype, "clickable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmKmlLayer.prototype, "preserveViewport", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmKmlLayer.prototype, "screenOverlays", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmKmlLayer.prototype, "suppressInfoWindows", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AgmKmlLayer.prototype, "url", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmKmlLayer.prototype, "zIndex", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmKmlLayer.prototype, "layerClick", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmKmlLayer.prototype, "defaultViewportChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmKmlLayer.prototype, "statusChange", void 0);
    AgmKmlLayer = AgmKmlLayer_1 = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [KmlLayerManager])
    ], AgmKmlLayer);
AgmKmlLayer.ɵfac = function AgmKmlLayer_Factory(t) { return new (t || AgmKmlLayer)(ɵngcc0.ɵɵdirectiveInject(KmlLayerManager)); };
AgmKmlLayer.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: AgmKmlLayer, selectors: [["agm-kml-layer"]], inputs: { clickable: "clickable", preserveViewport: "preserveViewport", screenOverlays: "screenOverlays", suppressInfoWindows: "suppressInfoWindows", url: "url", zIndex: "zIndex" }, outputs: { layerClick: "layerClick", defaultViewportChange: "defaultViewportChange", statusChange: "statusChange" }, features: [ɵngcc0.ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmKmlLayer, [{
        type: Directive,
        args: [{
                selector: 'agm-kml-layer'
            }]
    }], function () { return [{ type: KmlLayerManager }]; }, { clickable: [{
            type: Input
        }], preserveViewport: [{
            type: Input
        }], screenOverlays: [{
            type: Input
        }], suppressInfoWindows: [{
            type: Input
        }], url: [{
            type: Input
        }], zIndex: [{
            type: Input
        }], layerClick: [{
            type: Output
        }], defaultViewportChange: [{
            type: Output
        }], statusChange: [{
            type: Output
        }] }); })();
    return AgmKmlLayer;
}());
export { AgmKmlLayer };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia21sLWxheWVyLmpzIiwic291cmNlcyI6WyJuZzovQGFnbS9jb3JlL2RpcmVjdGl2ZXMva21sLWxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQWdDLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFJcEgsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDOztBQUUzRSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFLaEI7QUFBK0MsSUF5RDdDLHFCQUFvQixRQUF5QjtBQUFJLFFBQTdCLGFBQVEsR0FBUixRQUFRLENBQWlCO0FBQUMsUUF4RHRDLG9CQUFlLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLFFBQVUsUUFBRyxHQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMvQyxRQUFVLG1CQUFjLEdBQW1CLEVBQUUsQ0FBQztBQUM5QyxRQUdFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBVyxjQUFTLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQ0U7QUFDRjtBQUNNO0FBQ007QUFDTTtBQUVBLFdBRGI7QUFDTCxRQUFXLHFCQUFnQixHQUFHLEtBQUssQ0FBQztBQUNwQyxRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBVyxtQkFBYyxHQUFHLElBQUksQ0FBQztBQUNqQyxRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBVyx3QkFBbUIsR0FBRyxLQUFLLENBQUM7QUFDdkMsUUFDRTtBQUNGO0FBRUEsV0FESztBQUNMLFFBQVcsUUFBRyxHQUFXLElBQUksQ0FBQztBQUM5QixRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBVyxXQUFNLEdBQWtCLElBQUksQ0FBQztBQUN4QyxRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBWSxlQUFVLEdBQWdDLElBQUksWUFBWSxFQUFpQixDQUFDO0FBQ3hGLFFBQ0U7QUFDRjtBQUVBLFdBREs7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QUE5QixNQUFNLEVBQUU7QUFBRSwwQ0FBc0IsWUFBWTtBQUFFLDhEQUFnQztBQUVqRixJQUtZO0FBQXFCLFFBQTlCLE1BQU0sRUFBRTtBQUFFLDBDQUFhLFlBQVk7QUFBRSxxREFBZ0M7QUFFeEUsSUF6RGEsV0FBVyxnREFIdkIsU0FBUyxDQUFDLGNBQ1QsUUFBUSxFQUFFLGVBQWUsMURBRW5CLDBDQXlEd0IsZUFBZTtTQTFEOUMsQ0FBQyxWQTBEZ0QsT0F6RHJDLFdBQVcsQ0ErR3ZCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFDRDtBQUFDLElBREQsa0JBQUM7QUFDQSxDQURBLEFBL0dELElBK0dDO0FBQ0QsU0FoSGEsV0FBVztBQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBLbWxNb3VzZUV2ZW50IH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9nb29nbGUtbWFwcy10eXBlcyc7XG5pbXBvcnQgeyBLbWxMYXllck1hbmFnZXIgfSBmcm9tICcuLy4uL3NlcnZpY2VzL21hbmFnZXJzL2ttbC1sYXllci1tYW5hZ2VyJztcblxubGV0IGxheWVySWQgPSAwO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdhZ20ta21sLWxheWVyJyxcbn0pXG5leHBvcnQgY2xhc3MgQWdtS21sTGF5ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBfYWRkZWRUb01hbmFnZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IChsYXllcklkKyspLnRvU3RyaW5nKCk7XG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgc3RhdGljIF9rbWxMYXllck9wdGlvbnM6IHN0cmluZ1tdID1cbiAgICAgIFsnY2xpY2thYmxlJywgJ3ByZXNlcnZlVmlld3BvcnQnLCAnc2NyZWVuT3ZlcmxheXMnLCAnc3VwcHJlc3NJbmZvV2luZG93cycsICd1cmwnLCAnekluZGV4J107XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHRoZSBsYXllciByZWNlaXZlcyBtb3VzZSBldmVudHMuIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZS5cbiAgICovXG4gIEBJbnB1dCgpIGNsaWNrYWJsZSA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBpbnB1dCBtYXAgaXMgY2VudGVyZWQgYW5kIHpvb21lZCB0byB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBjb250ZW50cyBvZiB0aGVcbiAgICogbGF5ZXIuXG4gICAqIElmIHRoaXMgb3B0aW9uIGlzIHNldCB0byB0cnVlLCB0aGUgdmlld3BvcnQgaXMgbGVmdCB1bmNoYW5nZWQsIHVubGVzcyB0aGUgbWFwJ3MgY2VudGVyIGFuZCB6b29tXG4gICAqIHdlcmUgbmV2ZXIgc2V0LlxuICAgKi9cbiAgQElucHV0KCkgcHJlc2VydmVWaWV3cG9ydCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJlbmRlciB0aGUgc2NyZWVuIG92ZXJsYXlzLiBEZWZhdWx0IHRydWUuXG4gICAqL1xuICBASW5wdXQoKSBzY3JlZW5PdmVybGF5cyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFN1cHByZXNzIHRoZSByZW5kZXJpbmcgb2YgaW5mbyB3aW5kb3dzIHdoZW4gbGF5ZXIgZmVhdHVyZXMgYXJlIGNsaWNrZWQuXG4gICAqL1xuICBASW5wdXQoKSBzdXBwcmVzc0luZm9XaW5kb3dzID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBVUkwgb2YgdGhlIEtNTCBkb2N1bWVudCB0byBkaXNwbGF5LlxuICAgKi9cbiAgQElucHV0KCkgdXJsOiBzdHJpbmcgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgei1pbmRleCBvZiB0aGUgbGF5ZXIuXG4gICAqL1xuICBASW5wdXQoKSB6SW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gYSBmZWF0dXJlIGluIHRoZSBsYXllciBpcyBjbGlja2VkLlxuICAgKi9cbiAgQE91dHB1dCgpIGxheWVyQ2xpY2s6IEV2ZW50RW1pdHRlcjxLbWxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8S21sTW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBLTUwgbGF5ZXJzIGRlZmF1bHQgdmlld3BvcnQgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgZGVmYXVsdFZpZXdwb3J0Q2hhbmdlOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgS01MIGxheWVyIGhhcyBmaW5pc2hlZCBsb2FkaW5nLlxuICAgKiBBdCB0aGlzIHBvaW50IGl0IGlzIHNhZmUgdG8gcmVhZCB0aGUgc3RhdHVzIHByb3BlcnR5IHRvIGRldGVybWluZSBpZiB0aGUgbGF5ZXIgbG9hZGVkXG4gICAqIHN1Y2Nlc3NmdWxseS5cbiAgICovXG4gIEBPdXRwdXQoKSBzdGF0dXNDaGFuZ2U6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tYW5hZ2VyOiBLbWxMYXllck1hbmFnZXIpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2FkZGVkVG9NYW5hZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX21hbmFnZXIuYWRkS21sTGF5ZXIodGhpcyk7XG4gICAgdGhpcy5fYWRkZWRUb01hbmFnZXIgPSB0cnVlO1xuICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCF0aGlzLl9hZGRlZFRvTWFuYWdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl91cGRhdGVQb2x5Z29uT3B0aW9ucyhjaGFuZ2VzKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVBvbHlnb25PcHRpb25zKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmtleXMoY2hhbmdlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoayA9PiBBZ21LbWxMYXllci5fa21sTGF5ZXJPcHRpb25zLmluZGV4T2YoaykgIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgob2JqOiBhbnksIGs6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpba10gPSBjaGFuZ2VzW2tdLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KTtcbiAgICBpZiAoT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fbWFuYWdlci5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FkZEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IFtcbiAgICAgIHtuYW1lOiAnY2xpY2snLCBoYW5kbGVyOiAoZXY6IEttbE1vdXNlRXZlbnQpID0+IHRoaXMubGF5ZXJDbGljay5lbWl0KGV2KX0sXG4gICAgICB7bmFtZTogJ2RlZmF1bHR2aWV3cG9ydF9jaGFuZ2VkJywgaGFuZGxlcjogKCkgPT4gdGhpcy5kZWZhdWx0Vmlld3BvcnRDaGFuZ2UuZW1pdCgpfSxcbiAgICAgIHtuYW1lOiAnc3RhdHVzX2NoYW5nZWQnLCBoYW5kbGVyOiAoKSA9PiB0aGlzLnN0YXR1c0NoYW5nZS5lbWl0KCl9LFxuICAgIF07XG4gICAgbGlzdGVuZXJzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgY29uc3Qgb3MgPSB0aGlzLl9tYW5hZ2VyLmNyZWF0ZUV2ZW50T2JzZXJ2YWJsZShvYmoubmFtZSwgdGhpcykuc3Vic2NyaWJlKG9iai5oYW5kbGVyKTtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChvcyk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pZDsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIGBBZ21LbWxMYXllci0ke3RoaXMuX2lkLnRvU3RyaW5nKCl9YDsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fbWFuYWdlci5kZWxldGVLbWxMYXllcih0aGlzKTtcbiAgICAvLyB1bnN1YnNjcmliZSBhbGwgcmVnaXN0ZXJlZCBvYnNlcnZhYmxlIHN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=