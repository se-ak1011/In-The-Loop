import {
  ACTIVITY,
  CURRENT_USER,
  DECISIONS,
  DOCUMENTS,
  PROJECTS,
  SHOPPING_ITEMS,
  SHOPPING_LISTS,
  TASKS,
  UPDATES,
  USERS,
} from '../data/mockData';
import { Project } from '../types';

export const mockRepository = {
  users: USERS,
  currentUser: CURRENT_USER,
  projects: PROJECTS,
  tasks: TASKS,
  updates: UPDATES,
  decisions: DECISIONS,
  documents: DOCUMENTS,
  shoppingLists: SHOPPING_LISTS,
  shoppingItems: SHOPPING_ITEMS,
  activity: ACTIVITY,
  getProject(id: string | undefined): Project | undefined {
    return PROJECTS.find(project => project.id === id);
  },
  getProjectBundle(id: string | undefined) {
    const project = this.getProject(id);

    return {
      project,
      updates: UPDATES.filter(update => update.projectId === id).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
      tasks: TASKS.filter(task => task.projectId === id),
      documents: DOCUMENTS.filter(document => document.projectId === id),
      decisions: DECISIONS.filter(decision => decision.projectId === id),
    };
  },
};
