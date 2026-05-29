export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string | null;
  path: string;
  details: string[];
}
