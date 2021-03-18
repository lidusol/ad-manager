import * as tslib_1 from "tslib";
import { Directive, EventEmitter, Input, Output, } from '@angular/core';
import { RectangleManager } from '../services/managers/rectangle-manager';
import * as ɵngcc0 from '@angular/core';
var AgmRectangle = /** @class */ (function () {
    function AgmRectangle(_manager) {
        this._manager = _manager;
        /**
         * Indicates whether this Rectangle handles mouse events. Defaults to true.
         */
        this.clickable = true;
        /**
         * If set to true, the user can drag this rectangle over the map. Defaults to false.
         */
        // tslint:disable-next-line:no-input-rename
        this.draggable = false;
        /**
         * If set to true, the user can edit this rectangle by dragging the control points shown at
         * the center and around the circumference of the rectangle. Defaults to false.
         */
        this.editable = false;
        /**
         * The stroke position. Defaults to CENTER.
         * This property is not supported on Internet Explorer 8 and earlier.
         */
        this.strokePosition = 'CENTER';
        /**
         * The stroke width in pixels.
         */
        this.strokeWeight = 0;
        /**
         * Whether this rectangle is visible on the map. Defaults to true.
         */
        this.visible = true;
        /**
         * This event is fired when the rectangle's is changed.
         */
        this.boundsChange = new EventEmitter();
        /**
         * This event emitter gets emitted when the user clicks on the rectangle.
         */
        this.rectangleClick = new EventEmitter();
        /**
         * This event emitter gets emitted when the user clicks on the rectangle.
         */
        this.rectangleDblClick = new EventEmitter();
        /**
         * This event is repeatedly fired while the user drags the rectangle.
         */
        this.drag = new EventEmitter();
        /**
         * This event is fired when the user stops dragging the rectangle.
         */
        this.dragEnd = new EventEmitter();
        /**
         * This event is fired when the user starts dragging the rectangle.
         */
        this.dragStart = new EventEmitter();
        /**
         * This event is fired when the DOM mousedown event is fired on the rectangle.
         */
        this.mouseDown = new EventEmitter();
        /**
         * This event is fired when the DOM mousemove event is fired on the rectangle.
         */
        this.mouseMove = new EventEmitter();
        /**
         * This event is fired on rectangle mouseout.
         */
        this.mouseOut = new EventEmitter();
        /**
         * This event is fired on rectangle mouseover.
         */
        this.mouseOver = new EventEmitter();
        /**
         * This event is fired when the DOM mouseup event is fired on the rectangle.
         */
        this.mouseUp = new EventEmitter();
        /**
         * This event is fired when the rectangle is right-clicked on.
         */
        this.rightClick = new EventEmitter();
        this._rectangleAddedToManager = false;
        this._eventSubscriptions = [];
    }
    AgmRectangle_1 = AgmRectangle;
    /** @internal */
    AgmRectangle.prototype.ngOnInit = function () {
        this._manager.addRectangle(this);
        this._rectangleAddedToManager = true;
        this._registerEventListeners();
    };
    /** @internal */
    AgmRectangle.prototype.ngOnChanges = function (changes) {
        if (!this._rectangleAddedToManager) {
            return;
        }
        if (changes['north'] ||
            changes['east'] ||
            changes['south'] ||
            changes['west']) {
            this._manager.setBounds(this);
        }
        if (changes['editable']) {
            this._manager.setEditable(this);
        }
        if (changes['draggable']) {
            this._manager.setDraggable(this);
        }
        if (changes['visible']) {
            this._manager.setVisible(this);
        }
        this._updateRectangleOptionsChanges(changes);
    };
    AgmRectangle.prototype._updateRectangleOptionsChanges = function (changes) {
        var options = {};
        var optionKeys = Object.keys(changes).filter(function (k) { return AgmRectangle_1._mapOptions.indexOf(k) !== -1; });
        optionKeys.forEach(function (k) {
            options[k] = changes[k].currentValue;
        });
        if (optionKeys.length > 0) {
            this._manager.setOptions(this, options);
        }
    };
    AgmRectangle.prototype._registerEventListeners = function () {
        var _this = this;
        var events = new Map();
        events.set('bounds_changed', this.boundsChange);
        events.set('click', this.rectangleClick);
        events.set('dblclick', this.rectangleDblClick);
        events.set('drag', this.drag);
        events.set('dragend', this.dragEnd);
        events.set('dragStart', this.dragStart);
        events.set('mousedown', this.mouseDown);
        events.set('mousemove', this.mouseMove);
        events.set('mouseout', this.mouseOut);
        events.set('mouseover', this.mouseOver);
        events.set('mouseup', this.mouseUp);
        events.set('rightclick', this.rightClick);
        events.forEach(function (eventEmitter, eventName) {
            _this._eventSubscriptions.push(_this._manager
                .createEventObservable(eventName, _this)
                .subscribe(function (value) {
                switch (eventName) {
                    case 'bounds_changed':
                        _this._manager.getBounds(_this).then(function (bounds) {
                            return eventEmitter.emit({
                                north: bounds.getNorthEast().lat(),
                                east: bounds.getNorthEast().lng(),
                                south: bounds.getSouthWest().lat(),
                                west: bounds.getSouthWest().lng(),
                            });
                        });
                        break;
                    default:
                        eventEmitter.emit({
                            coords: { lat: value.latLng.lat(), lng: value.latLng.lng() },
                        });
                }
            }));
        });
    };
    /** @internal */
    AgmRectangle.prototype.ngOnDestroy = function () {
        this._eventSubscriptions.forEach(function (s) {
            s.unsubscribe();
        });
        this._eventSubscriptions = null;
        this._manager.removeRectangle(this);
    };
    /**
     * Gets the LatLngBounds of this Rectangle.
     */
    AgmRectangle.prototype.getBounds = function () {
        return this._manager.getBounds(this);
    };
    var AgmRectangle_1;
    AgmRectangle._mapOptions = [
        'fillColor',
        'fillOpacity',
        'strokeColor',
        'strokeOpacity',
        'strokePosition',
        'strokeWeight',
        'visible',
        'zIndex',
        'clickable',
    ];
    AgmRectangle.ctorParameters = function () { return [
        { type: RectangleManager }
    ]; };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmRectangle.prototype, "north", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmRectangle.prototype, "east", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmRectangle.prototype, "south", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmRectangle.prototype, "west", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmRectangle.prototype, "clickable", void 0);
    tslib_1.__decorate([
        Input('rectangleDraggable'),
        tslib_1.__metadata("design:type", Object)
    ], AgmRectangle.prototype, "draggable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmRectangle.prototype, "editable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AgmRectangle.prototype, "fillColor", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmRectangle.prototype, "fillOpacity", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AgmRectangle.prototype, "strokeColor", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmRectangle.prototype, "strokeOpacity", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AgmRectangle.prototype, "strokePosition", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmRectangle.prototype, "strokeWeight", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], AgmRectangle.prototype, "visible", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], AgmRectangle.prototype, "zIndex", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "boundsChange", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "rectangleClick", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "rectangleDblClick", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "drag", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "dragEnd", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "dragStart", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "mouseDown", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "mouseMove", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "mouseOut", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "mouseOver", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "mouseUp", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], AgmRectangle.prototype, "rightClick", void 0);
    AgmRectangle = AgmRectangle_1 = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [RectangleManager])
    ], AgmRectangle);
