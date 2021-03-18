import * as tslib_1 from "tslib";
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { DataLayerManager } from './../services/managers/data-layer-manager';
import * as ɵngcc0 from '@angular/core';
var layerId = 0;
/**
 * AgmDataLayer enables the user to add data layers to the map.
 *
 * ### Example
 * ```typescript
 * import { Component } from 'angular2/core';
 * import { AgmMap, AgmDataLayer } from
 * 'angular-google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [AgmMap, AgmDataLayer],
 *  styles: [`
 *    .agm-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 * <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 * 	  <agm-data-layer [geoJson]="geoJsonObject" (layerClick)="clicked($event)" [style]="styleFunc">
 * 	  </agm-data-layer>
 * </agm-map>
 *  `
 * })
 * export class MyMapCmp {
 *   lat: number = -25.274449;
 *   lng: number = 133.775060;
 *   zoom: number = 5;
 *
 * clicked(clickEvent) {
 *    console.log(clickEvent);
 *  }
 *
 *  styleFunc(feature) {
 *    return ({
 *      clickable: false,
 *      fillColor: feature.getProperty('color'),
 *      strokeWeight: 1
 *    });
 *  }
 *
 *  geoJsonObject: Object = {
 *    "type": "FeatureCollection",
 *    "features": [
 *      {
 *        "type": "Feature",
 *        "properties": {
 *          "letter": "G",
 *          "color": "blue",
 *          "rank": "7",
 *          "ascii": "71"
 *        },
 *        "geometry": {
 *          "type": "Polygon",
 *          "coordinates": [
 *            [
 *              [123.61, -22.14], [122.38, -21.73], [121.06, -21.69], [119.66, -22.22], [119.00, -23.40],
 *              [118.65, -24.76], [118.43, -26.07], [118.78, -27.56], [119.22, -28.57], [120.23, -29.49],
 *              [121.77, -29.87], [123.57, -29.64], [124.45, -29.03], [124.71, -27.95], [124.80, -26.70],
 *              [124.80, -25.60], [123.61, -25.64], [122.56, -25.64], [121.72, -25.72], [121.81, -26.62],
 *              [121.86, -26.98], [122.60, -26.90], [123.57, -27.05], [123.57, -27.68], [123.35, -28.18],
 *              [122.51, -28.38], [121.77, -28.26], [121.02, -27.91], [120.49, -27.21], [120.14, -26.50],
 *              [120.10, -25.64], [120.27, -24.52], [120.67, -23.68], [121.72, -23.32], [122.43, -23.48],
 *              [123.04, -24.04], [124.54, -24.28], [124.58, -23.20], [123.61, -22.14]
 *            ]
 *          ]
 *        }
 *      },
 *      {
 *        "type": "Feature",
 *        "properties": {
 *          "letter": "o",
 *          "color": "red",
 *          "rank": "15",
 *          "ascii": "111"
 *        },
 *        "geometry": {
 *          "type": "Polygon",
 *          "coordinates": [
 *            [
 *              [128.84, -25.76], [128.18, -25.60], [127.96, -25.52], [127.88, -25.52], [127.70, -25.60],
 *              [127.26, -25.79], [126.60, -26.11], [126.16, -26.78], [126.12, -27.68], [126.21, -28.42],
 *              [126.69, -29.49], [127.74, -29.80], [128.80, -29.72], [129.41, -29.03], [129.72, -27.95],
 *              [129.68, -27.21], [129.33, -26.23], [128.84, -25.76]
 *            ],
 *            [
 *              [128.45, -27.44], [128.32, -26.94], [127.70, -26.82], [127.35, -27.05], [127.17, -27.80],
 *              [127.57, -28.22], [128.10, -28.42], [128.49, -27.80], [128.45, -27.44]
 *            ]
 *          ]
 *        }
 *      },
 *      {
 *        "type": "Feature",
 *        "properties": {
 *          "letter": "o",
 *          "color": "yellow",
 *          "rank": "15",
 *          "ascii": "111"
 *        },
 *        "geometry": {
 *          "type": "Polygon",
 *          "coordinates": [
 *            [
 *              [131.87, -25.76], [131.35, -26.07], [130.95, -26.78], [130.82, -27.64], [130.86, -28.53],
 *              [131.26, -29.22], [131.92, -29.76], [132.45, -29.87], [133.06, -29.76], [133.72, -29.34],
 *              [134.07, -28.80], [134.20, -27.91], [134.07, -27.21], [133.81, -26.31], [133.37, -25.83],
 *              [132.71, -25.64], [131.87, -25.76]
 *            ],
 *            [
 *              [133.15, -27.17], [132.71, -26.86], [132.09, -26.90], [131.74, -27.56], [131.79, -28.26],
 *              [132.36, -28.45], [132.93, -28.34], [133.15, -27.76], [133.15, -27.17]
 *            ]
 *          ]
 *        }
 *      },
 *      {
 *        "type": "Feature",
 *        "properties": {
 *          "letter": "g",
 *          "color": "blue",
 *          "rank": "7",
 *          "ascii": "103"
 *        },
 *        "geometry": {
 *          "type": "Polygon",
 *          "coordinates": [
 *            [
 *              [138.12, -25.04], [136.84, -25.16], [135.96, -25.36], [135.26, -25.99], [135, -26.90],
 *              [135.04, -27.91], [135.26, -28.88], [136.05, -29.45], [137.02, -29.49], [137.81, -29.49],
 *              [137.94, -29.99], [137.90, -31.20], [137.85, -32.24], [136.88, -32.69], [136.45, -32.36],
 *              [136.27, -31.80], [134.95, -31.84], [135.17, -32.99], [135.52, -33.43], [136.14, -33.76],
 *              [137.06, -33.83], [138.12, -33.65], [138.86, -33.21], [139.30, -32.28], [139.30, -31.24],
 *              [139.30, -30.14], [139.21, -28.96], [139.17, -28.22], [139.08, -27.41], [139.08, -26.47],
 *              [138.99, -25.40], [138.73, -25.00], [138.12, -25.04]
 *            ],
 *            [
 *              [137.50, -26.54], [136.97, -26.47], [136.49, -26.58], [136.31, -27.13], [136.31, -27.72],
 *              [136.58, -27.99], [137.50, -28.03], [137.68, -27.68], [137.59, -26.78], [137.50, -26.54]
 *            ]
 *          ]
 *        }
 *      },
 *      {
 *        "type": "Feature",
 *        "properties": {
 *          "letter": "l",
 *          "color": "green",
 *          "rank": "12",
 *          "ascii": "108"
 *        },
 *        "geometry": {
 *          "type": "Polygon",
 *          "coordinates": [
 *            [
 *              [140.14, -21.04], [140.31, -29.42], [141.67, -29.49], [141.59, -20.92], [140.14, -21.04]
 *            ]
 *          ]
 *        }
 *      },
 *      {
 *        "type": "Feature",
 *        "properties": {
 *          "letter": "e",
 *          "color": "red",
 *          "rank": "5",
 *          "ascii": "101"
 *        },
 *        "geometry": {
 *          "type": "Polygon",
 *          "coordinates": [
 *            [
 *              [144.14, -27.41], [145.67, -27.52], [146.86, -27.09], [146.82, -25.64], [146.25, -25.04],
 *              [145.45, -24.68], [144.66, -24.60], [144.09, -24.76], [143.43, -25.08], [142.99, -25.40],
 *              [142.64, -26.03], [142.64, -27.05], [142.64, -28.26], [143.30, -29.11], [144.18, -29.57],
 *              [145.41, -29.64], [146.46, -29.19], [146.64, -28.72], [146.82, -28.14], [144.84, -28.42],
 *              [144.31, -28.26], [144.14, -27.41]
 *            ],
 *            [
 *              [144.18, -26.39], [144.53, -26.58], [145.19, -26.62], [145.72, -26.35], [145.81, -25.91],
 *              [145.41, -25.68], [144.97, -25.68], [144.49, -25.64], [144, -25.99], [144.18, -26.39]
 *            ]
 *          ]
 *        }
 *      }
 *    ]
 *  };
 * }
 * ```
 */
