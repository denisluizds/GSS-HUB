export type Policy = {
  id: string;
  title: string;
  description: string;
  scope: string;
  implementationDate: string;
  considerations: string;
  publicationDate: string;
  lastUpdated: string;
};

export type AttachedFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
};

export type SiteContent = {
  homeTitle: string;
  homeSubtitle: string;
  policiesTitle: string;
};

export type Banner = {
  id: string;
  message: string;
  isActive: boolean;
  lastUpdated: string;
  duration: number | null; 
  activatedAt: string | null;
};

export type Recognition = {
  id: string;
  employeeName: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

export type FastLearningVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  viewCount: number;
  createdAt: string;
};

export type SuggestionStatus = 'new' | 'in_progress' | 'approved' | 'refused';

export type Suggestion = {
    id: string;
    text: string;
    status: SuggestionStatus;
    createdAt: string;
};

// Matriz Inteligente Types
export interface DecisionOption {
  text: string;
  nextNodeId: string;
}

export interface DecisionResult {
  policy: string;
  offered: string;
  exemption?: string;
  restrictions?: string;
  observations?: string;
  isNegative?: boolean;
}

export interface FlowNode {
  id: string;
  type: 'question' | 'result';
  text?: string;
  options?: DecisionOption[];
  result?: DecisionResult;
}

export interface OperationalFlow {
  id: string;
  title: string;
  description: string;
  active: boolean;
  rootNodeId: string;
  nodes: Record<string, FlowNode>;
}

export interface AgentSession {
  bp: string;
  protocol: string;
  locator: string;
  ticket?: string;
  startTime: string;
}

export interface RecordedCase {
  id: string;
  agentBp: string;
  protocol: string;
  locator: string;
  flowTitle: string;
  path: string[];
  finalResult: DecisionResult;
  timestamp: string;
}

export type UserRole = 'admin' | 'gss';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}
