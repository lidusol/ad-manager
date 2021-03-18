import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayFactory, LyTheme2 } from '@alyle/ui';
import { LySnackBarService } from './snack-bar.service';
import { LySnackBarDismiss } from './snack-bar';
export declare class LySnackBarRef {
    private _snackBarService;
    private _overlay;
    private _afterDismissedEventEmitter;
    private _theme;
    private _timer;
    private _dismissedByAction;
    /** Subject for notifying the user that the snack bar has been dismissed. */
    private readonly _afterDismissed;
    /** Gets an observable that is notified when the snack bar is finished closing. */
    afterDismissed(): Observable<void>;
    constructor(_snackBarService: LySnackBarService, _overlay: OverlayFactory | null, _afterDismissedEventEmitter: EventEmitter<LySnackBarDismiss>, duration: number | 'Infinity', _theme: LyTheme2);
    dismiss(): void;
    dismissWithAction(): void;
}
