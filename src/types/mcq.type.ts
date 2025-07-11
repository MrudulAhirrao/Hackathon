export interface Question{
    question:string;
    options:string[];
    answer:string;
    difficulty:string;
}

export interface McqData{
    id: string;
    userId: number;
    questions: Question[];
    createdAt: string;
}