/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 29/03/2025
 **/


export interface StudyDownload {
    study_uid: string;
    uid?: string | any;
    download_url: string;
    download_full_quality_rul: string;
    file_url: string | any;
    allow_delete: boolean | any;
    series: StudyDownloadSerie[];
}

export interface StudyDownloadSerie {
    uid: string | any;
    study_uid: string;
    modality: string | any;
    series_name: string | any;
    study_date: string | any;
    total_images: number | any;
    download_url: string | any;
    file_url: string | any;
    allow_delete: boolean | any;
}
