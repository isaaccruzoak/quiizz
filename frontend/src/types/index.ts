export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  category: string;
  createdAt: string;
  createdBy: string | null;
  votesA: number;
  votesB: number;
  totalVotes: number;
  percentA: number;
  percentB: number;
  userVote: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  _count?: { votes: number; questions: number };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface VoteResult {
  vote: { id: string; choice: string };
  stats: {
    votesA: number;
    votesB: number;
    totalVotes: number;
    percentA: number;
    percentB: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HistoryItem {
  voteId: string;
  choice: string;
  votedAt: string;
  question: Question;
}
