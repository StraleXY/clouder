import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-folder-preview',
  templateUrl: './folder-preview.component.html',
  styleUrls: ['./folder-preview.component.css']
})
export class FolderPreviewComponent {
    @Input() name: string = ''
    @Input() isShared: boolean = false

    @Output() onClick: EventEmitter<any> = new EventEmitter<any>()
    click() { this.onClick.emit() }

    isMenuOpend: boolean = false
    offsetX: number = 0
    offsetY: number = 0
    @ViewChild('targetSpan', { static: false })
    targetSpan!: ElementRef;
    toggleMenu() {
        if(this.targetSpan.nativeElement.getBoundingClientRect().y > 500 && !this.isMenuOpend) this.offsetY = -300
        else this.offsetY = 0
        this.isMenuOpend = !this.isMenuOpend
    }
    hideMenu() { this.isMenuOpend = false }

    @Output() onDetails: EventEmitter<any> = new EventEmitter<any>()
    details() {
        this.onDetails.emit()
    }

    @Output() onShare: EventEmitter<any> = new EventEmitter<any>()
    share() { this.onShare.emit(this.name) }

    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>()
    delete() {
        this.onDelete.emit()
    }
}
