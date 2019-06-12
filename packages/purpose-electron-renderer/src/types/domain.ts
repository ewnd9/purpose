export interface Item {
  id: number;
  text: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isBacklog: boolean;
  isCompleted: boolean;
  isDeleted: boolean;
  schedule: string | null;
  completedAt: string | null;
}
