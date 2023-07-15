import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilesService } from 'src/app/services/files.service';
import { FOLDER_KEEPER } from 'src/app/consts'

@Component({
  selector: 'app-folder-add-edit',
  templateUrl: './folder-add-edit.component.html',
  styleUrls: ['./folder-add-edit.component.css']
})
export class FolderAddEditComponent {

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>()
    @Output() onSave: EventEmitter<any> = new EventEmitter<any>()
    @Input() folders: string[] = []
    @Input() currentPath: string = ""
    @Input() set selectedFolder(value: string) {
        this.isNew = value == ''
        this.folderName = value
        this.oldName = value
    }

    folderName: string = ''
    oldName: string = ''
    isNew: boolean = false

    constructor(private fileService: FilesService) {}

    close() {
        this.onClose.emit()
    }

    save() {
        if (this.isNew) {
            let folder = {
                id: '',
                owner_email: localStorage.getItem('email')!,
                file_name: FOLDER_KEEPER + ' - ' + this.folderName,
                file_type: FOLDER_KEEPER,
                file_path: this.currentPath + '/' + this.folderName,
                file_description: FOLDER_KEEPER,
                file_base64: '',
                file_size: '0',
                file_created_at: (new Date()).toISOString(),
                file_modified_at: (new Date()).toISOString(),
                shared_with: [],
                tags: []
            }

            this.fileService.upload(folder).subscribe(_ => {
            })

            this.onSave.emit(folder)
        }
        else {
            this.fileService.renameFolder(
                this.currentPath + '/' + this.oldName,
                this.currentPath + '/' + this.folderName
            ).subscribe(res => {
                console.log(res)
                this.onSave.emit(null)
            })

        }
    }
}