AgmRectangle.ɵfac = function AgmRectangle_Factory(t) { return new (t || AgmRectangle)(ɵngcc0.ɵɵdirectiveInject(RectangleManager)); };
AgmRectangle.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: AgmRectangle, selectors: [["agm-rectangle"]], inputs: { clickable: "clickable", draggable: ["rectangleDraggable", "draggable"], editable: "editable", strokePosition: "strokePosition", strokeWeight: "strokeWeight", visible: "visible", north: "north", east: "east", south: "south", west: "west", fillColor: "fillColor", fillOpacity: "fillOpacity", strokeColor: "strokeColor", strokeOpacity: "strokeOpacity", zIndex: "zIndex" }, outputs: { boundsChange: "boundsChange", rectangleClick: "rectangleClick", rectangleDblClick: "rectangleDblClick", drag: "drag", dragEnd: "dragEnd", dragStart: "dragStart", mouseDown: "mouseDown", mouseMove: "mouseMove", mouseOut: "mouseOut", mouseOver: "mouseOver", mouseUp: "mouseUp", rightClick: "rightClick" }, features: [ɵngcc0.ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmRectangle, [{
        type: Directive,
        args: [{
                selector: 'agm-rectangle'
            }]
    }], function () { return [{ type: RectangleManager }]; }, { clickable: [{
            type: Input
        }], draggable: [{
            type: Input,
            args: ['rectangleDraggable']
        }], editable: [{
            type: Input
        }], strokePosition: [{
            type: Input
        }], strokeWeight: [{
            type: Input
        }], visible: [{
            type: Input
        }], boundsChange: [{
            type: Output
        }], rectangleClick: [{
            type: Output
        }], rectangleDblClick: [{
            type: Output
        }], drag: [{
            type: Output
        }], dragEnd: [{
            type: Output
        }], dragStart: [{
            type: Output
        }], mouseDown: [{
            type: Output
        }], mouseMove: [{
            type: Output
        }], mouseOut: [{
            type: Output
        }], mouseOver: [{
            type: Output
        }], mouseUp: [{
            type: Output
        }], rightClick: [{
            type: Output
        }], north: [{
            type: Input
        }], east: [{
            type: Input
        }], south: [{
            type: Input
        }], west: [{
            type: Input
        }], fillColor: [{
            type: Input
        }], fillOpacity: [{
            type: Input
        }], strokeColor: [{
            type: Input
        }], strokeOpacity: [{
            type: Input
        }], zIndex: [{
            type: Input
        }] }); })();
    return AgmRectangle;
}());
export { AgmRectangle };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlLmpzIiwic291cmNlcyI6WyJuZzovQGFnbS9jb3JlL2RpcmVjdGl2ZXMvcmVjdGFuZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBSUwsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBUXZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDOztBQUsxRTtBQUFnRCxJQXFLOUMsc0JBQW9CLFFBQTBCO0FBQUksUUFBOUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7QUFBQyxRQWhKL0M7QUFDRjtBQUVBLFdBREs7QUFDTCxRQUFXLGNBQVMsR0FBRyxJQUFJLENBQUM7QUFDNUIsUUFDRTtBQUNGO0FBRUEsV0FESztBQUNMLFFBQUUsMkNBQTJDO0FBQzdDLFFBQStCLGNBQVMsR0FBRyxLQUFLLENBQUM7QUFDakQsUUFDRTtBQUNGO0FBQ007QUFFQSxXQUREO0FBQ0wsUUFBVyxhQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzVCLFFBcUJFO0FBQ0Y7QUFDTTtBQUVBLFdBREQ7QUFDTCxRQUFXLG1CQUFjLEdBQW9DLFFBQVEsQ0FBQztBQUN0RSxRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBVyxpQkFBWSxHQUFHLENBQUMsQ0FBQztBQUM1QixRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBVyxZQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBTUU7QUFDRjtBQUVBLFdBREs7QUFDTCxRQUNFLGlCQUFZLEdBQXNDLElBQUksWUFBWSxFQUUvRCxDQUFDO0FBQ04sUUFDRTtBQUNGO0FBRUEsV0FESztBQUNMLFFBQ0UsbUJBQWMsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztBQUM1RSxRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFDRSxzQkFBaUIsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztBQUMvRSxRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBWSxTQUFJLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7QUFDNUUsUUFDRTtBQUNGO0FBRUEsV0FESztBQUNMLFFBQVksWUFBTyxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO0FBQy9FLFFBQ0U7QUFDRjtBQUVBLFdBREs7QUFDTCxRQUNFLGNBQVMsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztBQUN2RSxRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFDRSxjQUFTLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7QUFDdkUsUUFDRTtBQUNGO0FBRUEsV0FESztBQUNMLFFBQ0UsY0FBUyxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO0FBQ3ZFLFFBQ0U7QUFDRjtBQUVBLFdBREs7QUFDTCxRQUFZLGFBQVEsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztBQUNoRixRQUNFO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFDRSxjQUFTLEdBQTZCLElBQUksWUFBWSxFQUFjLENBQUM7QUFDdkUsUUFDRTtBQUNGO0FBRUEsV0FESztBQUNMLFFBQVksWUFBTyxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO0FBQy9FLFFBQ0U7QUFDRjtBQUVBLFdBREs7QUFDTCxRQUNFLGVBQVUsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztBQUN4RSxRQUNVLDZCQUF3QixHQUFHLEtBQUssQ0FBQztBQUMzQyxRQWFVLHdCQUFtQixHQUFtQixFQUFFLENBQUM7QUFDbkQsSUFDbUQsQ0FBQztBQUNwRCxxQkF0S2EsWUFBWTtBQUFFLElBdUt6QixnQkFBZ0I7QUFDbEIsSUFBRSwrQkFBUSxHQUFSO0FBQ0QsUUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxRQUFJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7QUFDekMsUUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUNuQyxJQUFFLENBQUM7QUFFSCxJQUFFLGdCQUFnQjtBQUNsQixJQUFFLGtDQUFXLEdBQVgsVUFBWSxPQUF3QztBQUN0RCxRQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUU7QUFDeEMsWUFBTSxPQUFPO0FBQ2IsU0FBSztBQUNMLFFBQUksSUFDRSxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3RCLFlBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNyQixZQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDdEIsWUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ2Y7QUFDTixZQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLFNBQUs7QUFDTCxRQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzdCLFlBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsU0FBSztBQUNMLFFBQUksSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDOUIsWUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxTQUFLO0FBQ0wsUUFBSSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUM1QixZQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLFNBQUs7QUFDTCxRQUFJLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRCxJQUFFLENBQUM7QUFFSCxJQUFVLHFEQUE4QixHQUF0QyxVQUF1QyxPQUV0QztBQUNILFFBQUksSUFBSSxPQUFPLEdBQWdDLEVBQUUsQ0FBQztBQUNsRCxRQUFJLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUMxQyxVQUFBLENBQUMsSUFBSSxPQUFBLGNBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUExQyxDQUEwQyxDQUNoRCxDQUFDO0FBQ04sUUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztBQUFJLFlBQ3RCLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQzNDLFFBQUksQ0FBQyxDQUFDLENBQUM7QUFDUCxRQUFJLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDL0IsWUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDOUMsU0FBSztBQUNMLElBQUUsQ0FBQztBQUVILElBQVUsOENBQXVCLEdBQS9CO0FBQWMsUUFBZCxpQkEwQ0M7QUFDSCxRQTFDSSxJQUFJLE1BQU0sR0FBbUMsSUFBSSxHQUFHLEVBR2pELENBQUM7QUFDUixRQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BELFFBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzdDLFFBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbkQsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsUUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDOUMsUUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsWUFBWSxFQUFFLFNBQVM7QUFBSSxZQUN6QyxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUMzQixLQUFJLENBQUMsUUFBUTtBQUNyQixpQkFBVyxxQkFBcUIsQ0FBZ0IsU0FBUyxFQUFFLEtBQUksQ0FBQztBQUNoRSxpQkFBVyxTQUFTLENBQUMsVUFBQSxLQUFLO0FBQUksZ0JBQ2xCLFFBQVEsU0FBUyxFQUFFO0FBQy9CLG9CQUFjLEtBQUssZ0JBQWdCO0FBQ25DLHdCQUFnQixLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO0FBQ3pELDRCQUFrQixPQUFBLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFDcEMsZ0NBQW9CLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxFQUFFO0FBQ3RELGdDQUFvQixJQUFJLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsRUFBRTtBQUNyRCxnQ0FBb0IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUU7QUFDdEQsZ0NBQW9CLElBQUksRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxFQUFFO0FBQ3JELDZCQUEwQyxDQUFDO0FBQzNDLHdCQU5rQixDQUt5QixDQUMxQixDQUFDO0FBQ2xCLHdCQUFnQixNQUFNO0FBQ3RCLG9CQUFjO0FBQ2Qsd0JBQWdCLFlBQVksQ0FBQyxJQUFJLENBQUM7QUFDbEMsNEJBQWtCLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFO0FBQzlFLHlCQUErQixDQUFDLENBQUM7QUFDakMsaUJBQWE7QUFDYixZQUFVLENBQUMsQ0FBQyxDQUNMLENBQUM7QUFDUixRQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ1AsSUFBRSxDQUFDO0FBRUgsSUFBRSxnQkFBZ0I7QUFDbEIsSUFBRSxrQ0FBVyxHQUFYO0FBQWMsUUFDWixJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBZTtBQUM3RCxZQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ1AsUUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLFFBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsSUFBRSxDQUFDO0FBRUgsSUFBRTtBQUNGO0FBQ0UsT0FBRztBQUNMLElBQUUsZ0NBQVMsR0FBVDtBQUFjLFFBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxJQUFFLENBQUM7QUFDRjtBQUNzQixJQTNITix3QkFBVyxHQUFhO0FBQ3pDLFFBQUksV0FBVztBQUNmLFFBQUksYUFBYTtBQUNqQixRQUFJLGFBQWE7QUFDakIsUUFBSSxlQUFlO0FBQ25CLFFBQUksZ0JBQWdCO0FBQ3BCLFFBQUksY0FBYztBQUNsQixRQUFJLFNBQVM7QUFDYixRQUFJLFFBQVE7QUFDWixRQUFJLFdBQVc7QUFDZixLQUFHLENBQUM7QUFDSjtBQUdHLGdCQUE2QixnQkFBZ0I7QUFBRztBQUU1QyxJQW5LSTtBQUVOLFFBRkYsS0FBSyxFQUFFO0FBQUU7QUFHaUIsK0NBSEo7QUFFekIsSUFHVztBQUdYLFFBSEcsS0FBSyxFQUFFO0FBQUU7QUFHa0IsOENBSE47QUFFeEIsSUFHVztBQUVOLFFBRkYsS0FBSyxFQUFFO0FBQUU7QUFHaUIsK0NBSEo7QUFFekIsSUFHVztBQUdYLFFBSEcsS0FBSyxFQUFFO0FBQUU7QUFHa0IsOENBSE47QUFFeEIsSUFHVztBQUVULFFBRkMsS0FBSyxFQUFFO0FBQUU7QUFHYyxtREFIRTtBQUU1QixJQUkrQjtBQUU5QixRQUZFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztBQUFFO0FBR1AsbURBSHdCO0FBRWpELElBSVc7QUFFVCxRQUZDLEtBQUssRUFBRTtBQUFFO0FBR2Msa0RBSEU7QUFFNUIsSUFHVztBQUVWLFFBRkUsS0FBSyxFQUFFO0FBQUU7QUFHYSxtREFISTtBQUU3QixJQUdXO0FBQ1gsUUFERyxLQUFLLEVBQUU7QUFBRTtBQUdXLHFEQUhRO0FBRS9CLElBR1c7QUFDWCxRQURHLEtBQUssRUFBRTtBQUFFO0FBR1cscURBSFE7QUFFL0IsSUFHVztBQUFxQixRQUE3QixLQUFLLEVBQUU7QUFBRTtBQUdTLHVEQUhZO0FBRWpDLElBSVc7QUFBcUIsUUFBN0IsS0FBSyxFQUFFO0FBQUU7QUFBa0Qsd0RBQVE7QUFFdEUsSUFHVztBQUVULFFBRkMsS0FBSyxFQUFFO0FBQUU7QUFHYyxzREFIRTtBQUU1QixJQUdXO0FBRVAsUUFGRCxLQUFLLEVBQUU7QUFBRTtBQUdnQixpREFIRjtBQUUxQixJQUdXO0FBRVAsUUFGRCxLQUFLLEVBQUU7QUFBRTtBQUdnQixnREFIRjtBQUUxQixJQUlFO0FBQXFCLFFBRHBCLE1BQU0sRUFBRTtBQUNWLDBDQUFlLFlBQVk7QUFBRSxzREFFeEI7QUFFTixJQUlFO0FBQXFCLFFBRHBCLE1BQU0sRUFBRTtBQUNWLDBDQUFpQixZQUFZO0FBQUUsd0RBQTRDO0FBRTVFLElBSUU7QUFBcUIsUUFEcEIsTUFBTSxFQUFFO0FBQ1YsMENBQW9CLFlBQVk7QUFBRSwyREFBNEM7QUFFL0UsSUFHWTtBQUFxQixRQUE5QixNQUFNLEVBQUU7QUFBRSwwQ0FBSyxZQUFZO0FBQUUsOENBQTRDO0FBRTVFLElBR1k7QUFBcUIsUUFBOUIsTUFBTSxFQUFFO0FBQUUsMENBQVEsWUFBWTtBQUFFLGlEQUE0QztBQUUvRSxJQUlFO0FBQXFCLFFBRHBCLE1BQU0sRUFBRTtBQUNWLDBDQUFZLFlBQVk7QUFBRSxtREFBNEM7QUFFdkUsSUFJRTtBQUFxQixRQURwQixNQUFNLEVBQUU7QUFDViwwQ0FBWSxZQUFZO0FBQUUsbURBQTRDO0FBRXZFLElBSUU7QUFBcUIsUUFEcEIsTUFBTSxFQUFFO0FBQ1YsMENBQVksWUFBWTtBQUFFLG1EQUE0QztBQUV2RSxJQUdZO0FBQXFCLFFBQTlCLE1BQU0sRUFBRTtBQUFFLDBDQUFTLFlBQVk7QUFBRSxrREFBNEM7QUFFaEYsSUFJRTtBQUFxQixRQURwQixNQUFNLEVBQUU7QUFDViwwQ0FBWSxZQUFZO0FBQUUsbURBQTRDO0FBRXZFLElBR1k7QUFBcUIsUUFBOUIsTUFBTSxFQUFFO0FBQUUsMENBQVEsWUFBWTtBQUFFLGlEQUE0QztBQUUvRSxJQUlFO0FBQXFCLFFBRHBCLE1BQU0sRUFBRTtBQUNWLDBDQUFhLFlBQVk7QUFBRSxvREFBNEM7QUFFeEUsSUFySmEsWUFBWSxpREFIeEIsU0FBUyxDQUFDLGNBQ1QsUUFBUSxFQUFFLGVBQWUsMURBRW5CLDBDQXFLd0IsZ0JBQWdCO1FBdEsvQyxDQUFDLFRBc0tpRCxPQXJLdEMsWUFBWSxDQWlSeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFDRDtBQUFDLElBREQsbUJBQUM7QUFDQSxDQURBLEFBalJELElBaVJDO0FBQ0QsU0FsUmEsWUFBWTtBQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE1vdXNlRXZlbnQgfSBmcm9tICcuLi9tYXAtdHlwZXMnO1xuaW1wb3J0IHtcbiAgTGF0TG5nQm91bmRzLFxuICBMYXRMbmdCb3VuZHNMaXRlcmFsLFxuICBNb3VzZUV2ZW50IGFzIE1hcE1vdXNlRXZlbnQsXG59IGZyb20gJy4uL3NlcnZpY2VzL2dvb2dsZS1tYXBzLXR5cGVzJztcbmltcG9ydCB7IFJlY3RhbmdsZU1hbmFnZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9tYW5hZ2Vycy9yZWN0YW5nbGUtbWFuYWdlcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2FnbS1yZWN0YW5nbGUnLFxufSlcbmV4cG9ydCBjbGFzcyBBZ21SZWN0YW5nbGUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFRoZSBub3J0aCBwb3NpdGlvbiBvZiB0aGUgcmVjdGFuZ2xlIChyZXF1aXJlZCkuXG4gICAqL1xuICBASW5wdXQoKSBub3J0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZWFzdCBwb3NpdGlvbiBvZiB0aGUgcmVjdGFuZ2xlIChyZXF1aXJlZCkuXG4gICAqL1xuICBASW5wdXQoKSBlYXN0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzb3V0aCBwb3NpdGlvbiBvZiB0aGUgcmVjdGFuZ2xlIChyZXF1aXJlZCkuXG4gICAqL1xuICBASW5wdXQoKSBzb3V0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgd2VzdCBwb3NpdGlvbiBvZiB0aGUgcmVjdGFuZ2xlIChyZXF1aXJlZCkuXG4gICAqL1xuICBASW5wdXQoKSB3ZXN0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoaXMgUmVjdGFuZ2xlIGhhbmRsZXMgbW91c2UgZXZlbnRzLiBEZWZhdWx0cyB0byB0cnVlLlxuICAgKi9cbiAgQElucHV0KCkgY2xpY2thYmxlID0gdHJ1ZTtcblxuICAvKipcbiAgICogSWYgc2V0IHRvIHRydWUsIHRoZSB1c2VyIGNhbiBkcmFnIHRoaXMgcmVjdGFuZ2xlIG92ZXIgdGhlIG1hcC4gRGVmYXVsdHMgdG8gZmFsc2UuXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5wdXQtcmVuYW1lXG4gIEBJbnB1dCgncmVjdGFuZ2xlRHJhZ2dhYmxlJykgZHJhZ2dhYmxlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIElmIHNldCB0byB0cnVlLCB0aGUgdXNlciBjYW4gZWRpdCB0aGlzIHJlY3RhbmdsZSBieSBkcmFnZ2luZyB0aGUgY29udHJvbCBwb2ludHMgc2hvd24gYXRcbiAgICogdGhlIGNlbnRlciBhbmQgYXJvdW5kIHRoZSBjaXJjdW1mZXJlbmNlIG9mIHRoZSByZWN0YW5nbGUuIERlZmF1bHRzIHRvIGZhbHNlLlxuICAgKi9cbiAgQElucHV0KCkgZWRpdGFibGUgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGZpbGwgY29sb3IuIEFsbCBDU1MzIGNvbG9ycyBhcmUgc3VwcG9ydGVkIGV4Y2VwdCBmb3IgZXh0ZW5kZWQgbmFtZWQgY29sb3JzLlxuICAgKi9cbiAgQElucHV0KCkgZmlsbENvbG9yOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBmaWxsIG9wYWNpdHkgYmV0d2VlbiAwLjAgYW5kIDEuMC5cbiAgICovXG4gIEBJbnB1dCgpIGZpbGxPcGFjaXR5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJva2UgY29sb3IuIEFsbCBDU1MzIGNvbG9ycyBhcmUgc3VwcG9ydGVkIGV4Y2VwdCBmb3IgZXh0ZW5kZWQgbmFtZWQgY29sb3JzLlxuICAgKi9cbiAgQElucHV0KCkgc3Ryb2tlQ29sb3I6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN0cm9rZSBvcGFjaXR5IGJldHdlZW4gMC4wIGFuZCAxLjBcbiAgICovXG4gIEBJbnB1dCgpIHN0cm9rZU9wYWNpdHk6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHN0cm9rZSBwb3NpdGlvbi4gRGVmYXVsdHMgdG8gQ0VOVEVSLlxuICAgKiBUaGlzIHByb3BlcnR5IGlzIG5vdCBzdXBwb3J0ZWQgb24gSW50ZXJuZXQgRXhwbG9yZXIgOCBhbmQgZWFybGllci5cbiAgICovXG4gIEBJbnB1dCgpIHN0cm9rZVBvc2l0aW9uOiAnQ0VOVEVSJyB8ICdJTlNJREUnIHwgJ09VVFNJREUnID0gJ0NFTlRFUic7XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJva2Ugd2lkdGggaW4gcGl4ZWxzLlxuICAgKi9cbiAgQElucHV0KCkgc3Ryb2tlV2VpZ2h0ID0gMDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHJlY3RhbmdsZSBpcyB2aXNpYmxlIG9uIHRoZSBtYXAuIERlZmF1bHRzIHRvIHRydWUuXG4gICAqL1xuICBASW5wdXQoKSB2aXNpYmxlID0gdHJ1ZTtcblxuICAvKipcbiAgICogVGhlIHpJbmRleCBjb21wYXJlZCB0byBvdGhlciBwb2x5cy5cbiAgICovXG4gIEBJbnB1dCgpIHpJbmRleDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHJlY3RhbmdsZSdzIGlzIGNoYW5nZWQuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgYm91bmRzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TGF0TG5nQm91bmRzTGl0ZXJhbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIExhdExuZ0JvdW5kc0xpdGVyYWxcbiAgPigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGVtaXR0ZXIgZ2V0cyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIHRoZSByZWN0YW5nbGUuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmVjdGFuZ2xlQ2xpY2s6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBlbWl0dGVyIGdldHMgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgcmVjdGFuZ2xlLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHJlY3RhbmdsZURibENsaWNrOiBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgcmVwZWF0ZWRseSBmaXJlZCB3aGlsZSB0aGUgdXNlciBkcmFncyB0aGUgcmVjdGFuZ2xlLlxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIHN0b3BzIGRyYWdnaW5nIHRoZSByZWN0YW5nbGUuXG4gICAqL1xuICBAT3V0cHV0KCkgZHJhZ0VuZDogRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHVzZXIgc3RhcnRzIGRyYWdnaW5nIHRoZSByZWN0YW5nbGUuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgRE9NIG1vdXNlZG93biBldmVudCBpcyBmaXJlZCBvbiB0aGUgcmVjdGFuZ2xlLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1vdXNlRG93bjogRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIERPTSBtb3VzZW1vdmUgZXZlbnQgaXMgZmlyZWQgb24gdGhlIHJlY3RhbmdsZS5cbiAgICovXG4gIEBPdXRwdXQoKVxuICBtb3VzZU1vdmU6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCBvbiByZWN0YW5nbGUgbW91c2VvdXQuXG4gICAqL1xuICBAT3V0cHV0KCkgbW91c2VPdXQ6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCBvbiByZWN0YW5nbGUgbW91c2VvdmVyLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1vdXNlT3ZlcjogRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIERPTSBtb3VzZXVwIGV2ZW50IGlzIGZpcmVkIG9uIHRoZSByZWN0YW5nbGUuXG4gICAqL1xuICBAT3V0cHV0KCkgbW91c2VVcDogRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHJlY3RhbmdsZSBpcyByaWdodC1jbGlja2VkIG9uLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHJpZ2h0Q2xpY2s6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICBwcml2YXRlIF9yZWN0YW5nbGVBZGRlZFRvTWFuYWdlciA9IGZhbHNlO1xuXG4gIHByaXZhdGUgc3RhdGljIF9tYXBPcHRpb25zOiBzdHJpbmdbXSA9IFtcbiAgICAnZmlsbENvbG9yJyxcbiAgICAnZmlsbE9wYWNpdHknLFxuICAgICdzdHJva2VDb2xvcicsXG4gICAgJ3N0cm9rZU9wYWNpdHknLFxuICAgICdzdHJva2VQb3NpdGlvbicsXG4gICAgJ3N0cm9rZVdlaWdodCcsXG4gICAgJ3Zpc2libGUnLFxuICAgICd6SW5kZXgnLFxuICAgICdjbGlja2FibGUnLFxuICBdO1xuXG4gIHByaXZhdGUgX2V2ZW50U3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tYW5hZ2VyOiBSZWN0YW5nbGVNYW5hZ2VyKSB7fVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbWFuYWdlci5hZGRSZWN0YW5nbGUodGhpcyk7XG4gICAgdGhpcy5fcmVjdGFuZ2xlQWRkZWRUb01hbmFnZXIgPSB0cnVlO1xuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBba2V5OiBzdHJpbmddOiBTaW1wbGVDaGFuZ2UgfSkge1xuICAgIGlmICghdGhpcy5fcmVjdGFuZ2xlQWRkZWRUb01hbmFnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgY2hhbmdlc1snbm9ydGgnXSB8fFxuICAgICAgY2hhbmdlc1snZWFzdCddIHx8XG4gICAgICBjaGFuZ2VzWydzb3V0aCddIHx8XG4gICAgICBjaGFuZ2VzWyd3ZXN0J11cbiAgICApIHtcbiAgICAgIHRoaXMuX21hbmFnZXIuc2V0Qm91bmRzKHRoaXMpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snZWRpdGFibGUnXSkge1xuICAgICAgdGhpcy5fbWFuYWdlci5zZXRFZGl0YWJsZSh0aGlzKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2RyYWdnYWJsZSddKSB7XG4gICAgICB0aGlzLl9tYW5hZ2VyLnNldERyYWdnYWJsZSh0aGlzKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3Zpc2libGUnXSkge1xuICAgICAgdGhpcy5fbWFuYWdlci5zZXRWaXNpYmxlKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLl91cGRhdGVSZWN0YW5nbGVPcHRpb25zQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVJlY3RhbmdsZU9wdGlvbnNDaGFuZ2VzKGNoYW5nZXM6IHtcbiAgICBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZTtcbiAgfSkge1xuICAgIGxldCBvcHRpb25zOiB7IFtwcm9wTmFtZTogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgICBsZXQgb3B0aW9uS2V5cyA9IE9iamVjdC5rZXlzKGNoYW5nZXMpLmZpbHRlcihcbiAgICAgIGsgPT4gQWdtUmVjdGFuZ2xlLl9tYXBPcHRpb25zLmluZGV4T2YoaykgIT09IC0xLFxuICAgICk7XG4gICAgb3B0aW9uS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgb3B0aW9uc1trXSA9IGNoYW5nZXNba10uY3VycmVudFZhbHVlO1xuICAgIH0pO1xuICAgIGlmIChvcHRpb25LZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX21hbmFnZXIuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3RlckV2ZW50TGlzdGVuZXJzKCkge1xuICAgIGxldCBldmVudHM6IE1hcDxzdHJpbmcsIEV2ZW50RW1pdHRlcjxhbnk+PiA9IG5ldyBNYXA8XG4gICAgICBzdHJpbmcsXG4gICAgICBFdmVudEVtaXR0ZXI8YW55PlxuICAgID4oKTtcbiAgICBldmVudHMuc2V0KCdib3VuZHNfY2hhbmdlZCcsIHRoaXMuYm91bmRzQ2hhbmdlKTtcbiAgICBldmVudHMuc2V0KCdjbGljaycsIHRoaXMucmVjdGFuZ2xlQ2xpY2spO1xuICAgIGV2ZW50cy5zZXQoJ2RibGNsaWNrJywgdGhpcy5yZWN0YW5nbGVEYmxDbGljayk7XG4gICAgZXZlbnRzLnNldCgnZHJhZycsIHRoaXMuZHJhZyk7XG4gICAgZXZlbnRzLnNldCgnZHJhZ2VuZCcsIHRoaXMuZHJhZ0VuZCk7XG4gICAgZXZlbnRzLnNldCgnZHJhZ1N0YXJ0JywgdGhpcy5kcmFnU3RhcnQpO1xuICAgIGV2ZW50cy5zZXQoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duKTtcbiAgICBldmVudHMuc2V0KCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlTW92ZSk7XG4gICAgZXZlbnRzLnNldCgnbW91c2VvdXQnLCB0aGlzLm1vdXNlT3V0KTtcbiAgICBldmVudHMuc2V0KCdtb3VzZW92ZXInLCB0aGlzLm1vdXNlT3Zlcik7XG4gICAgZXZlbnRzLnNldCgnbW91c2V1cCcsIHRoaXMubW91c2VVcCk7XG4gICAgZXZlbnRzLnNldCgncmlnaHRjbGljaycsIHRoaXMucmlnaHRDbGljayk7XG5cbiAgICBldmVudHMuZm9yRWFjaCgoZXZlbnRFbWl0dGVyLCBldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMuX2V2ZW50U3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLl9tYW5hZ2VyXG4gICAgICAgICAgLmNyZWF0ZUV2ZW50T2JzZXJ2YWJsZTxNYXBNb3VzZUV2ZW50PihldmVudE5hbWUsIHRoaXMpXG4gICAgICAgICAgLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICBjYXNlICdib3VuZHNfY2hhbmdlZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFuYWdlci5nZXRCb3VuZHModGhpcykudGhlbihib3VuZHMgPT5cbiAgICAgICAgICAgICAgICAgIGV2ZW50RW1pdHRlci5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgbm9ydGg6IGJvdW5kcy5nZXROb3J0aEVhc3QoKS5sYXQoKSxcbiAgICAgICAgICAgICAgICAgICAgZWFzdDogYm91bmRzLmdldE5vcnRoRWFzdCgpLmxuZygpLFxuICAgICAgICAgICAgICAgICAgICBzb3V0aDogYm91bmRzLmdldFNvdXRoV2VzdCgpLmxhdCgpLFxuICAgICAgICAgICAgICAgICAgICB3ZXN0OiBib3VuZHMuZ2V0U291dGhXZXN0KCkubG5nKCksXG4gICAgICAgICAgICAgICAgICB9IGFzIExhdExuZ0JvdW5kc0xpdGVyYWwpLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZXZlbnRFbWl0dGVyLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgY29vcmRzOiB7IGxhdDogdmFsdWUubGF0TG5nLmxhdCgpLCBsbmc6IHZhbHVlLmxhdExuZy5sbmcoKSB9LFxuICAgICAgICAgICAgICAgIH0gYXMgTW91c2VFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSksXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudFN1YnNjcmlwdGlvbnMuZm9yRWFjaChmdW5jdGlvbihzOiBTdWJzY3JpcHRpb24pIHtcbiAgICAgIHMudW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcbiAgICB0aGlzLl9ldmVudFN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIHRoaXMuX21hbmFnZXIucmVtb3ZlUmVjdGFuZ2xlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIExhdExuZ0JvdW5kcyBvZiB0aGlzIFJlY3RhbmdsZS5cbiAgICovXG4gIGdldEJvdW5kcygpOiBQcm9taXNlPExhdExuZ0JvdW5kcz4ge1xuICAgIHJldHVybiB0aGlzLl9tYW5hZ2VyLmdldEJvdW5kcyh0aGlzKTtcbiAgfVxufVxuIl19