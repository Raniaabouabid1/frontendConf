export interface Paper {
    id: string;
    title: string;
    abstract: string;
    path: string;
    keywords: string;
    publicationDate: string; 
    submittedAt: string; 
    status: string;
    eventId: string;
    eventName: string;
    contributorsNames: string[];
    evaluations: any[]; 
  }