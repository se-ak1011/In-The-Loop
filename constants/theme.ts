export const Colors = {
  background: '#151718',
  surface: '#1D2022',
  elevated: '#24282B',
  primary: '#F4F1EA',
  secondary: '#A7AAA7',
  accent: '#6C7565',
  warning: '#B89B5E',
  danger: '#A65F5F',
  success: '#7E9278',
  border: '#2A2F32',
  muted: '#3A3F42',
} as const;

export const StatusColors: Record<string, string> = {
  not_started: '#A7AAA7',
  in_progress: '#7E9278',
  waiting: '#B89B5E',
  blocked: '#A65F5F',
  done: '#6C7565',
  paused: '#A7AAA7',
  todo: '#A7AAA7',
  doing: '#7E9278',
  needs_decision: '#B89B5E',
  discussing: '#B89B5E',
  decided: '#7E9278',
  parked: '#A7AAA7',
};

export const StatusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  waiting: 'Waiting',
  blocked: 'Blocked',
  done: 'Done',
  paused: 'Paused',
  todo: 'To Do',
  doing: 'Doing',
  needs_decision: 'Needs Decision',
  discussing: 'Discussing',
  decided: 'Decided',
  parked: 'Parked',
};

export const CategoryLabels: Record<string, string> = {
  car: 'Car',
  home: 'Home',
  moving: 'Moving',
  bills: 'Bills',
  shopping: 'Shopping',
  child: 'Child',
  pets: 'Pets',
  medical: 'Medical / Admin',
  other: 'Other',
};

export const CategoryIcons: Record<string, string> = {
  car: '🚗',
  home: '🏠',
  moving: '📦',
  bills: '💸',
  shopping: '🛒',
  child: '👦',
  pets: '🐾',
  medical: '🏥',
  other: '📋',
};
