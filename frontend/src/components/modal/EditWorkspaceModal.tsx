import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Animated,
} from 'react-native';
import { BaseModal } from './BaseModal';
import { authClient } from "@/lib/auth_client";
import {Organization } from "better-auth/client";
import { Image } from "expo-image";
import {FontAwesome} from "@expo/vector-icons";
import {ConfirmDeleteModal} from "@/src/components/modal/ConfirmDeleteModal";
import {AlertModal} from "@/src/components/modal/AlertModal";
import { MemberProps} from "@/src/constants/Member"
import {UserCard} from "@/src/components/UserCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type EditWorkspaceModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    workspaceQuery: Organization | null;
};

type GeneralTabProps = {
    inputWorkspaceName: string;
    setInputWorkspaceName: (v: string) => void;
    inputWorkspaceImage: string;
    setInputWorkspaceImage: (v: string) => void;
    workspace: Organization | null;
    handleSaveGeneral: () => void;
    onClose? : () => void;
};

type MembersTabProps = {
    memberEmail: string;
    setMemberEmail: (v: string) => void;
    handleInviteMember: () => void;
    workspace: Organization | null;
};


// ─── Sous-composants (EN DEHORS du composant principal) ───────────────────────

function GeneralTab({
                        inputWorkspaceName,
                        setInputWorkspaceName,
                        inputWorkspaceImage,
                        setInputWorkspaceImage,
                        workspace,
                        handleSaveGeneral,
                        onClose,
                    }: GeneralTabProps) {
    const [activeConfirmDelete ,setActiveConfirmDelete] = useState(false);
    const [activeAlertModal ,setActiveAlertModal] = useState(false);


    //alert Message
    const [alertMessage,setAlertMessage] = useState("");
    const [alertTitle,setAlertTitle] = useState("");
    return (
        <View style={styles.section}>
            <Text style={styles.label}>Nom du Workspace</Text>
            <TextInput
                style={styles.input}
                value={inputWorkspaceName}
                onChangeText={setInputWorkspaceName}
                placeholder={workspace?.name ?? ''}
            />

            <Text style={styles.label}>Lien de l'image ou du logo</Text>
            <TextInput
                style={styles.input}
                value={inputWorkspaceImage}
                onChangeText={setInputWorkspaceImage}
                placeholder={workspace?.logo ?? 'https://...'}
            />
            <View style={{
                display : "flex",
                flexWrap : "wrap",
                flexDirection : "row",
                justifyContent : "space-between"
            }}>
                <Pressable style={styles.deleteBtn} onPress={()=>{setActiveConfirmDelete(true)}}>
                    <FontAwesome name="trash" size={16} color="#DC2626" />
                </Pressable>
                <View style={{
                    display : "flex",
                    flexDirection : "row",
                    gap : 10,
                }}>
                    <Pressable style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.primaryBtnText}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.primaryBtn} onPress={handleSaveGeneral}>
                        <Text style={styles.primaryBtnText}>Enregistrer les modifications</Text>
                    </Pressable>
                </View>
            </View>
            <ConfirmDeleteModal
                visible={activeConfirmDelete}
                onClose={()=>setActiveConfirmDelete(false)}
                onConfirm={async ()=>{
                    setActiveConfirmDelete(false)
                    if (!workspace) return;

                    const { data, error } = await authClient.organization.delete({
                        organizationId: workspace.id,
                    });
                    if (data){
                        setAlertMessage("Workspace "+workspace?.name +" supprimez avec succès");
                        setAlertTitle("Workspace supprimé !")
                        setActiveAlertModal(true)
                    }else if (error) {
                        setAlertMessage("Une erreur c'est provenu lors de la suppréssion du workspace");
                        setAlertTitle("Error")
                        setActiveAlertModal(true)
                    }

                }}
                titleCustom={"Supprimer le Workspace ? "}
                taskTitle={workspace?.name ?? ''}
            >

            </ConfirmDeleteModal>
            <AlertModal
                visible={activeAlertModal}
                onClose={()=>{
                    setActiveAlertModal(false)
                }}
                onConfirm={
                    onClose
                }
                Message={"Workspace "+workspace?.name +" supprimez avec succès"}
                Title={"Workspace supprimé !"}
            />
        </View>
    );
}
async function getMembers(workspace_id: string | undefined){
    const { data, error } = await authClient.organization.listMembers({
        query: {
            organizationId: workspace_id,
            limit: 100,
            offset: 0,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
    });
    return data;
}
function MembersTab({
                        memberEmail,
                        setMemberEmail,
                        handleInviteMember,
                        workspace,
                    }: MembersTabProps) {
    const [members, setMembers] = useState<MemberProps[]>([]);
    useEffect(() => {
        if (!workspace?.id) return;

        getMembers(workspace.id).then((result) => {
            if (!result) {
                setMembers([]);
                return;
            }
            setMembers(result.members);
        });
    }, [workspace?.id]);

    return (                                                                                    
        <View style={styles.section}>                                                           
            <Text style={styles.label}>Inviter un membre</Text>                                 
            <View style={styles.inviteRow}>                                                     
                <TextInput                                                                      
                    style={[styles.input, styles.inviteInput]}                                  
                    placeholder="email@example.com"                                             
                    value={memberEmail}                                                         
                    onChangeText={setMemberEmail}                                               
                    keyboardType="email-address"                                                
                    autoCapitalize="none"                                                       
                />                                                                              
                <Pressable style={styles.inviteBtn} onPress={handleInviteMember}>               
                    <Text style={styles.inviteBtnText}>Inviter</Text>                           
                </Pressable>                                                                    
            </View>                                                                             
                                                                                                
            <Text style={[styles.label, { marginTop: 20 }]}>Membres actuels</Text>
            {members.map((member) => (
                <View key={member.id} style={styles.memberItem}>
                    <UserCard
                        image={member?.user.image ?? "https://lh3.googleusercontent.com/a/default-user=s96-c"}
                        name={member?.user.name ?? "Utilisateur"}
                        email={member?.user.email ?? ""}
                        id={member?.user.id ?? ""}
                    />
                </View>
            ))}
        </View>
    );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function EditWorkspaceModal({ visible, onClose, workspaceQuery, onSave }: EditWorkspaceModalProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');
    const [workspace, setWorkspace] = useState<Organization | null>(null);
    const [inputWorkspaceName, setInputWorkspaceName] = useState(workspaceQuery?.name ?? '');
    const [inputWorkspaceImage, setInputWorkspaceImage] = useState(workspaceQuery?.logo ?? '');
    const [memberEmail, setMemberEmail] = useState('');

    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Fetch workspace
    useEffect(() => {
        if (!workspaceQuery || !visible) return;

        const fetchWorkspace = async () => {
            const { data, error } = await authClient.organization.getOrganization({
                query: {
                    organizationId: workspaceQuery.id,
                    organizationSlug: workspaceQuery.slug,
                },
            });
            if (error) {
                console.error(error);
            } else if (data) {
                setWorkspace(data);
                setInputWorkspaceName(data.name ?? '');
                setInputWorkspaceImage(data.logo ?? '');
            }
        };

        fetchWorkspace();
    }, [workspaceQuery, visible]);

    // Transition entre tabs
    function switchTab(tab: 'general' | 'members') {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setActiveTab(tab);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });
    }

    const handleSaveGeneral = async () => {
        const { error } = await authClient.organization.update({
            data: {
                name: inputWorkspaceName,
                slug: workspace?.slug,
                logo: inputWorkspaceImage,
            },
            organizationId: workspace?.id,
        });

        if (error) {
            console.error(error);
            return;
        }

        onSave();
        onClose();
    };

    const handleInviteMember = async () => {
        authClient.organization.listInvitations


        if (!workspace?.id) {
            console.error("Pas de workspace actif, abandon");
            return;
        }

        const { data, error } = await authClient.organization.inviteMember({
            email: memberEmail,
            role: "member",
            organizationId: workspace.id,
        });

        if (error) {
            console.error("Erreur invite-member:", error);
        } else {
            console.log("Invitation créée:", data);
        }
    };

    const resolvedUri = inputWorkspaceImage || workspaceQuery?.logo || '';

    return (
        <BaseModal visible={visible} onClose={onClose} title={`Gérer ${workspace?.name ?? ''}`}>

            <Image
                style={styles.image}
                source={resolvedUri ? { uri: resolvedUri } : undefined}
                contentFit="cover"
                transition={500}
            />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <Pressable
                    style={[styles.tab, activeTab === 'general' && styles.activeTab]}
                    onPress={() => switchTab('general')}
                >
                    <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>
                        Général
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.tab, activeTab === 'members' && styles.activeTab]}
                    onPress={() => switchTab('members')}
                >
                    <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
                        Membres
                    </Text>
                </Pressable>
            </View>

            {/* Contenu animé */}
            <Animated.View style={{ opacity: fadeAnim }}>
                {activeTab === 'general' ? (
                    <GeneralTab
                        inputWorkspaceName={inputWorkspaceName}
                        setInputWorkspaceName={setInputWorkspaceName}
                        inputWorkspaceImage={inputWorkspaceImage}
                        setInputWorkspaceImage={setInputWorkspaceImage}
                        workspace={workspace}
                        handleSaveGeneral={handleSaveGeneral}
                        onClose={onClose}
                    />
                ) : (
                    <MembersTab
                        memberEmail={memberEmail}
                        setMemberEmail={setMemberEmail}
                        handleInviteMember={handleInviteMember}
                        workspace={workspace}
                    />
                )}
            </Animated.View>

        </BaseModal>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    image: {
        width: 90,
        height: 90,
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 16,
        boxShadow: '1px 1px 3px #000',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2563EB',
    },
    tabText: {
        color: '#64748B',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#2563EB',
    },
    section: {
        paddingVertical: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        marginBottom: 16,
        color: '#0F172A',
    },
    primaryBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingHorizontal : 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    cancelBtn :{
        backgroundColor : "#acacac",
        borderRadius: 8,
        paddingHorizontal : 4,
        paddingVertical: 12,
        alignItems: 'center',

    },
    deleteBtn: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FEE2E2'
    },
    inviteRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    inviteInput: {
        flex: 1,
        marginBottom: 0,
    },
    inviteBtn: {
        backgroundColor: '#0F172A',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    memberItem: {
        padding: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
        marginTop: 6,
    },
    memberText: {
        fontSize: 13,
        color: '#334155',
    },
});