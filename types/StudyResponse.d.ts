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
    Mindsets?: Array<{ [key: string]: number }>;
    'Prelim-Answer Segments'?: PrelimAnswerSegment[];
    [key: string]: string | number | { [key: string]: number } | Array<{ [key: string]: number }> | PrelimAnswerSegment[] | undefined;
}

export interface PrelimAnswerSegment {
    [key: string]: number;
}
