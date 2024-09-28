export interface Subtopic {
  id: string;

}

export interface Topic {
  id: string;
  subtopics: Subtopic[];
}
