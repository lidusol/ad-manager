import * as tslib_1 from "tslib";
import * as ɵngcc0 from '@angular/core';
var AgmMarker_1;
import { ContentChildren, Directive, EventEmitter, forwardRef, Input, Output, QueryList } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { FitBoundsAccessor } from '../services/fit-bounds';
import { MarkerManager } from '../services/managers/marker-manager';
import { AgmInfoWindow } from './info-window';
let markerId = 0;
/**
 * AgmMarker renders a map marker inside a {@link AgmMap}.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    .agm-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *      <agm-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *      </agm-marker>
 *    </agm-map>
 *  `
 * })
 * ```
 */
let AgmMarker = AgmMarker_1 = class AgmMarker {
    constructor(_markerManager) {
        this._markerManager = _markerManager;
        /**
         * If true, the marker can be dragged. Default value is false.
         */
        // tslint:disable-next-line:no-input-rename
        this.draggable = false;
        /**
         * If true, the marker is visible
         */
        this.visible = true;
        /**
         * Whether to automatically open the child info window when the marker is clicked.
         */
        this.openInfoWindow = true;
        /**
         * The marker's opacity between 0.0 and 1.0.
         */
        this.opacity = 1;
        /**
         * All markers are displayed on the map in order of their zIndex, with higher values displaying in
         * front of markers with lower values. By default, markers are displayed according to their
         * vertical position on screen, with lower markers appearing in front of markers further up the
         * screen.
         */
        this.zIndex = 1;
        /**
         * If true, the marker can be clicked. Default value is true.
         */
        // tslint:disable-next-line:no-input-rename
        this.clickable = true;
        /**
         * This event is fired when the marker's animation property changes.
         *
         * @memberof AgmMarker
         */
        this.animationChange = new EventEmitter();
        /**
         * This event emitter gets emitted when the user clicks on the marker.
         */
        this.markerClick = new EventEmitter();
        /**
         * This event emitter gets emitted when the user clicks twice on the marker.
         */
        this.markerDblClick = new EventEmitter();
        /**
         * This event is fired when the user rightclicks on the marker.
         */
        this.markerRightClick = new EventEmitter();
        /**
         * This event is fired when the user starts dragging the marker.
         */
        this.dragStart = new EventEmitter();
        /**
         * This event is repeatedly fired while the user drags the marker.
         */
        this.drag = new EventEmitter();
        /**
         * This event is fired when the user stops dragging the marker.
         */
        this.dragEnd = new EventEmitter();
        /**
         * This event is fired when the user mouses over the marker.
         */
        this.mouseOver = new EventEmitter();
        /**
         * This event is fired when the user mouses outside the marker.
         */
        this.mouseOut = new EventEmitter();
        /** @internal */
        this.infoWindow = new QueryList();
        this._markerAddedToManger = false;
        this._observableSubscriptions = [];
        this._fitBoundsDetails$ = new ReplaySubject(1);
        this._id = (markerId++).toString();
    }
    /* @internal */
    ngAfterContentInit() {
        this.handleInfoWindowUpdate();
        this.infoWindow.changes.subscribe(() => this.handleInfoWindowUpdate());
    }
    handleInfoWindowUpdate() {
        if (this.infoWindow.length > 1) {
            throw new Error('Expected no more than one info window.');
        }
        this.infoWindow.forEach(marker => {
            marker.hostMarker = this;
        });
    }
    /** @internal */
    ngOnChanges(changes) {
        if (typeof this.latitude === 'string') {
            this.latitude = Number(this.latitude);
        }
        if (typeof this.longitude === 'string') {
            this.longitude = Number(this.longitude);
        }
        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
            return;
        }
        if (!this._markerAddedToManger) {
            this._markerManager.addMarker(this);
            this._updateFitBoundsDetails();
            this._markerAddedToManger = true;
            this._addEventListeners();
            return;
        }
        if (changes['latitude'] || changes['longitude']) {
            this._markerManager.updateMarkerPosition(this);
            this._updateFitBoundsDetails();
        }
        if (changes['title']) {
            this._markerManager.updateTitle(this);
        }
        if (changes['label']) {
            this._markerManager.updateLabel(this);
        }
        if (changes['draggable']) {
            this._markerManager.updateDraggable(this);
        }
        if (changes['iconUrl']) {
            this._markerManager.updateIcon(this);
        }
        if (changes['opacity']) {
            this._markerManager.updateOpacity(this);
        }
        if (changes['visible']) {
            this._markerManager.updateVisible(this);
        }
        if (changes['zIndex']) {
            this._markerManager.updateZIndex(this);
        }
        if (changes['clickable']) {
            this._markerManager.updateClickable(this);
        }
        if (changes['animation']) {
            this._markerManager.updateAnimation(this);
        }
    }
    /** @internal */
    getFitBoundsDetails$() {
        return this._fitBoundsDetails$.asObservable();
    }
    _updateFitBoundsDetails() {
        this._fitBoundsDetails$.next({ latLng: { lat: this.latitude, lng: this.longitude } });
    }
    _addEventListeners() {
        const cs = this._markerManager.createEventObservable('click', this).subscribe(() => {
            if (this.openInfoWindow) {
                this.infoWindow.forEach(infoWindow => infoWindow.open());
            }
            this.markerClick.emit(this);
        });
        this._observableSubscriptions.push(cs);
        const dcs = this._markerManager.createEventObservable('dblclick', this).subscribe(() => {
            this.markerDblClick.emit(null);
        });
        this._observableSubscriptions.push(dcs);
        const rc = this._markerManager.createEventObservable('rightclick', this).subscribe(() => {
            this.markerRightClick.emit(null);
        });
        this._observableSubscriptions.push(rc);
        const ds = this._markerManager.createEventObservable('dragstart', this)
            .subscribe((e) => {
            this.dragStart.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
        });
        this._observableSubscriptions.push(ds);
        const d = this._markerManager.createEventObservable('drag', this)
            .subscribe((e) => {
            this.drag.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
        });
        this._observableSubscriptions.push(d);
        const de = this._markerManager.createEventObservable('dragend', this)
            .subscribe((e) => {
            this.dragEnd.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
        });
        this._observableSubscriptions.push(de);
        const mover = this._markerManager.createEventObservable('mouseover', this)
            .subscribe((e) => {
            this.mouseOver.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
        });
        this._observableSubscriptions.push(mover);
        const mout = this._markerManager.createEventObservable('mouseout', this)
            .subscribe((e) => {
            this.mouseOut.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
        });
        this._observableSubscriptions.push(mout);
        const anChng = this._markerManager.createEventObservable('animation_changed', this)
            .subscribe(() => {
            this.animationChange.emit(this.animation);
        });
        this._observableSubscriptions.push(anChng);
    }
    /** @internal */
    id() { return this._id; }
    /** @internal */
    toString() { return 'AgmMarker-' + this._id.toString(); }
    /** @internal */
    ngOnDestroy() {
        this._markerManager.deleteMarker(this);
        // unsubscribe all registered observable subscriptions
        this._observableSubscriptions.forEach((s) => s.unsubscribe());
    }
};
AgmMarker.ɵfac = function AgmMarker_Factory(t) { return new (t || AgmMarker)(ɵngcc0.ɵɵdirectiveInject(MarkerManager)); };
AgmMarker.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: AgmMarker, selectors: [["agm-marker"]], contentQueries: function AgmMarker_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        ɵngcc0.ɵɵcontentQuery(dirIndex, AgmInfoWindow, false);
    } if (rf & 2) {
        var _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.infoWindow = _t);
    } }, inputs: { latitude: "latitude", longitude: "longitude", title: "title", label: "label", draggable: ["markerDraggable", "draggable"], iconUrl: "iconUrl", openInfoWindow: "openInfoWindow", opacity: "opacity", visible: "visible", zIndex: "zIndex", animation: "animation", clickable: ["markerClickable", "clickable"] }, outputs: { markerClick: "markerClick", dragStart: "dragStart", drag: "drag", dragEnd: "dragEnd", mouseOver: "mouseOver", mouseOut: "mouseOut", animationChange: "animationChange", markerDblClick: "markerDblClick", markerRightClick: "markerRightClick" }, features: [ɵngcc0.ɵɵProvidersFeature([
            { provide: FitBoundsAccessor, useExisting: forwardRef(() => AgmMarker_1) },
        ]), ɵngcc0.ɵɵNgOnChangesFeature] });
