export interface StudyResponse {
    _id: string;
    studyCreatedBy: StudyCreatedBy;
    studyData: StudyData;
    studyEnded: string;
    studyKeywords: string[];
    studyRespondents: number;
    studyStarted: string;
    studyStatus: string;
    studyTitle: string;
}

export interface StudyCreatedBy {
    user: User;
}

export interface User {
    _id: string;
    auth_type: string;
    companyName: string | null;
    email: string;
    firstName: string;
    lastName: string | null;
}

export interface StudyData {
    [segmentKey: string]: Segment;
}

export interface Segment {
    'Base Values': BaseValues;
    Data: DataContent;
}

export interface BaseValues {
    [key: string]: number | null;
}

export interface DataContent {
    'Base Size'?: number;
    Questions?: Question[];
}

export interface Question {
    Question: string;
    options: Option[];
}

export interface Option {
    optiontext: string;
    Total?: number;
    'Age Segments'?: { [key: string]: number };
    'Gender Segments'?: { [key: string]: number };
    Mindsets?: any[];
    'Prelim-Answer Segments'?: PrelimAnswerSegment[];
}

export interface PrelimAnswerSegment {
    [key: string]: number;
}
