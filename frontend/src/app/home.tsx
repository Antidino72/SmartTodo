import React, {useState, useEffect} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import "@/src/global.css";
import {PriorityBadge, PriorityLevel} from "@/src/components/prioritySystem";
import {StatusBadge, TaskStatus} from "@/src/components/statusSysteme";
import {AddTaskModal} from "@/src/components/modal/AddTaskModal";
import {EditTaskModal} from "@/src/components/modal/EditTaskModal";
import {Task } from "@/src/constants/Task";
import {ConfirmDeleteModal} from "@/src/components/modal/ConfirmDeleteModal";
import {MenuBurger} from "@/src/components/MenuBurger";
import {ProfilModal} from "@/src/components/modal/ProfilModal";
import {authClient} from "@/lib/auth_client";
import {useAuth} from "@/src/context/AuthContext";
import {deleteTask, addTask, updateTask, getTaskList} from "@/src/hooks/useTasks";
import {OrganisationModal} from "@/src/components/modal/OrganisationModal";
import {AddWorkspaceModal} from "@/src/components/modal/AddWorkspaceModal";


export default function DashboardScreen() {
    const {refreshSession} = useAuth()
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    // Workspace
    const [isOrganisationOpen, setIsOrganisationOpen] = useState(false);
    const [isAddOrganisationOpen, setAddIsOrganisationOpen] = useState(false);


    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [IsProfileModal, setIsProfileModal] = useState(false);


    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [tasklist, settasklist] = useState<Task[] | []>([]);


    useEffect(() => {
        async function loadTasks() {
            try {
                const tasks = await getTaskList();

                console.log("tasks =", tasks);
                console.log("Array ?", Array.isArray(tasks));

                settasklist(tasks);
            } catch (error) {
                console.error("Erreur chargement tâches", error);
            }
        }
        loadTasks();
    }, []);

    const handleTaskPress = (task: Task) => {
        setSelectedTask(task);
        setIsEditTaskOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedTask) {
            deleteTask(selectedTask.id);
            settasklist(tasklist.filter(t => t.id !== selectedTask.id));
        }
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
    };


    const totalTasks = tasklist.length;
    const completedTasksCount = tasklist.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    return (
        <ScrollView className="card-perspective" style={styles.container}
                    contentContainerStyle={styles.content}>
            <MenuBurger
                openProfilModal={() => setIsProfileModal(true)}
                openWorkspaceModel={()=> setIsOrganisationOpen(true)}
            />
            <Text style={styles.headerTitle}>Tableau de bord</Text>

            {/* Statistiques */}
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, {backgroundColor: '#E0F2FE'}]}>
                    <Text style={styles.statNumber}>{totalTasks}</Text>
                    <Text style={styles.statLabel}>Tâches actives</Text>
                </View>

                <View style={[styles.statCard, {backgroundColor: '#DCFCE7'}]}>
                    <Text style={styles.statNumber}>
                        {completionRate}%
                    </Text>
                    <Text style={styles.statLabel}>Complétées</Text>
                </View>

                <Pressable className="card-3d-hover" onPress={() => setIsAddTaskOpen(true)}
                           style={[styles.statCard, styles.addCard]}>
                    <Text style={styles.addCardText}>+ Ajouter une tâche</Text>
                </Pressable>
            </View>

            {/* Liste */}
            <Text style={styles.sectionTitle}>Tâches</Text>
            <View style={styles.taskListContainer}>
                {tasklist.map((task, index) => (
                    <Pressable
                        key={task.id ?? index}
                        className="card-3d-hover"
                        style={styles.taskCard}
                        onPress={() => handleTaskPress(task)}
                    >
                        <View style={styles.taskHeader}>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            <PriorityBadge level={task.priority as PriorityLevel}/>
                        </View>

                        <View style={styles.taskFooter}>
                            <Text style={styles.taskCategory}>{task.category}</Text>
                            <StatusBadge status={task.status as TaskStatus}/>
                        </View>
                    </Pressable>
                ))}
            </View>

            {/* Modales */}
            <AddTaskModal
                visible={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
                onSaveTask={async (newTaskData) => {
                    await addTask(newTaskData);
                    const updated = await getTaskList();
                    settasklist(updated);
                    setIsAddTaskOpen(false);
                }}
            />

            <EditTaskModal
                visible={isEditTaskOpen}
                onClose={() => setIsEditTaskOpen(false)}
                onUpdateTask={async (updatedTask) => {
                    await updateTask(updatedTask);
                    const updated = await getTaskList();
                    settasklist(updated);
                    setIsEditTaskOpen(false);
                }}
                onDeleteRequest={() => {
                    setIsEditTaskOpen(false);
                    setIsDeleteModalOpen(true);
                }}
                task={selectedTask}
            />

            <ProfilModal
                visible={IsProfileModal}
                onClose={() => setIsProfileModal(false)}
                onConfirm={async ({name, email, image}) => {
                    try {
                        await authClient.updateUser({ name, image });
                        refreshSession();
                    } catch (error) {
                        console.error("Erreur lors de la mise à jour du profil", error);
                    }
                }}
            />

            <ConfirmDeleteModal
                visible={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                taskTitle={selectedTask?.title}
            />
            <AddWorkspaceModal
                visible={isAddOrganisationOpen}
                onClose={()=>{setAddIsOrganisationOpen(false)}}
                onSubmit={()=>{
                    setAddIsOrganisationOpen(false);

                }}
            />

            <OrganisationModal
                visible={isOrganisationOpen}
                onClose={()=>{setIsOrganisationOpen(false)}}
                onAddWorkspace={()=>{setAddIsOrganisationOpen(true)}}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    content: { padding: 20 },
    headerTitle: { fontSize: 25, fontWeight: 'bold', color: '#FFFFFF', paddingVertical: 10, marginBottom: 20 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, backgroundColor: '#0a1428', marginBottom: 28, padding: 10, borderRadius: 10 },
    statCard: { flex: 1, padding: 16, borderRadius: 16 },
    addCard: { backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
    addCardText: { fontSize: 16, fontWeight: '600', color: '#0F172A', textAlign: 'center' },
    statNumber: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },
    statLabel: { fontSize: 14, color: '#475569', marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 12 },
    taskListContainer: { display: 'flex', alignItems: 'center', width: '100%' },
    taskCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', width: '95%', cursor: 'pointer' },
    taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    taskTitle: { fontSize: 15, fontWeight: '500', color: '#1E293B', flex: 1, marginRight: 8 },
    taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    taskCategory: { fontSize: 13, color: '#64748B' },
});