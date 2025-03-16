
export interface AssistantSkill {
  id: string;
  name: string;
}

export interface Assistant {
  id: string;
  name: string;
  avatar_url: string;
  skills: AssistantSkill[];
  introduction: string;
  persona: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAssistantDto {
  name: string;
  avatar_url?: string;
  skills: string[];
  introduction: string;
  persona: string;
  is_public: boolean;
}

export interface UpdateAssistantDto extends Partial<CreateAssistantDto> {
  id: string;
}
