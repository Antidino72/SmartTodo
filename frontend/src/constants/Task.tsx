export interface Task {
    id: string | number;
    title: string;
    completed?: boolean; // Optionnel si géré différemment
    category: string;
    priority: 'low' | 'medium' | 'high' ;
    status: TaskStatus;
    [key: string]: any; // Pour être tranquille s'il y a d'autres champs
}
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
