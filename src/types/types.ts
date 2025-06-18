export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4o' ;

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}


export type SessionType = {
  user_id: string;
  session_id: string;
  title: string | null;
  session_time: string;
  chattings: any[];
};

export type GroupedSessionsType = {
  date: string;
  sessions: SessionType[];
}[];