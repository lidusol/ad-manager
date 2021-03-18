import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'adf-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {


  constructor(private _snackBar: MatSnackBar) { }


  openSnackBar(duration: number, message: string, action: string, style: string, horizontalPosition?: MatSnackBarHorizontalPosition, verticalPosition?: MatSnackBarVerticalPosition) {
    this._snackBar.open(message, action, {
  duration: duration * 1000,
      panelClass: [style],
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition
  
});
    /* this._snackBar.openFromComponent(SnackBarTemplateComponent, {
      duration: this.durationInSeconds * 1000,

    }); */
  }

}

@Component({
  selector: 'adf-snackbar-template',
  templateUrl: 'snackbar-template.html',
  styles: [`
    .example-pizza-party {
      color: hotpink;
    }
  `],
})
export class SnackBarTemplateComponent {
  constructor() {
    
  }

  
}
