import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileDTO } from 'src/app/models';

@Component({
  selector: 'app-sharing',
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.css']
})
export class SharingComponent {
    _file: FileDTO = {
        id: '',
        owner_email: '',
        file_name: '',
        file_type: '',
        file_path: '',
        file_description: '',
        file_base64: undefined,
        file_size: '0',
        file_created_at: '',
        file_modified_at: '',
        shared_with: [],
        tags: []
    }
    @Input() set file(value: FileDTO) {
        if(value == undefined) return
        this._file = value
    }
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>()

    inputEmail: string = ''

    @Output() onStartSharing: EventEmitter<any> = new EventEmitter<any>()
    startSharing() {
        this._file.shared_with.push(this.inputEmail)
        this.onStartSharing.emit({email: this.inputEmail, file: this._file})
        this.inputEmail = ''
    }

    @Output() onStopSharing: EventEmitter<any> = new EventEmitter<any>()
    stopSharing(email: string) {
        this._file.shared_with.forEach((value, index)=> { if(value==email) this._file.shared_with.splice(index, 1); });
        // TODO Send api request for removal
        this.onStopSharing.emit({"email": email[0], file: this._file})
    }

    close() {
        this.onClose.emit(null)
    }
}
