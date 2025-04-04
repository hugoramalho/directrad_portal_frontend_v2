/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 01/12/2024
 **/


export interface Estudo
{
    ris_access_created?: boolean | null | undefined;
    pacs_id?: string | undefined;
    StudyDateTime?: string | null; // ISO 8601 string format for datetime
    //------------------------------------------------------------------------------------------------------------------
    //Atributos DICOM:
    StudyInstanceUID?: string | null;
    studyDate?: string | null; // ISO 8601 string format for date
    studyTime?: string | null; // ISO 8601 string format for time
    StudyAccessDateTime?: string | null;
    StudyUpdateDateTime?: string | null;
    StudyReceiveDateTime?: string | null;
    PatientUpdateDateTime?: string | null;
    PatientCreateDateTime?: string | null;
    SeriesMetadataStorageObjectStatus?: string | null;
    StorageObjectStatus?: string | null;
    StudySizeBytes?: string | null;
    StudySizeInKB?: string | null;
    dcmStorageID?: string | null;
    DcmVersion?: string | null;
    ReasonForTheAttributeModification?: string | null;
    SourceOfPreviousValues?: string | null;
    ModifyingSystem?: string | null;
    AttributeModificationDateTime?: string | null;
    ModifiedAttributesSequence?: string | null;
    OriginalAttributesSequence?: string | null;
    NumberOfPatientRelatedStudies?: string | null;
    PatientComments?: string | null;
    PatientsTelephoneNumbers?: string | null;
    PatientsAddress?: string | null;
    PatientsAgeAttribute?: string | null;
    OtherPatientNames?: string | null;
    PatientBirthTime?: string | null;
    PatientBirthDate?: string | null;
    IssuerOfPatientId?: string | null;
    SOPClassesInStudy?: string | null;
    StudyModality?: string | null;
    AccessionNumber?: string | null;
    StudyID?: string | null;
    ReferringPhysicianName?: string | null;
    StudyDescription?: string | null;
    NumberOfStudyRelatedSeries?: string | null;
    NumberOfStudyRelatedInstances?: number | null;
    StudyPriorityID?: string | null;
    ReasonForStudy?: string | null;
    RequestingService?: string | null;
    StudyComments?: string | null;
    AdmissionID?: string | null;
    RequestedProcedureID?: string | null;
    ProcedureCode?: string | null;
    RequestingPhysicianPhone?: string | null;
    PatientHistory?: string | null;
    PatientTransportArrangements?: string | null;
    Status?: string | null;
    SpecificCharacterSetAttribute?: string | null;
    RetrieveAETitleAttribute?: string | null;
    InstanceAvailabilityAttribute?: string | null;
    RetrieveUrlAttribute?: string | null;
    PatientName?: string | null;
    PatientIDAttribute?: string | null;
    PatientSexAttribute?: string | null;
    NumberOfStudyRelatedSeriesAttribute?: string | null;
    ImagesInAcquisitionAttribute?: string | null;
}
