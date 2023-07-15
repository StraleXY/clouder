import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs';
import { FileDTO } from 'src/app/models';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {

    constructor(private filesService: FilesService) {}

    fileDetailsForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        inputTag: new FormControl('')
      }
    );

    _file: FileDTO = {
        id: '',
        owner_email: '',
        file_name: '',
        file_type: '',
        file_path: '',
        file_description: '',
        file_base64: '',
        file_size: '0',
        file_created_at: '',
        file_modified_at: '',
        shared_with: [],
        tags: []
    }
    _fileData: File | undefined
    _isNew: boolean = true
    @Input() set file(value: FileDTO) {
        if(value == undefined) return
        this._file = value
        this._isNew = value.id.length <= 5
        this._file.file_base64 = ''
        this.fileDataInput.nativeElement.value = null;
        this.fileDetailsForm.get('name')!.setValue(value.file_name)
        this.fileDetailsForm.get('description')!.setValue(value.file_description)
    }
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>()
    @ViewChild('fileData') fileDataInput: any;

    onFileSelected(event: any) {
        this._fileData = event.target.files[0]
        this._file.file_name = this._fileData!.name ?? ""
        if(this._isNew) this.fileDetailsForm.get('name')!.setValue(this._fileData!.name);
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            this._file.file_base64 = reader.result?.toString() || ''
            const dotIndex = this._fileData!.name.lastIndexOf('.') ?? 0
            this._file.file_size = (this._fileData!.size).toString()
            this._file.file_type = (dotIndex >= 0 ? this._fileData!.name.substring(dotIndex) : '').toLowerCase();
        }
    }

    addTag() {
        // TODO Verify if the tag name is entered
        this._file.tags.push(this.fileDetailsForm.get('inputTag')!.value!.toString())
        this.fileDetailsForm.get('inputTag')!.setValue('')
    }
    deleteTag(tag: string) {
        this._file.tags.forEach((value, index)=> { if(value==tag) this._file.tags.splice(index, 1); });
    }

    save() {
        this._file.file_name = (this.fileDetailsForm.get('name')!.value)!.toString()
        this._file.file_description = (this.fileDetailsForm.get('description')!.value)!.toString()
        
        if (this._isNew) {
            this.filesService.upload(this._file).subscribe(res => {
                console.log(res)
            })
            this.close(this._file)
        }
        else {
            this._file.file_modified_at = (new Date()).toISOString()
            this.filesService.update(this._file).subscribe(res => {
                // TODO wait for response
                console.log(res);
                this.close(null);
            })
        }
    }

    close(file: any) {
        this.onClose.emit(file)
    }
}
