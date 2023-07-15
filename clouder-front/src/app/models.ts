export interface FileDTO {
    id: string;
    owner_email: string;
    file_name: string;
    file_type: string;
    file_path: string;
    file_description: string;
    file_size: string;
    file_base64: string | undefined;
    file_created_at: string;
    file_modified_at: string;
    shared_with: string[];
    tags: string[];
}

export interface Folder {
    name: string;
    path: string
}