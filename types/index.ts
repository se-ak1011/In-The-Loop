export type UserId = 'marta' | 'connor';

export interface User {
  id: UserId;
  name: string;
  initials: string;
  color: string;
}

export type ProjectStatus = 'not_started' | 'in_progress' | 'waiting' | 'blocked' | 'done' | 'paused';
export type ProjectCategory = 'car' | 'home' | 'moving' | 'bills' | 'shopping' | 'child' | 'pets' | 'medical' | 'other';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'doing' | 'waiting' | 'blocked' | 'done';
export type DecisionStatus = 'needs_decision' | 'discussing' | 'decided' | 'parked';
export type UpdateType = 'note' | 'status' | 'document' | 'task' | 'decision';
export type DocumentCategory = 'insurance' | 'car' | 'home' | 'bills' | 'medical' | 'tenancy' | 'other';
export type ShoppingCategory = 'food' | 'household' | 'personal' | 'other';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: Priority;
  owner: UserId;
  progress: number;
  nextStep: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Update {
  id: string;
  projectId: string;
  text: string;
  author: UserId;
  timestamp: string;
  type: UpdateType;
  attachmentName?: string;
  partnerInputNeeded?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  owner: UserId;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  projectId?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
}

export interface ShoppingItem {
  id: string;
  listId: string;
  name: string;
  quantity?: string;
  category: ShoppingCategory;
  bought: boolean;
  notes?: string;
  addedBy: UserId;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdBy: UserId;
}

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  projectId?: string;
  uploadedBy: UserId;
  uploadedAt: string;
  notes?: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'other';
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  options: { label: string; pros?: string[]; cons?: string[] }[];
  requestedFrom: UserId;
  requestedBy: UserId;
  status: DecisionStatus;
  deadline?: string;
  projectId?: string;
  outcome?: string;
}

export interface ActivityEntry {
  id: string;
  type: 'project_created' | 'task_completed' | 'update_posted' | 'document_uploaded' | 'decision_requested' | 'shopping_bought' | 'status_changed';
  description: string;
  actor: UserId;
  timestamp: string;
  projectId?: string;
  taskId?: string;
}
