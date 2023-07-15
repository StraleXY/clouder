import { Component, Input, ViewChild } from '@angular/core';
import { FileDTO } from 'src/app/models';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent {
    @Input() set file(value: FileDTO | null) {
        if(value != null) {
            this._visible = true
            this._animated = true
            this._text = "Upload in progress.."
        } else {
            this._text = "Upload successful!"
            this._animated = false
            setTimeout(() => {
                this._visible = false
            }, 2000);
        }
    }
    @Input() set deleting(value: boolean) {
        if(value) {
            this._visible = true
            this._animated = true
            this._text = "Delete in progress.."
        } else {
            this._text = "Delete successful!"
            this._animated = false
            setTimeout(() => {
                this._visible = false
                // window.location.reload()
                return
            }, 2000);
        }
    }
    _visible: boolean = false
    _text: string = ""
    _animated: boolean = true
}
