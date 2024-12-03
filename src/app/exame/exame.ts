export interface Estudo {
  studyInstanceUID?: string | null;
  studyDate?: string | null; // ISO 8601 string format for date
  studyTime?: string | null; // ISO 8601 string format for time
  studyDateTime?: string | null; // ISO 8601 string format for datetime
  studyModality?: string | null;
  accessionNumber?: string | null;
  studyID?: string | null;
  referringPhysicianName?: string | null;
  studyDescription?: string | null;
  numberOfStudyRelatedSeries?: number | null;
  numberOfStudyRelatedInstances?: number | null;
  studyPriorityID?: string | null;
  reasonForStudy?: string | null;
  requestingService?: string | null;
  studyComments?: string | null;
  admissionID?: string | null;
  requestedProcedureID?: string | null;
  procedureCode?: string | null;
  requestingPhysicianPhone?: string | null;
  patientHistory?: string | null;
  patientTransportArrangements?: string | null;
  status?: string | null;
  specificCharacterSetAttribute?: string | null;
  retrieveAETitleAttribute?: string | null;
  instanceAvailabilityAttribute?: string | null;
  retrieveUrlAttribute?: string | null;
  patientName?: string | null;
  patientIDAttribute?: string | null;
  patientSexAttribute?: string | null;
  numberOfStudyRelatedSeriesAttribute?: string | null;
}