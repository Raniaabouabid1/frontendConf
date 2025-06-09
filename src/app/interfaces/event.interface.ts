export interface Event {
  id: string;
  title: string;
  acronym: string;
  eventType: string;
  startsAt: Date;
  endsAt: Date;
  theme: string;
  location: string;
  topics: string;
  subTopics: string;
  logo: string;
  description: string;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'ToBeRevised';
}
