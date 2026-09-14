import { backend_adress } from "@/src/constants/Backend";

const API_URL = `${backend_adress}/api/tasks`;

import {Task} from "@/src/constants/Task";

export async function getTaskList(): Promise<Task[]> {
    const response = await fetch(API_URL, {
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
    });
    const data = await response.json();
    return data.tasks || data;
}

export async function addTask(newTaskData: Omit<Task, 'id'>): Promise<Task> {
    console.log(newTaskData);
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(newTaskData),
    });
    const data = await response.json();
    return data.task || data;
}

export async function updateTask(updatedTask: Task): Promise<Task> {
    const response = await fetch(`${API_URL}/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(updatedTask),
    });
    const data = await response.json();
    return data.task || data;
}

export async function deleteTask(taskId: string | number): Promise<void> {
    await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        credentials: "include"
    });
}