export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4o' ;

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}