AgmMarker.ctorParameters = () => [
    { type: MarkerManager }
];
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], AgmMarker.prototype, "latitude", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], AgmMarker.prototype, "longitude", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], AgmMarker.prototype, "title", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "label", void 0);
tslib_1.__decorate([
    Input('markerDraggable'),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "draggable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], AgmMarker.prototype, "iconUrl", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "visible", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "openInfoWindow", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "opacity", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "zIndex", void 0);
tslib_1.__decorate([
    Input('markerClickable'),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "clickable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], AgmMarker.prototype, "animation", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], AgmMarker.prototype, "animationChange", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "markerClick", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "markerDblClick", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "markerRightClick", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "dragStart", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "drag", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "dragEnd", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "mouseOver", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AgmMarker.prototype, "mouseOut", void 0);
tslib_1.__decorate([
    ContentChildren(AgmInfoWindow),
    tslib_1.__metadata("design:type", QueryList)
], AgmMarker.prototype, "infoWindow", void 0);
AgmMarker = AgmMarker_1 = tslib_1.__decorate([ tslib_1.__metadata("design:paramtypes", [MarkerManager])
], AgmMarker);
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(AgmMarker, [{
        type: Directive,
        args: [{
                selector: 'agm-marker',
                providers: [
                    { provide: FitBoundsAccessor, useExisting: forwardRef(() => AgmMarker_1) },
                ],
                inputs: [
                    'latitude', 'longitude', 'title', 'label', 'draggable: markerDraggable', 'iconUrl',
                    'openInfoWindow', 'opacity', 'visible', 'zIndex', 'animation',
                ],
                outputs: ['markerClick', 'dragStart', 'drag', 'dragEnd', 'mouseOver', 'mouseOut']
            }]
    }], function () { return [{ type: MarkerManager }]; }, { draggable: [{
            type: Input,
            args: ['markerDraggable']
        }], visible: [{
            type: Input
        }], openInfoWindow: [{
            type: Input
        }], opacity: [{
            type: Input
        }], zIndex: [{
            type: Input
        }], clickable: [{
            type: Input,
            args: ['markerClickable']
        }], animationChange: [{
            type: Output
        }], markerClick: [{
            type: Output
        }], markerDblClick: [{
            type: Output
        }], markerRightClick: [{
            type: Output
        }], dragStart: [{
            type: Output
        }], drag: [{
            type: Output
        }], dragEnd: [{
            type: Output
        }], mouseOver: [{
            type: Output
        }], mouseOut: [{
            type: Output
        }], infoWindow: [{
            type: ContentChildren,
            args: [AgmInfoWindow]
        }], latitude: [{
            type: Input
        }], longitude: [{
            type: Input
        }], title: [{
            type: Input
        }], label: [{
            type: Input
        }], iconUrl: [{
            type: Input
        }], animation: [{
            type: Input
        }] }); })();
export { AgmMarker };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2VyLmpzIiwic291cmNlcyI6WyJuZzovQGFnbS9jb3JlL2RpcmVjdGl2ZXMvbWFya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE9BQU8sRUFBb0IsZUFBZSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBd0IsTUFBTSxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFDckssT0FBTyxFQUFjLGFBQWEsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFvQixNQUFNLHdCQUF3QixDQUFDO0FBRTdFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFZSCxJQUFhLFNBQVMsaUJBQXRCLE1BQWEsU0FBUztBQUFHLElBMkh2QixZQUFvQixjQUE2QjtBQUFJLFFBQWpDLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0FBQUMsUUF0R2xEO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBRSwyQ0FBMkM7QUFDN0MsUUFBNEIsY0FBUyxHQUFHLEtBQUssQ0FBQztBQUM5QyxRQU1FO0FBQ0Y7QUFFQSxXQURLO0FBQ0wsUUFBVyxZQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQ0U7QUFDRjtBQUVBLFdBREs7QUFDTCxRQUFXLG1CQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLFFBQ0U7QUFDRjtBQUVBLFdBREs7QUFDTCxRQUFXLFlBQU8sR0FBRyxDQUFDLENBQUM7QUFDdkIsUUFDRTtBQUNGO0FBQ007QUFDTTtBQUVQO0FB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QVMsMENBWHJCLFNBQVMsQ0FBQyxVQUNULFFBQVEsRUFBRSxZQUFZLFVBQ3RCLHpEQVNFLDBDQTJIa0MsYUFBYTtRQXBJeEMsRUFBRSxWQW9JeUMsR0EzSHpDLFNBQVMsQ0FrUnJCO1NBMVJHLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRztBQUFFLENBQUMsV0FBUyxDQUFDLEVBQUU7Q0FDekUsVUFDRDtBQUFNLEVBQUUsY0FDTixVQUFVLEVBQUUsV0FBVztDQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7a0JBQTRCLEVBQUUsU0FBUyxjQUNsRixnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRTtRQUFXO0FBQzlELFVBQ0QsT0FBTyxFQUFFLENBQUM7T0FBYSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsT0FDbEYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFvUkY7QUFDQSxTQXBSYSxTQUFTO0FBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDb250ZW50Q2hpbGRyZW4sIERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBmb3J3YXJkUmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE91dHB1dCwgUXVlcnlMaXN0LCBTaW1wbGVDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFJlcGxheVN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTW91c2VFdmVudCB9IGZyb20gJy4uL21hcC10eXBlcyc7XG5pbXBvcnQgeyBGaXRCb3VuZHNBY2Nlc3NvciwgRml0Qm91bmRzRGV0YWlscyB9IGZyb20gJy4uL3NlcnZpY2VzL2ZpdC1ib3VuZHMnO1xuaW1wb3J0ICogYXMgbWFwVHlwZXMgZnJvbSAnLi4vc2VydmljZXMvZ29vZ2xlLW1hcHMtdHlwZXMnO1xuaW1wb3J0IHsgTWFya2VyTWFuYWdlciB9IGZyb20gJy4uL3NlcnZpY2VzL21hbmFnZXJzL21hcmtlci1tYW5hZ2VyJztcbmltcG9ydCB7IEFnbUluZm9XaW5kb3cgfSBmcm9tICcuL2luZm8td2luZG93JztcblxubGV0IG1hcmtlcklkID0gMDtcblxuLyoqXG4gKiBBZ21NYXJrZXIgcmVuZGVycyBhIG1hcCBtYXJrZXIgaW5zaWRlIGEge0BsaW5rIEFnbU1hcH0uXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICpcbiAqIEBDb21wb25lbnQoe1xuICogIHNlbGVjdG9yOiAnbXktbWFwLWNtcCcsXG4gKiAgc3R5bGVzOiBbYFxuICogICAgLmFnbS1tYXAtY29udGFpbmVyIHtcbiAqICAgICAgaGVpZ2h0OiAzMDBweDtcbiAqICAgIH1cbiAqIGBdLFxuICogIHRlbXBsYXRlOiBgXG4gKiAgICA8YWdtLW1hcCBbbGF0aXR1ZGVdPVwibGF0XCIgW2xvbmdpdHVkZV09XCJsbmdcIiBbem9vbV09XCJ6b29tXCI+XG4gKiAgICAgIDxhZ20tbWFya2VyIFtsYXRpdHVkZV09XCJsYXRcIiBbbG9uZ2l0dWRlXT1cImxuZ1wiIFtsYWJlbF09XCInTSdcIj5cbiAqICAgICAgPC9hZ20tbWFya2VyPlxuICogICAgPC9hZ20tbWFwPlxuICogIGBcbiAqIH0pXG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnYWdtLW1hcmtlcicsXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogRml0Qm91bmRzQWNjZXNzb3IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFnbU1hcmtlcikgfSxcbiAgXSxcbiAgaW5wdXRzOiBbXG4gICAgJ2xhdGl0dWRlJywgJ2xvbmdpdHVkZScsICd0aXRsZScsICdsYWJlbCcsICdkcmFnZ2FibGU6IG1hcmtlckRyYWdnYWJsZScsICdpY29uVXJsJyxcbiAgICAnb3BlbkluZm9XaW5kb3cnLCAnb3BhY2l0eScsICd2aXNpYmxlJywgJ3pJbmRleCcsICdhbmltYXRpb24nLFxuICBdLFxuICBvdXRwdXRzOiBbJ21hcmtlckNsaWNrJywgJ2RyYWdTdGFydCcsICdkcmFnJywgJ2RyYWdFbmQnLCAnbW91c2VPdmVyJywgJ21vdXNlT3V0J10sXG59KVxuZXhwb3J0IGNsYXNzIEFnbU1hcmtlciBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBGaXRCb3VuZHNBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBUaGUgbGF0aXR1ZGUgcG9zaXRpb24gb2YgdGhlIG1hcmtlci5cbiAgICovXG4gIEBJbnB1dCgpIGxhdGl0dWRlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBsb25naXR1ZGUgcG9zaXRpb24gb2YgdGhlIG1hcmtlci5cbiAgICovXG4gIEBJbnB1dCgpIGxvbmdpdHVkZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgdGl0bGUgb2YgdGhlIG1hcmtlci5cbiAgICovXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsYWJlbCAoYSBzaW5nbGUgdXBwZXJjYXNlIGNoYXJhY3RlcikgZm9yIHRoZSBtYXJrZXIuXG4gICAqL1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nIHwgbWFwVHlwZXMuTWFya2VyTGFiZWw7XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHRoZSBtYXJrZXIgY2FuIGJlIGRyYWdnZWQuIERlZmF1bHQgdmFsdWUgaXMgZmFsc2UuXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5wdXQtcmVuYW1lXG4gIEBJbnB1dCgnbWFya2VyRHJhZ2dhYmxlJykgZHJhZ2dhYmxlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEljb24gKHRoZSBVUkwgb2YgdGhlIGltYWdlKSBmb3IgdGhlIGZvcmVncm91bmQuXG4gICAqL1xuICBASW5wdXQoKSBpY29uVXJsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHRoZSBtYXJrZXIgaXMgdmlzaWJsZVxuICAgKi9cbiAgQElucHV0KCkgdmlzaWJsZSA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSBvcGVuIHRoZSBjaGlsZCBpbmZvIHdpbmRvdyB3aGVuIHRoZSBtYXJrZXIgaXMgY2xpY2tlZC5cbiAgICovXG4gIEBJbnB1dCgpIG9wZW5JbmZvV2luZG93ID0gdHJ1ZTtcblxuICAvKipcbiAgICogVGhlIG1hcmtlcidzIG9wYWNpdHkgYmV0d2VlbiAwLjAgYW5kIDEuMC5cbiAgICovXG4gIEBJbnB1dCgpIG9wYWNpdHkgPSAxO1xuXG4gIC8qKlxuICAgKiBBbGwgbWFya2VycyBhcmUgZGlzcGxheWVkIG9uIHRoZSBtYXAgaW4gb3JkZXIgb2YgdGhlaXIgekluZGV4LCB3aXRoIGhpZ2hlciB2YWx1ZXMgZGlzcGxheWluZyBpblxuICAgKiBmcm9udCBvZiBtYXJrZXJzIHdpdGggbG93ZXIgdmFsdWVzLiBCeSBkZWZhdWx0LCBtYXJrZXJzIGFyZSBkaXNwbGF5ZWQgYWNjb3JkaW5nIHRvIHRoZWlyXG4gICAqIHZlcnRpY2FsIHBvc2l0aW9uIG9uIHNjcmVlbiwgd2l0aCBsb3dlciBtYXJrZXJzIGFwcGVhcmluZyBpbiBmcm9udCBvZiBtYXJrZXJzIGZ1cnRoZXIgdXAgdGhlXG4gICAqIHNjcmVlbi5cbiAgICovXG4gIEBJbnB1dCgpIHpJbmRleCA9IDE7XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHRoZSBtYXJrZXIgY2FuIGJlIGNsaWNrZWQuIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZS5cbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnB1dC1yZW5hbWVcbiAgQElucHV0KCdtYXJrZXJDbGlja2FibGUnKSBjbGlja2FibGUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBXaGljaCBhbmltYXRpb24gdG8gcGxheSB3aGVuIG1hcmtlciBpcyBhZGRlZCB0byBhIG1hcC5cbiAgICogVGhpcyBjYW4gYmUgJ0JPVU5DRScgb3IgJ0RST1AnXG4gICAqL1xuICBASW5wdXQoKSBhbmltYXRpb246IEFuaW1hdGlvbjtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBtYXJrZXIncyBhbmltYXRpb24gcHJvcGVydHkgY2hhbmdlcy5cbiAgICpcbiAgICogQG1lbWJlcm9mIEFnbU1hcmtlclxuICAgKi9cbiAgQE91dHB1dCgpIGFuaW1hdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uPigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGVtaXR0ZXIgZ2V0cyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIHRoZSBtYXJrZXIuXG4gICAqL1xuICBAT3V0cHV0KCkgbWFya2VyQ2xpY2s6IEV2ZW50RW1pdHRlcjxBZ21NYXJrZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxBZ21NYXJrZXI+KCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgZW1pdHRlciBnZXRzIGVtaXR0ZWQgd2hlbiB0aGUgdXNlciBjbGlja3MgdHdpY2Ugb24gdGhlIG1hcmtlci5cbiAgICovXG4gIEBPdXRwdXQoKSBtYXJrZXJEYmxDbGljazogRXZlbnRFbWl0dGVyPEFnbU1hcmtlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFnbU1hcmtlcj4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIHJpZ2h0Y2xpY2tzIG9uIHRoZSBtYXJrZXIuXG4gICAqL1xuICBAT3V0cHV0KCkgbWFya2VyUmlnaHRDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHVzZXIgc3RhcnRzIGRyYWdnaW5nIHRoZSBtYXJrZXIuXG4gICAqL1xuICBAT3V0cHV0KCkgZHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQgaXMgcmVwZWF0ZWRseSBmaXJlZCB3aGlsZSB0aGUgdXNlciBkcmFncyB0aGUgbWFya2VyLlxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWc6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIHN0b3BzIGRyYWdnaW5nIHRoZSBtYXJrZXIuXG4gICAqL1xuICBAT3V0cHV0KCkgZHJhZ0VuZDogRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIHVzZXIgbW91c2VzIG92ZXIgdGhlIG1hcmtlci5cbiAgICovXG4gIEBPdXRwdXQoKSBtb3VzZU92ZXI6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICAvKipcbiAgICogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIG1vdXNlcyBvdXRzaWRlIHRoZSBtYXJrZXIuXG4gICAqL1xuICBAT3V0cHV0KCkgbW91c2VPdXQ6IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICAvKiogQGludGVybmFsICovXG4gIEBDb250ZW50Q2hpbGRyZW4oQWdtSW5mb1dpbmRvdykgaW5mb1dpbmRvdzogUXVlcnlMaXN0PEFnbUluZm9XaW5kb3c+ID0gbmV3IFF1ZXJ5TGlzdDxBZ21JbmZvV2luZG93PigpO1xuXG4gIHByaXZhdGUgX21hcmtlckFkZGVkVG9NYW5nZXIgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfb2JzZXJ2YWJsZVN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9maXRCb3VuZHNEZXRhaWxzJDogUmVwbGF5U3ViamVjdDxGaXRCb3VuZHNEZXRhaWxzPiA9IG5ldyBSZXBsYXlTdWJqZWN0PEZpdEJvdW5kc0RldGFpbHM+KDEpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21hcmtlck1hbmFnZXI6IE1hcmtlck1hbmFnZXIpIHsgdGhpcy5faWQgPSAobWFya2VySWQrKykudG9TdHJpbmcoKTsgfVxuXG4gIC8qIEBpbnRlcm5hbCAqL1xuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5oYW5kbGVJbmZvV2luZG93VXBkYXRlKCk7XG4gICAgdGhpcy5pbmZvV2luZG93LmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuaGFuZGxlSW5mb1dpbmRvd1VwZGF0ZSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlSW5mb1dpbmRvd1VwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pbmZvV2luZG93Lmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbm8gbW9yZSB0aGFuIG9uZSBpbmZvIHdpbmRvdy4nKTtcbiAgICB9XG4gICAgdGhpcy5pbmZvV2luZG93LmZvckVhY2gobWFya2VyID0+IHtcbiAgICAgIG1hcmtlci5ob3N0TWFya2VyID0gdGhpcztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBba2V5OiBzdHJpbmddOiBTaW1wbGVDaGFuZ2UgfSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5sYXRpdHVkZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMubGF0aXR1ZGUgPSBOdW1iZXIodGhpcy5sYXRpdHVkZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5sb25naXR1ZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmxvbmdpdHVkZSA9IE51bWJlcih0aGlzLmxvbmdpdHVkZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5sYXRpdHVkZSAhPT0gJ251bWJlcicgfHwgdHlwZW9mIHRoaXMubG9uZ2l0dWRlICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX21hcmtlckFkZGVkVG9NYW5nZXIpIHtcbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIuYWRkTWFya2VyKHRoaXMpO1xuICAgICAgdGhpcy5fdXBkYXRlRml0Qm91bmRzRGV0YWlscygpO1xuICAgICAgdGhpcy5fbWFya2VyQWRkZWRUb01hbmdlciA9IHRydWU7XG4gICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snbGF0aXR1ZGUnXSB8fCBjaGFuZ2VzWydsb25naXR1ZGUnXSkge1xuICAgICAgdGhpcy5fbWFya2VyTWFuYWdlci51cGRhdGVNYXJrZXJQb3NpdGlvbih0aGlzKTtcbiAgICAgIHRoaXMuX3VwZGF0ZUZpdEJvdW5kc0RldGFpbHMoKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3RpdGxlJ10pIHtcbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIudXBkYXRlVGl0bGUodGhpcyk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydsYWJlbCddKSB7XG4gICAgICB0aGlzLl9tYXJrZXJNYW5hZ2VyLnVwZGF0ZUxhYmVsKHRoaXMpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snZHJhZ2dhYmxlJ10pIHtcbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIudXBkYXRlRHJhZ2dhYmxlKHRoaXMpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snaWNvblVybCddKSB7XG4gICAgICB0aGlzLl9tYXJrZXJNYW5hZ2VyLnVwZGF0ZUljb24odGhpcyk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydvcGFjaXR5J10pIHtcbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIudXBkYXRlT3BhY2l0eSh0aGlzKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3Zpc2libGUnXSkge1xuICAgICAgdGhpcy5fbWFya2VyTWFuYWdlci51cGRhdGVWaXNpYmxlKHRoaXMpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snekluZGV4J10pIHtcbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIudXBkYXRlWkluZGV4KHRoaXMpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snY2xpY2thYmxlJ10pIHtcbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIudXBkYXRlQ2xpY2thYmxlKHRoaXMpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snYW5pbWF0aW9uJ10pIHtcbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIudXBkYXRlQW5pbWF0aW9uKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgZ2V0Rml0Qm91bmRzRGV0YWlscyQoKTogT2JzZXJ2YWJsZTxGaXRCb3VuZHNEZXRhaWxzPiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpdEJvdW5kc0RldGFpbHMkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF91cGRhdGVGaXRCb3VuZHNEZXRhaWxzKCkge1xuICAgIHRoaXMuX2ZpdEJvdW5kc0RldGFpbHMkLm5leHQoeyBsYXRMbmc6IHsgbGF0OiB0aGlzLmxhdGl0dWRlLCBsbmc6IHRoaXMubG9uZ2l0dWRlIH0gfSk7XG4gIH1cblxuICBwcml2YXRlIF9hZGRFdmVudExpc3RlbmVycygpIHtcbiAgICBjb25zdCBjcyA9IHRoaXMuX21hcmtlck1hbmFnZXIuY3JlYXRlRXZlbnRPYnNlcnZhYmxlKCdjbGljaycsIHRoaXMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vcGVuSW5mb1dpbmRvdykge1xuICAgICAgICB0aGlzLmluZm9XaW5kb3cuZm9yRWFjaChpbmZvV2luZG93ID0+IGluZm9XaW5kb3cub3BlbigpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWFya2VyQ2xpY2suZW1pdCh0aGlzKTtcbiAgICB9KTtcbiAgICB0aGlzLl9vYnNlcnZhYmxlU3Vic2NyaXB0aW9ucy5wdXNoKGNzKTtcblxuICAgIGNvbnN0IGRjcyA9IHRoaXMuX21hcmtlck1hbmFnZXIuY3JlYXRlRXZlbnRPYnNlcnZhYmxlKCdkYmxjbGljaycsIHRoaXMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLm1hcmtlckRibENsaWNrLmVtaXQobnVsbCk7XG4gICAgfSk7XG4gICAgdGhpcy5fb2JzZXJ2YWJsZVN1YnNjcmlwdGlvbnMucHVzaChkY3MpO1xuXG4gICAgY29uc3QgcmMgPSB0aGlzLl9tYXJrZXJNYW5hZ2VyLmNyZWF0ZUV2ZW50T2JzZXJ2YWJsZSgncmlnaHRjbGljaycsIHRoaXMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLm1hcmtlclJpZ2h0Q2xpY2suZW1pdChudWxsKTtcbiAgICB9KTtcbiAgICB0aGlzLl9vYnNlcnZhYmxlU3Vic2NyaXB0aW9ucy5wdXNoKHJjKTtcblxuICAgIGNvbnN0IGRzID1cbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIuY3JlYXRlRXZlbnRPYnNlcnZhYmxlPG1hcFR5cGVzLk1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnLCB0aGlzKVxuICAgICAgICAuc3Vic2NyaWJlKChlOiBtYXBUeXBlcy5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5kcmFnU3RhcnQuZW1pdCh7IGNvb3JkczogeyBsYXQ6IGUubGF0TG5nLmxhdCgpLCBsbmc6IGUubGF0TG5nLmxuZygpIH0gfSBhcyBNb3VzZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgdGhpcy5fb2JzZXJ2YWJsZVN1YnNjcmlwdGlvbnMucHVzaChkcyk7XG5cbiAgICBjb25zdCBkID1cbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIuY3JlYXRlRXZlbnRPYnNlcnZhYmxlPG1hcFR5cGVzLk1vdXNlRXZlbnQ+KCdkcmFnJywgdGhpcylcbiAgICAgICAgLnN1YnNjcmliZSgoZTogbWFwVHlwZXMuTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZHJhZy5lbWl0KHsgY29vcmRzOiB7IGxhdDogZS5sYXRMbmcubGF0KCksIGxuZzogZS5sYXRMbmcubG5nKCkgfSB9IGFzIE1vdXNlRXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB0aGlzLl9vYnNlcnZhYmxlU3Vic2NyaXB0aW9ucy5wdXNoKGQpO1xuXG4gICAgY29uc3QgZGUgPVxuICAgICAgdGhpcy5fbWFya2VyTWFuYWdlci5jcmVhdGVFdmVudE9ic2VydmFibGU8bWFwVHlwZXMuTW91c2VFdmVudD4oJ2RyYWdlbmQnLCB0aGlzKVxuICAgICAgICAuc3Vic2NyaWJlKChlOiBtYXBUeXBlcy5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoeyBjb29yZHM6IHsgbGF0OiBlLmxhdExuZy5sYXQoKSwgbG5nOiBlLmxhdExuZy5sbmcoKSB9IH0gYXMgTW91c2VFdmVudCk7XG4gICAgICAgIH0pO1xuICAgIHRoaXMuX29ic2VydmFibGVTdWJzY3JpcHRpb25zLnB1c2goZGUpO1xuXG4gICAgY29uc3QgbW92ZXIgPVxuICAgICAgdGhpcy5fbWFya2VyTWFuYWdlci5jcmVhdGVFdmVudE9ic2VydmFibGU8bWFwVHlwZXMuTW91c2VFdmVudD4oJ21vdXNlb3ZlcicsIHRoaXMpXG4gICAgICAgIC5zdWJzY3JpYmUoKGU6IG1hcFR5cGVzLk1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLm1vdXNlT3Zlci5lbWl0KHsgY29vcmRzOiB7IGxhdDogZS5sYXRMbmcubGF0KCksIGxuZzogZS5sYXRMbmcubG5nKCkgfSB9IGFzIE1vdXNlRXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB0aGlzLl9vYnNlcnZhYmxlU3Vic2NyaXB0aW9ucy5wdXNoKG1vdmVyKTtcblxuICAgIGNvbnN0IG1vdXQgPVxuICAgICAgdGhpcy5fbWFya2VyTWFuYWdlci5jcmVhdGVFdmVudE9ic2VydmFibGU8bWFwVHlwZXMuTW91c2VFdmVudD4oJ21vdXNlb3V0JywgdGhpcylcbiAgICAgICAgLnN1YnNjcmliZSgoZTogbWFwVHlwZXMuTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMubW91c2VPdXQuZW1pdCh7IGNvb3JkczogeyBsYXQ6IGUubGF0TG5nLmxhdCgpLCBsbmc6IGUubGF0TG5nLmxuZygpIH0gfSBhcyBNb3VzZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgdGhpcy5fb2JzZXJ2YWJsZVN1YnNjcmlwdGlvbnMucHVzaChtb3V0KTtcblxuICAgIGNvbnN0IGFuQ2huZyA9XG4gICAgICB0aGlzLl9tYXJrZXJNYW5hZ2VyLmNyZWF0ZUV2ZW50T2JzZXJ2YWJsZTx2b2lkPignYW5pbWF0aW9uX2NoYW5nZWQnLCB0aGlzKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvbkNoYW5nZS5lbWl0KHRoaXMuYW5pbWF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgdGhpcy5fb2JzZXJ2YWJsZVN1YnNjcmlwdGlvbnMucHVzaChhbkNobmcpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faWQ7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiAnQWdtTWFya2VyLScgKyB0aGlzLl9pZC50b1N0cmluZygpOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9tYXJrZXJNYW5hZ2VyLmRlbGV0ZU1hcmtlcih0aGlzKTtcbiAgICAvLyB1bnN1YnNjcmliZSBhbGwgcmVnaXN0ZXJlZCBvYnNlcnZhYmxlIHN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLl9vYnNlcnZhYmxlU3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzKSA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEFuaW1hdGlvbiA9ICdCT1VOQ0UnIHwgJ0RST1AnIHwgbnVsbDtcbiJdfQ==