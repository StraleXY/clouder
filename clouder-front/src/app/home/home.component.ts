import { Component, OnInit } from '@angular/core';
import { FilesService } from '../services/files.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FileDTO } from '../models';
import { HttpParams } from '@angular/common/http';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

    ownerEmail: string = ""
    currentPath: string = ""
    pathFolders: string[] = []
    showingShared: boolean = false
    deleteList: Array<string> = []

    constructor(private filesService: FilesService, private authService: AuthService, private router: Router, private webSocketService: WebsocketService) {
        webSocketService.connect();
        webSocketService.eventCallback.subscribe(res => {
            res = JSON.parse(res)
            console.log(res)
            console.log(res.message)
            console.log(res.list)
            if(res.message == "Upload successful") this.finishUpload(res.list[0]) //TODO INJECT ID
            if(res.message == "Delete successful") {
                this.deleting = false
                setTimeout(() => {
                    for (let id in res.list) {
                        let index = this.allFiles.findIndex(d => d.id === id)
                        this.allFiles.splice(index, 1);
                    }
                    this.showFiles()
                }, 1500);
            }
        })
        this.authService.getCurrentUser().then((user) => {
            this.ownerEmail = user.attributes.email
            localStorage.setItem('email', this.ownerEmail);
            if (user == null || localStorage.getItem('email') == '') this.router.navigate(['/'])
            this.getFiles()
        })
    }

    toggleShowShared(show: boolean) {
        this.showingShared = show
        this.currentPath = ""
        this.getFiles()
    }

    getFiles() {
        if(this.showingShared) {
            this.filesService.getSharedFiles().subscribe(res => {
                console.log(res)
                res.forEach(shared => {
                    let path = shared.shared_with.filter(x => x[0] == this.ownerEmail)[0]
                    console.log(path[1]);
                    if(path[1] == undefined) shared.file_path = ""
                    else shared.file_path = path[1]
                })
                this.allFiles = res
                this.showFiles()
            })
        }
        else {
            this.filesService.getAll().subscribe(res => {
                console.log(res)
                this.allFiles = res
                this.showFiles()
            })
        }
    }

    showFiles() {
        this.files = []
        this.allFiles.forEach(file => {
            if (file.file_path == this.currentPath) this.files.push(file)
            else if (file.file_path.startsWith(this.currentPath)) {
                let folders = (file.file_path.replace(this.currentPath, '')).split('/')
                let folder_name = folders.length >= 2 ? folders[1] : folders
                if(!this.files.find(x => x == folder_name)) this.files.push(folder_name)
            }
        })
        this.files.sort((a, b) => {
            if(typeof a == 'string' && typeof b != 'string') return -1;
            else if (typeof a != 'string' && typeof b == 'string') return 1;
            else if (typeof a == 'string' && typeof b == 'string') return 0;
            let dateA = new Date(a.file_created_at)
            let dateB = new Date(b.file_created_at)
            if (dateA > dateB) return -1;
            else if (dateA < dateB) return 1;
            else return 0;
        });
        this.pathFolders = this.currentPath.split('/')
        this.pathFolders.shift()
    }

    selectedFile: FileDTO = {
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
    uploadingFile: FileDTO | null = null
    isSharingToggled: boolean = false
    toggleSharing(file: any) {
        if (file == null) this.isSharingToggled = false
        else this.isSharingToggled = true
        if (typeof(file) !== 'string')
            this.selectedFile = file
        else {
            let name = file
            this.allFiles.forEach(f => {
                if (f.file_name === "#folder_keeper# - " + name && f.file_description === "#folder_keeper#")
                    this.selectedFile = f
            })
        }
    }

    isDetailsToggled: boolean = false
    hideDetails(file: any) {
        this.uploadingFile = file
        this.isDetailsToggled = false
        this.selectedFile = file
        console.log(file);
    }
    showDetails(file: any) {
        this.isDetailsToggled = true
        this.selectedFile = file
    }
    finishUpload(id: string = "") {
        if(this.uploadingFile == null) return
        this.uploadingFile.id = id
        console.log(this.uploadingFile)
        this.allFiles.push(this.uploadingFile)
        this.showFiles()
        this.uploadingFile = null
    }

    selectedFolder: string = ''
    isFolderAddEditToggled: boolean = false
    isFolder(item: any): boolean {
        return typeof item == 'string'
    }
    navigate(folder_name: string) {
        this.currentPath += '/' + folder_name
        this.showFiles()
    }
    back() {
        this.currentPath = this.currentPath.slice(0, this.currentPath.lastIndexOf('/'));
        this.showFiles()
    }
    toggleAddEditFolder(name: string) {
        this.selectedFolder = name
        this.isFolderAddEditToggled = !this.isFolderAddEditToggled
    }
    onFolderSave(file: FileDTO | null) {
        if (file == null) {
            window.location.reload()
            return
        }
        this.uploadingFile = file
        this.isFolderAddEditToggled = false
    }

    upload() {
        this.selectedFile = {
            id: "",
            owner_email: this.ownerEmail,
            file_name: "",
            file_type: "",
            file_path: this.currentPath,
            file_description: "",
            file_created_at: (new Date()).toISOString(),
            file_modified_at: (new Date()).toISOString(),
            file_size: '0',
            shared_with: [],
            tags: [],
            file_base64: undefined
        }
        this.isDetailsToggled = true
    }

    logout() {
        this.webSocketService.disconnect();
        this.authService.logout().then((res) => {
            this.router.navigate(['/']);
        })
    }

    files: any[] = []
    allFiles: FileDTO[] = []
    prepareFilesList() : any[] {
        return this.files.filter(x => (typeof x != 'string' && x.file_type != '#folder_keeper#' && x.file_path == this.currentPath) || typeof x == 'string')
    }

    toMove: FileDTO[] = []
    onMove(file: FileDTO, add: boolean) {
        if (add && this.toMove.find(x => x == file) == undefined) this.toMove.push(file)
        else {
            const index = this.toMove.indexOf(file, 0);
            if (index > -1) this.toMove.splice(index, 1);
        }
    }
    isForMove(file: FileDTO) : boolean {
        return this.toMove.find(x => x == file) != undefined
    }
    confirmMove() {
        this.filesService.move(this.toMove.map(x => x.id), this.currentPath).subscribe(res => {
            this.toMove = []
            this.getFiles()
        })
    }

    deleting: boolean = false
    onDeleteFile(file: FileDTO) {
        let deleteList: Array<string> = []
        deleteList.push(file.id)
        console.log(deleteList)
        this.filesService.delete(deleteList).subscribe(res => {
            this.deleting = true
            console.log("Delete started")
        })
    }

    onDeleteFolder(folder: string) {
        let folderPath = this.currentPath + "/" + folder
        this.deleteList = []
        this.allFiles.forEach(file => {
            if (file.file_path.startsWith(folderPath)) this.deleteList.push(file.id)
        })
        console.log(this.deleteList)
        this.deleting = true
        this.filesService.delete(this.deleteList).subscribe(res => {
            console.log("Delete started")
        })
    }

    onDownload(file: FileDTO) {
        console.log("Donwloading...");
        console.log(file);

        let params = new HttpParams();
        params = params.set("file_id", file.id);
        this.filesService.download(params).subscribe(res => {
            console.log("USPEO DOWNLOAD");
            var link = document.createElement("a");
            link.download = file.file_name;
            link.href = res;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

    startSharing(event: any) {
        let file = event.file
        let file_list = []
        if (file.file_description == "#folder_keeper#")
            this.allFiles.forEach(f => {
                if (f.file_path.startsWith(file.file_path))
                    file_list.push({file_id: f.id, file_path: f.file_path.replace(this.currentPath, "")})
            })
        else
            file_list.push({file_id: file.id, file_path: ""})
        this.filesService.share({"email": event.email, "file_list": file_list}).subscribe(res => {
            console.log("USPEO SHARE")
        })
    }

    stopSharing(event: any) {
        let file = event.file
        let file_list = []
        if (file.file_description == "#folder_keeper#")
            this.allFiles.forEach(f => {
                if (f.file_path.startsWith(file.file_path))
                    file_list.push(f.id)
            })
        else
            file_list.push(file.id)
        console.log(file_list)
        this.filesService.unshare({"email": event.email, "file_list": file_list}).subscribe(res => {
            console.log("USPEO STOP SHARE")
            window.location.reload()
        })
    }
}
