export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LeconSeed {
  id: string;
  titre: string;
  duree_minutes: number;
  contenu: string;
  quiz_json: QuizQuestion[];
}

export interface ParcoursSeed {
  id: string;
  titre: string;
  description: string;
  lecons: LeconSeed[];
}
