import React, { useState, useEffect } from 'react';
import {View, Text, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import { authClient } from "@/lib/auth_client";
import { BaseModal } from "@/src/components/modal/BaseModal";
import {EditWorkspaceModal} from "@/src/components/modal/EditWorkspaceModal";
import {OrganisationQuery} from "@/src/constants/Organisation";
import {Organization} from "better-auth/client";
import {Image} from "expo-image"; // Ajuste le chemin si besoin

interface OrganisationModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectWorkspace?: (orgId: string) => void;
    onAddWorkspace : () => void
}


export function OrganisationModal({ visible, onClose, onSelectWorkspace ,onAddWorkspace}: OrganisationModalProps) {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditingWorkspaceModalOpen, setIsEditingWorkspaceModalOpen] = useState(false);
    const [workspaceQuery, setWorkspaceQuery] = useState<Organization | null>(null);
    function refresOrganizationList() {
        useEffect(() => {
            if (visible) {
                fetchOrganizations();
            }
        }, [visible]);

    }
    refresOrganizationList();

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const { data, error } = await authClient.organization.list();
            if (error) {
                console.error("Erreur lors de la récup des orga :", error);
                return;
            }
            if (data) {
                setOrganizations(data);
            }
        } catch (err) {
            console.error("Erreur réseau :", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal visible={visible} onClose={onClose} title="Vos Workspaces">
            <View style={styles.container}>
                {loading ? (
                    <Text style={styles.text}>Chargement...</Text>
                ) : organizations.length === 0 ? (
                    <Text style={styles.text}>Aucun workspace trouvé.</Text>
                ) : (
                    organizations.map((org:  Organization) => (

                        <Pressable
                            key={org.id}
                            style={styles.orgItem}
                            onPress={() => {
                                setWorkspaceQuery(org);
                                setIsEditingWorkspaceModalOpen(true);
                            }}
                        >
                            <Image
                                source={org.logo ? { uri: org.logo } : undefined}
                                style={styles.orgImage}
                                contentFit="cover"
                            />
                            <Text style={styles.orgText}>{org.name}</Text>
                        </Pressable>
                    ))
                )}
            </View>

            <TouchableOpacity style={styles.button} onPress={()=>{
               onAddWorkspace()
                onClose()
            }}>
                <Text style={styles.text}>Ajouter un workspace</Text>
            </TouchableOpacity>
            <EditWorkspaceModal
                visible={isEditingWorkspaceModalOpen}
                onClose={()=>{
                    setIsEditingWorkspaceModalOpen(false);
                    fetchOrganizations()
                }}
                onSave={()=>{
                    setIsEditingWorkspaceModalOpen(false);
                    fetchOrganizations();
                }}
                workspaceQuery={workspaceQuery}

            />
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    orgImage : {
        width : 60,
        height : 60,
        borderRadius : 10,
        margin : 10,
        backgroundColor : "#FFFFFF",
    },
    container: {
        padding: 10,
        margin: 40,
        borderBottomWidth : 1,
        borderLeftWidth : 1,
        borderRightWidth : 1,
        boxShadow : "1px 1px 4px #000",
        borderRadius : 20,
    },
    button :{
        borderWidth : 1,
        backgroundColor : "#c0ffc4",
        borderRadius : 10,
        borderColor : "#7dc881",
        boxShadow : "1px 1px 4px #000",
    },
    text: { color: '#000', textAlign: 'center', marginVertical: 10 },
    orgItem: {
        backgroundColor: '#1E293B',
        padding: 12,
        borderRadius: 10,
        display : "flex",
        flexDirection : "row",
        marginBottom: 10
    },
    orgText: { color: '#ffffff', fontSize: 16, fontWeight: '500' }
});