var AgmDataLayer = /** @class */ (function () {
    function AgmDataLayer(_manager) {
        this._manager = _manager;
        this._addedToManager = false;
        this._id = (layerId++).toString();
        this._subscriptions = [];
        /**
         * This event is fired when a feature in the layer is clicked.
         */
        this.layerClick = new EventEmitter();
        /**
         * The geoJson to be displayed
         */
        this.geoJson = null;
    }
    AgmDataLayer_1 = AgmDataLayer;
    AgmDataLayer.prototype.ngOnInit = function () {
        if (this._addedToManager) {
            return;
        }
        this._manager.addDataLayer(this);
        this._addedToManager = true;
        this._addEventListeners();
    };
    AgmDataLayer.prototype._addEventListeners = function () {
        var _this = this;
        var listeners = [
            { name: 'click', handler: function (ev) { return _this.layerClick.emit(ev); } },
        ];
        listeners.forEach(function (obj) {
            var os = _this._manager.createEventObservable(obj.name, _this).subscribe(obj.handler);
            _this._subscriptions.push(os);
        });
    };
    /** @internal */
    AgmDataLayer.prototype.id = function () { return this._id; };
    /** @internal */
    AgmDataLayer.prototype.toString = function () { return "AgmDataLayer-" + this._id.toString(); };
    /** @internal */
    AgmDataLayer.prototype.ngOnDestroy = function () {
        this._manager.deleteDataLayer(this);
        // unsubscribe all registered observable subscriptions
        this._subscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    /** @internal */
    AgmDataLayer.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this._addedToManager) {
            return;
        }
        var geoJsonChange = changes['geoJson'];
        if (geoJsonChange) {
            this._manager.updateGeoJson(this, geoJsonChange.currentValue);
        }
        var dataOptions = {};
        AgmDataLayer_1._dataOptionsAttributes.forEach(function (k) { return dataOptions[k] = changes.hasOwnProperty(k) ? changes[k].currentValue : _this[k]; });
        this._manager.setDataOptions(this, dataOptions);
    };
    var AgmDataLayer_1;
    AgmDataLayer._dataOptionsAttributes = ['style'];
    AgmDataLayer.ctorParameters = function () { return [
        { type: DataLayerManager }
    ]; };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmDataLayer.prototype, "layerClick", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmDataLayer.prototype, "geoJson", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Function)
    ], AgmDataLayer.prototype, "style", void 0);
    AgmDataLayer = AgmDataLayer_1 = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [DataLayerManager])
    ], AgmDataLayer);
