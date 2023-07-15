import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';
import { FileDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

    constructor(private http: HttpClient) { }

    helloWorld() : Observable<any> {
        return this.http.get(environment.apiHost + '/hello')
    }

    upload(file: FileDTO) : Observable<any> {
        return this.http.post(environment.apiHost + 'file', file)
    }

    update(file: FileDTO) : Observable<any> {
        return this.http.put(environment.apiHost + 'file', file)
    }

    getAll() : Observable<FileDTO[]> {
        return this.http.get<FileDTO[]>(environment.apiHost + 'files/')
    }

    getSharedFiles() : Observable<FileDTO[]> {
        return this.http.get<FileDTO[]>(environment.apiHost + 'share/')
    }

    renameFolder(oldPrefix: string, newPrefix: string) : Observable<any> {
        return this.http.put(environment.apiHost + 'folder', {old_prefix: oldPrefix, new_prefix: newPrefix})
    }

    move(fileIdsList: string[], newPath: string) : Observable<any> {
        return this.http.put(environment.apiHost + 'move', {file_ids_list: fileIdsList, new_path: newPath})
    }

    delete(deleteList: Array<string>) : Observable<any> {
        return this.http.post(environment.apiHost + 'delete', {delete_list: deleteList})
    }

    share(body: any) : Observable<any> {
        return this.http.post(environment.apiHost + 'share', body)
    }

    unshare(body: any) : Observable<any> {
        return this.http.post(environment.apiHost + 'unshare', body)
    }
    
    download(params: HttpParams): Observable<any> {
        return this.http.get(environment.apiHost + "download", {params});
    }
}
