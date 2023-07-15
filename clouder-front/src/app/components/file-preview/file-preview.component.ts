import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FileDTO } from 'src/app/models';


@Component({
    selector: 'app-file-preview',
    templateUrl: './file-preview.component.html',
    styleUrls: ['./file-preview.component.css'],
    animations: [
        trigger('fade', [
            state('visible', style({ opacity: 1 })),
            state('hidden', style({ opacity: 0 })),
            transition('visible => hidden', animate('1s ease-out')),
            transition('hidden => visible', animate('1s ease-in'))
        ])
    ]
})
export class FilePreviewComponent {
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

    @Input() set file(value: any) {
        if(typeof value == 'string') return
        this._file = value
    }
    @Input() isShared: boolean = false

    isMenuOpend: boolean = false
    offsetX: number = 0
    offsetY: number = 0
    @ViewChild('targetSpan', { static: false })
    targetSpan!: ElementRef;

    fileColor: Map<string, string> = new Map([
        ['.doc', '#1989d4'],
        ['.docx', '#1989d4'],
        ['.ppt', '#d12a4e'],
        ['.pdf', '#d62d38'],
        ['.xls', '#318c27'],
        ['.png', '#bdb215'],
        ['.jpg', '#bdb215'],
        ['.jpeg', '#bdb215'],
        ['.mp3', '#7b3e8c'],
    ])

    getFileColor(type: string): string {
        let opt = this.fileColor.get(type.toLowerCase())
        if (opt == undefined) return '#808080'
        return opt
    }

    toggleMenu() {
        if(this.targetSpan.nativeElement.getBoundingClientRect().y > 500 && !this.isMenuOpend) this.offsetY = -300
        else this.offsetY = 0
        this.isMenuOpend = !this.isMenuOpend
    }
    hideMenu() { this.isMenuOpend = false }

    @Output() onShare: EventEmitter<any> = new EventEmitter<any>()
    share() { this.onShare.emit(this._file) }

    @Output() onDetails: EventEmitter<any> = new EventEmitter<any>()
    details() {
        if(this.isSelected) this.move()
        else this.onDetails.emit(this._file)
    }

    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>()
    delete() {
        this.onDelete.emit(this._file)
    }

    @Output() onMove: EventEmitter<any> = new EventEmitter<any>()
    @Input() isSelected: boolean = false
    move() {
        this.isSelected = !this.isSelected
        this.onMove.emit(this.isSelected)
    }

    @Output() onDownload: EventEmitter<any> = new EventEmitter<any>()
    download() {
        this.onDownload.emit(this._file)
    }

}