AgmDataLayer.ɵfac = function AgmDataLayer_Factory(t) { return new (t || AgmDataLayer)(ɵngcc0.ɵɵdirectiveInject(DataLayerManager)); };
AgmDataLayer.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: AgmDataLayer, selectors: [["agm-data-layer"]], inputs: { geoJson: "geoJson", style: "style" }, outputs: { layerClick: "layerClick" }, features: [ɵngcc0.ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmDataLayer, [{
        type: Directive,
        args: [{
                selector: 'agm-data-layer'
            }]
    }], function () { return [{ type: DataLayerManager }]; }, { layerClick: [{
            type: Output
        }], geoJson: [{
            type: Input
        }], style: [{
            type: Input
        }] }); })();
    return AgmDataLayer;
}());
export { AgmDataLayer };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1sYXllci5qcyIsInNvdXJjZXMiOlsibmc6L0BhZ20vY29yZS9kaXJlY3RpdmVzL2RhdGEtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBZ0MsTUFBTSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUlwSCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7QUFFN0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUMsY0FDVCxRQUFRLEVBQUUsZ0JBQWdCLDNEQUVwQiwwQ0FzQndCLGdCQUFnQjtTQXZCL0MsQ0FBQyxWQXVCaUQsT0F0QnRDLFlBQVksQ0F5RXhCOzs7Ozs7Ozs7Ozs7OztvQkFDRDtBQUFDLElBREQsbUJBQUM7QUFDQSxDQURBLEFBekVELElBeUVDO0FBQ0QsU0ExRWEsWUFBWTtBQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEYXRhTW91c2VFdmVudCwgRGF0YU9wdGlvbnMgfSBmcm9tICcuLy4uL3NlcnZpY2VzL2dvb2dsZS1tYXBzLXR5cGVzJztcbmltcG9ydCB7IERhdGFMYXllck1hbmFnZXIgfSBmcm9tICcuLy4uL3NlcnZpY2VzL21hbmFnZXJzL2RhdGEtbGF5ZXItbWFuYWdlcic7XG5cbmxldCBsYXllcklkID0gMDtcblxuLyoqXG4gKiBBZ21EYXRhTGF5ZXIgZW5hYmxlcyB0aGUgdXNlciB0byBhZGQgZGF0YSBsYXllcnMgdG8gdGhlIG1hcC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG4gKiBpbXBvcnQgeyBBZ21NYXAsIEFnbURhdGFMYXllciB9IGZyb21cbiAqICdhbmd1bGFyLWdvb2dsZS1tYXBzL2NvcmUnO1xuICpcbiAqIEBDb21wb25lbnQoe1xuICogIHNlbGVjdG9yOiAnbXktbWFwLWNtcCcsXG4gKiAgZGlyZWN0aXZlczogW0FnbU1hcCwgQWdtRGF0YUxheWVyXSxcbiAqICBzdHlsZXM6IFtgXG4gKiAgICAuYWdtLWNvbnRhaW5lciB7XG4gKiAgICAgIGhlaWdodDogMzAwcHg7XG4gKiAgICB9XG4gKiBgXSxcbiAqICB0ZW1wbGF0ZTogYFxuICogPGFnbS1tYXAgW2xhdGl0dWRlXT1cImxhdFwiIFtsb25naXR1ZGVdPVwibG5nXCIgW3pvb21dPVwiem9vbVwiPlxuICogXHQgIDxhZ20tZGF0YS1sYXllciBbZ2VvSnNvbl09XCJnZW9Kc29uT2JqZWN0XCIgKGxheWVyQ2xpY2spPVwiY2xpY2tlZCgkZXZlbnQpXCIgW3N0eWxlXT1cInN0eWxlRnVuY1wiPlxuICogXHQgIDwvYWdtLWRhdGEtbGF5ZXI+XG4gKiA8L2FnbS1tYXA+XG4gKiAgYFxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBNeU1hcENtcCB7XG4gKiAgIGxhdDogbnVtYmVyID0gLTI1LjI3NDQ0OTtcbiAqICAgbG5nOiBudW1iZXIgPSAxMzMuNzc1MDYwO1xuICogICB6b29tOiBudW1iZXIgPSA1O1xuICpcbiAqIGNsaWNrZWQoY2xpY2tFdmVudCkge1xuICogICAgY29uc29sZS5sb2coY2xpY2tFdmVudCk7XG4gKiAgfVxuICpcbiAqICBzdHlsZUZ1bmMoZmVhdHVyZSkge1xuICogICAgcmV0dXJuICh7XG4gKiAgICAgIGNsaWNrYWJsZTogZmFsc2UsXG4gKiAgICAgIGZpbGxDb2xvcjogZmVhdHVyZS5nZXRQcm9wZXJ0eSgnY29sb3InKSxcbiAqICAgICAgc3Ryb2tlV2VpZ2h0OiAxXG4gKiAgICB9KTtcbiAqICB9XG4gKlxuICogIGdlb0pzb25PYmplY3Q6IE9iamVjdCA9IHtcbiAqICAgIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gKiAgICBcImZlYXR1cmVzXCI6IFtcbiAqICAgICAge1xuICogICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAqICAgICAgICBcInByb3BlcnRpZXNcIjoge1xuICogICAgICAgICAgXCJsZXR0ZXJcIjogXCJHXCIsXG4gKiAgICAgICAgICBcImNvbG9yXCI6IFwiYmx1ZVwiLFxuICogICAgICAgICAgXCJyYW5rXCI6IFwiN1wiLFxuICogICAgICAgICAgXCJhc2NpaVwiOiBcIjcxXCJcbiAqICAgICAgICB9LFxuICogICAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICogICAgICAgICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuICogICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gKiAgICAgICAgICAgIFtcbiAqICAgICAgICAgICAgICBbMTIzLjYxLCAtMjIuMTRdLCBbMTIyLjM4LCAtMjEuNzNdLCBbMTIxLjA2LCAtMjEuNjldLCBbMTE5LjY2LCAtMjIuMjJdLCBbMTE5LjAwLCAtMjMuNDBdLFxuICogICAgICAgICAgICAgIFsxMTguNjUsIC0yNC43Nl0sIFsxMTguNDMsIC0yNi4wN10sIFsxMTguNzgsIC0yNy41Nl0sIFsxMTkuMjIsIC0yOC41N10sIFsxMjAuMjMsIC0yOS40OV0sXG4gKiAgICAgICAgICAgICAgWzEyMS43NywgLTI5Ljg3XSwgWzEyMy41NywgLTI5LjY0XSwgWzEyNC40NSwgLTI5LjAzXSwgWzEyNC43MSwgLTI3Ljk1XSwgWzEyNC44MCwgLTI2LjcwXSxcbiAqICAgICAgICAgICAgICBbMTI0LjgwLCAtMjUuNjBdLCBbMTIzLjYxLCAtMjUuNjRdLCBbMTIyLjU2LCAtMjUuNjRdLCBbMTIxLjcyLCAtMjUuNzJdLCBbMTIxLjgxLCAtMjYuNjJdLFxuICogICAgICAgICAgICAgIFsxMjEuODYsIC0yNi45OF0sIFsxMjIuNjAsIC0yNi45MF0sIFsxMjMuNTcsIC0yNy4wNV0sIFsxMjMuNTcsIC0yNy42OF0sIFsxMjMuMzUsIC0yOC4xOF0sXG4gKiAgICAgICAgICAgICAgWzEyMi41MSwgLTI4LjM4XSwgWzEyMS43NywgLTI4LjI2XSwgWzEyMS4wMiwgLTI3LjkxXSwgWzEyMC40OSwgLTI3LjIxXSwgWzEyMC4xNCwgLTI2LjUwXSxcbiAqICAgICAgICAgICAgICBbMTIwLjEwLCAtMjUuNjRdLCBbMTIwLjI3LCAtMjQuNTJdLCBbMTIwLjY3LCAtMjMuNjhdLCBbMTIxLjcyLCAtMjMuMzJdLCBbMTIyLjQzLCAtMjMuNDhdLFxuICogICAgICAgICAgICAgIFsxMjMuMDQsIC0yNC4wNF0sIFsxMjQuNTQsIC0yNC4yOF0sIFsxMjQuNTgsIC0yMy4yMF0sIFsxMjMuNjEsIC0yMi4xNF1cbiAqICAgICAgICAgICAgXVxuICogICAgICAgICAgXVxuICogICAgICAgIH1cbiAqICAgICAgfSxcbiAqICAgICAge1xuICogICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAqICAgICAgICBcInByb3BlcnRpZXNcIjoge1xuICogICAgICAgICAgXCJsZXR0ZXJcIjogXCJvXCIsXG4gKiAgICAgICAgICBcImNvbG9yXCI6IFwicmVkXCIsXG4gKiAgICAgICAgICBcInJhbmtcIjogXCIxNVwiLFxuICogICAgICAgICAgXCJhc2NpaVwiOiBcIjExMVwiXG4gKiAgICAgICAgfSxcbiAqICAgICAgICBcImdlb21ldHJ5XCI6IHtcbiAqICAgICAgICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbiAqICAgICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICogICAgICAgICAgICBbXG4gKiAgICAgICAgICAgICAgWzEyOC44NCwgLTI1Ljc2XSwgWzEyOC4xOCwgLTI1LjYwXSwgWzEyNy45NiwgLTI1LjUyXSwgWzEyNy44OCwgLTI1LjUyXSwgWzEyNy43MCwgLTI1LjYwXSxcbiAqICAgICAgICAgICAgICBbMTI3LjI2LCAtMjUuNzldLCBbMTI2LjYwLCAtMjYuMTFdLCBbMTI2LjE2LCAtMjYuNzhdLCBbMTI2LjEyLCAtMjcuNjhdLCBbMTI2LjIxLCAtMjguNDJdLFxuICogICAgICAgICAgICAgIFsxMjYuNjksIC0yOS40OV0sIFsxMjcuNzQsIC0yOS44MF0sIFsxMjguODAsIC0yOS43Ml0sIFsxMjkuNDEsIC0yOS4wM10sIFsxMjkuNzIsIC0yNy45NV0sXG4gKiAgICAgICAgICAgICAgWzEyOS42OCwgLTI3LjIxXSwgWzEyOS4zMywgLTI2LjIzXSwgWzEyOC44NCwgLTI1Ljc2XVxuICogICAgICAgICAgICBdLFxuICogICAgICAgICAgICBbXG4gKiAgICAgICAgICAgICAgWzEyOC40NSwgLTI3LjQ0XSwgWzEyOC4zMiwgLTI2Ljk0XSwgWzEyNy43MCwgLTI2LjgyXSwgWzEyNy4zNSwgLTI3LjA1XSwgWzEyNy4xNywgLTI3LjgwXSxcbiAqICAgICAgICAgICAgICBbMTI3LjU3LCAtMjguMjJdLCBbMTI4LjEwLCAtMjguNDJdLCBbMTI4LjQ5LCAtMjcuODBdLCBbMTI4LjQ1LCAtMjcuNDRdXG4gKiAgICAgICAgICAgIF1cbiAqICAgICAgICAgIF1cbiAqICAgICAgICB9XG4gKiAgICAgIH0sXG4gKiAgICAgIHtcbiAqICAgICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gKiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAqICAgICAgICAgIFwibGV0dGVyXCI6IFwib1wiLFxuICogICAgICAgICAgXCJjb2xvclwiOiBcInllbGxvd1wiLFxuICogICAgICAgICAgXCJyYW5rXCI6IFwiMTVcIixcbiAqICAgICAgICAgIFwiYXNjaWlcIjogXCIxMTFcIlxuICogICAgICAgIH0sXG4gKiAgICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gKiAgICAgICAgICBcInR5cGVcIjogXCJQb2x5Z29uXCIsXG4gKiAgICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAqICAgICAgICAgICAgW1xuICogICAgICAgICAgICAgIFsxMzEuODcsIC0yNS43Nl0sIFsxMzEuMzUsIC0yNi4wN10sIFsxMzAuOTUsIC0yNi43OF0sIFsxMzAuODIsIC0yNy42NF0sIFsxMzAuODYsIC0yOC41M10sXG4gKiAgICAgICAgICAgICAgWzEzMS4yNiwgLTI5LjIyXSwgWzEzMS45MiwgLTI5Ljc2XSwgWzEzMi40NSwgLTI5Ljg3XSwgWzEzMy4wNiwgLTI5Ljc2XSwgWzEzMy43MiwgLTI5LjM0XSxcbiAqICAgICAgICAgICAgICBbMTM0LjA3LCAtMjguODBdLCBbMTM0LjIwLCAtMjcuOTFdLCBbMTM0LjA3LCAtMjcuMjFdLCBbMTMzLjgxLCAtMjYuMzFdLCBbMTMzLjM3LCAtMjUuODNdLFxuICogICAgICAgICAgICAgIFsxMzIuNzEsIC0yNS42NF0sIFsxMzEuODcsIC0yNS43Nl1cbiAqICAgICAgICAgICAgXSxcbiAqICAgICAgICAgICAgW1xuICogICAgICAgICAgICAgIFsxMzMuMTUsIC0yNy4xN10sIFsxMzIuNzEsIC0yNi44Nl0sIFsxMzIuMDksIC0yNi45MF0sIFsxMzEuNzQsIC0yNy41Nl0sIFsxMzEuNzksIC0yOC4yNl0sXG4gKiAgICAgICAgICAgICAgWzEzMi4zNiwgLTI4LjQ1XSwgWzEzMi45MywgLTI4LjM0XSwgWzEzMy4xNSwgLTI3Ljc2XSwgWzEzMy4xNSwgLTI3LjE3XVxuICogICAgICAgICAgICBdXG4gKiAgICAgICAgICBdXG4gKiAgICAgICAgfVxuICogICAgICB9LFxuICogICAgICB7XG4gKiAgICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICogICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gKiAgICAgICAgICBcImxldHRlclwiOiBcImdcIixcbiAqICAgICAgICAgIFwiY29sb3JcIjogXCJibHVlXCIsXG4gKiAgICAgICAgICBcInJhbmtcIjogXCI3XCIsXG4gKiAgICAgICAgICBcImFzY2lpXCI6IFwiMTAzXCJcbiAqICAgICAgICB9LFxuICogICAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICogICAgICAgICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuICogICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gKiAgICAgICAgICAgIFtcbiAqICAgICAgICAgICAgICBbMTM4LjEyLCAtMjUuMDRdLCBbMTM2Ljg0LCAtMjUuMTZdLCBbMTM1Ljk2LCAtMjUuMzZdLCBbMTM1LjI2LCAtMjUuOTldLCBbMTM1LCAtMjYuOTBdLFxuICogICAgICAgICAgICAgIFsxMzUuMDQsIC0yNy45MV0sIFsxMzUuMjYsIC0yOC44OF0sIFsxMzYuMDUsIC0yOS40NV0sIFsxMzcuMDIsIC0yOS40OV0sIFsxMzcuODEsIC0yOS40OV0sXG4gKiAgICAgICAgICAgICAgWzEzNy45NCwgLTI5Ljk5XSwgWzEzNy45MCwgLTMxLjIwXSwgWzEzNy44NSwgLTMyLjI0XSwgWzEzNi44OCwgLTMyLjY5XSwgWzEzNi40NSwgLTMyLjM2XSxcbiAqICAgICAgICAgICAgICBbMTM2LjI3LCAtMzEuODBdLCBbMTM0Ljk1LCAtMzEuODRdLCBbMTM1LjE3LCAtMzIuOTldLCBbMTM1LjUyLCAtMzMuNDNdLCBbMTM2LjE0LCAtMzMuNzZdLFxuICogICAgICAgICAgICAgIFsxMzcuMDYsIC0zMy44M10sIFsxMzguMTIsIC0zMy42NV0sIFsxMzguODYsIC0zMy4yMV0sIFsxMzkuMzAsIC0zMi4yOF0sIFsxMzkuMzAsIC0zMS4yNF0sXG4gKiAgICAgICAgICAgICAgWzEzOS4zMCwgLTMwLjE0XSwgWzEzOS4yMSwgLTI4Ljk2XSwgWzEzOS4xNywgLTI4LjIyXSwgWzEzOS4wOCwgLTI3LjQxXSwgWzEzOS4wOCwgLTI2LjQ3XSxcbiAqICAgICAgICAgICAgICBbMTM4Ljk5LCAtMjUuNDBdLCBbMTM4LjczLCAtMjUuMDBdLCBbMTM4LjEyLCAtMjUuMDRdXG4gKiAgICAgICAgICAgIF0sXG4gKiAgICAgICAgICAgIFtcbiAqICAgICAgICAgICAgICBbMTM3LjUwLCAtMjYuNTRdLCBbMTM2Ljk3LCAtMjYuNDddLCBbMTM2LjQ5LCAtMjYuNThdLCBbMTM2LjMxLCAtMjcuMTNdLCBbMTM2LjMxLCAtMjcuNzJdLFxuICogICAgICAgICAgICAgIFsxMzYuNTgsIC0yNy45OV0sIFsxMzcuNTAsIC0yOC4wM10sIFsxMzcuNjgsIC0yNy42OF0sIFsxMzcuNTksIC0yNi43OF0sIFsxMzcuNTAsIC0yNi41NF1cbiAqICAgICAgICAgICAgXVxuICogICAgICAgICAgXVxuICogICAgICAgIH1cbiAqICAgICAgfSxcbiAqICAgICAge1xuICogICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAqICAgICAgICBcInByb3BlcnRpZXNcIjoge1xuICogICAgICAgICAgXCJsZXR0ZXJcIjogXCJsXCIsXG4gKiAgICAgICAgICBcImNvbG9yXCI6IFwiZ3JlZW5cIixcbiAqICAgICAgICAgIFwicmFua1wiOiBcIjEyXCIsXG4gKiAgICAgICAgICBcImFzY2lpXCI6IFwiMTA4XCJcbiAqICAgICAgICB9LFxuICogICAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICogICAgICAgICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuICogICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gKiAgICAgICAgICAgIFtcbiAqICAgICAgICAgICAgICBbMTQwLjE0LCAtMjEuMDRdLCBbMTQwLjMxLCAtMjkuNDJdLCBbMTQxLjY3LCAtMjkuNDldLCBbMTQxLjU5LCAtMjAuOTJdLCBbMTQwLjE0LCAtMjEuMDRdXG4gKiAgICAgICAgICAgIF1cbiAqICAgICAgICAgIF1cbiAqICAgICAgICB9XG4gKiAgICAgIH0sXG4gKiAgICAgIHtcbiAqICAgICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gKiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAqICAgICAgICAgIFwibGV0dGVyXCI6IFwiZVwiLFxuICogICAgICAgICAgXCJjb2xvclwiOiBcInJlZFwiLFxuICogICAgICAgICAgXCJyYW5rXCI6IFwiNVwiLFxuICogICAgICAgICAgXCJhc2NpaVwiOiBcIjEwMVwiXG4gKiAgICAgICAgfSxcbiAqICAgICAgICBcImdlb21ldHJ5XCI6IHtcbiAqICAgICAgICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbiAqICAgICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICogICAgICAgICAgICBbXG4gKiAgICAgICAgICAgICAgWzE0NC4xNCwgLTI3LjQxXSwgWzE0NS42NywgLTI3LjUyXSwgWzE0Ni44NiwgLTI3LjA5XSwgWzE0Ni44MiwgLTI1LjY0XSwgWzE0Ni4yNSwgLTI1LjA0XSxcbiAqICAgICAgICAgICAgICBbMTQ1LjQ1LCAtMjQuNjhdLCBbMTQ0LjY2LCAtMjQuNjBdLCBbMTQ0LjA5LCAtMjQuNzZdLCBbMTQzLjQzLCAtMjUuMDhdLCBbMTQyLjk5LCAtMjUuNDBdLFxuICogICAgICAgICAgICAgIFsxNDIuNjQsIC0yNi4wM10sIFsxNDIuNjQsIC0yNy4wNV0sIFsxNDIuNjQsIC0yOC4yNl0sIFsxNDMuMzAsIC0yOS4xMV0sIFsxNDQuMTgsIC0yOS41N10sXG4gKiAgICAgICAgICAgICAgWzE0NS40MSwgLTI5LjY0XSwgWzE0Ni40NiwgLTI5LjE5XSwgWzE0Ni42NCwgLTI4LjcyXSwgWzE0Ni44MiwgLTI4LjE0XSwgWzE0NC44NCwgLTI4LjQyXSxcbiAqICAgICAgICAgICAgICBbMTQ0LjMxLCAtMjguMjZdLCBbMTQ0LjE0LCAtMjcuNDFdXG4gKiAgICAgICAgICAgIF0sXG4gKiAgICAgICAgICAgIFtcbiAqICAgICAgICAgICAgICBbMTQ0LjE4LCAtMjYuMzldLCBbMTQ0LjUzLCAtMjYuNThdLCBbMTQ1LjE5LCAtMjYuNjJdLCBbMTQ1LjcyLCAtMjYuMzVdLCBbMTQ1LjgxLCAtMjUuOTFdLFxuICogICAgICAgICAgICAgIFsxNDUuNDEsIC0yNS42OF0sIFsxNDQuOTcsIC0yNS42OF0sIFsxNDQuNDksIC0yNS42NF0sIFsxNDQsIC0yNS45OV0sIFsxNDQuMTgsIC0yNi4zOV1cbiAqICAgICAgICAgICAgXVxuICogICAgICAgICAgXVxuICogICAgICAgIH1cbiAqICAgICAgfVxuICogICAgXVxuICogIH07XG4gKiB9XG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnYWdtLWRhdGEtbGF5ZXInLFxufSlcbmV4cG9ydCBjbGFzcyBBZ21EYXRhTGF5ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBzdGF0aWMgX2RhdGFPcHRpb25zQXR0cmlidXRlczogQXJyYXk8c3RyaW5nPiA9IFsnc3R5bGUnXTtcblxuICBwcml2YXRlIF9hZGRlZFRvTWFuYWdlciA9IGZhbHNlO1xuICBwcml2YXRlIF9pZDogc3RyaW5nID0gKGxheWVySWQrKykudG9TdHJpbmcoKTtcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIGEgZmVhdHVyZSBpbiB0aGUgbGF5ZXIgaXMgY2xpY2tlZC5cbiAgICovXG4gIEBPdXRwdXQoKSBsYXllckNsaWNrOiBFdmVudEVtaXR0ZXI8RGF0YU1vdXNlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEYXRhTW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhlIGdlb0pzb24gdG8gYmUgZGlzcGxheWVkXG4gICAqL1xuICBASW5wdXQoKSBnZW9Kc29uOiBPYmplY3QgfCBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogVGhlIGxheWVyJ3Mgc3R5bGUgZnVuY3Rpb24uXG4gICAqL1xuICBASW5wdXQoKSBzdHlsZTogKCkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tYW5hZ2VyOiBEYXRhTGF5ZXJNYW5hZ2VyKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fYWRkZWRUb01hbmFnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fbWFuYWdlci5hZGREYXRhTGF5ZXIodGhpcyk7XG4gICAgdGhpcy5fYWRkZWRUb01hbmFnZXIgPSB0cnVlO1xuICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcml2YXRlIF9hZGRFdmVudExpc3RlbmVycygpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSBbXG4gICAgICB7IG5hbWU6ICdjbGljaycsIGhhbmRsZXI6IChldjogRGF0YU1vdXNlRXZlbnQpID0+IHRoaXMubGF5ZXJDbGljay5lbWl0KGV2KSB9LFxuICAgIF07XG4gICAgbGlzdGVuZXJzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgY29uc3Qgb3MgPSB0aGlzLl9tYW5hZ2VyLmNyZWF0ZUV2ZW50T2JzZXJ2YWJsZShvYmoubmFtZSwgdGhpcykuc3Vic2NyaWJlKG9iai5oYW5kbGVyKTtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChvcyk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pZDsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIGBBZ21EYXRhTGF5ZXItJHt0aGlzLl9pZC50b1N0cmluZygpfWA7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX21hbmFnZXIuZGVsZXRlRGF0YUxheWVyKHRoaXMpO1xuICAgIC8vIHVuc3Vic2NyaWJlIGFsbCByZWdpc3RlcmVkIG9ic2VydmFibGUgc3Vic2NyaXB0aW9uc1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaChzID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoIXRoaXMuX2FkZGVkVG9NYW5hZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGdlb0pzb25DaGFuZ2UgPSBjaGFuZ2VzWydnZW9Kc29uJ107XG4gICAgaWYgKGdlb0pzb25DaGFuZ2UpIHtcbiAgICAgIHRoaXMuX21hbmFnZXIudXBkYXRlR2VvSnNvbih0aGlzLCBnZW9Kc29uQ2hhbmdlLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGRhdGFPcHRpb25zOiBEYXRhT3B0aW9ucyA9IHt9O1xuXG4gICAgQWdtRGF0YUxheWVyLl9kYXRhT3B0aW9uc0F0dHJpYnV0ZXMuZm9yRWFjaChrID0+IChkYXRhT3B0aW9ucyBhcyBhbnkpW2tdID0gY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShrKSA/IGNoYW5nZXNba10uY3VycmVudFZhbHVlIDogKHRoaXMgYXMgYW55KVtrXSk7XG5cbiAgICB0aGlzLl9tYW5hZ2VyLnNldERhdGFPcHRpb25zKHRoaXMsIGRhdGFPcHRpb25zKTtcbiAgfVxufVxuIl19