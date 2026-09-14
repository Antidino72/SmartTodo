import {BaseModal} from "@/src/components/modal/BaseModal";
import {Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {Image} from "expo-image";
import {authClient} from "@/lib/auth_client";
import Tooltip from "@/src/components/Tooltip";
import {AlertModal} from "@/src/components/modal/AlertModal";

interface AddOrganisationModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit : () => void;
}


export function AddWorkspaceModal({visible, onClose,onSubmit} : AddOrganisationModalProps) {
    const [name,setName] = useState("null")
    const [isSlugValid,setIsSlugValid] = useState(false);
    const [slug,setSlug] = useState("")
    const [alertMessage,setAlertMessage] = useState("")
    const [alertTitle,setAlertTitle] = useState("")
    const [isAlertModalOpen,setIsAlertModalOpen] = useState(false);
    function OpenAlertPopup(title : string, message : string) {
        setAlertTitle(title);
        setAlertMessage(message);
        setIsAlertModalOpen(true)
    }

    const [image,setImage] = useState("https://placehold.co/600x400")
    return (
        <BaseModal visible={visible} onClose={onClose} title={"Ajouter un Workspace"}>
            <View style={styles.container}>
                <Image
                    source={image}
                    style={styles.image}
                />
            </View>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder={"Name of workspace"}
                    onChangeText={setName}
                />
                <View style={[styles.row,{
                    gap : 12,
                    alignItems : "center",
                    marginBottom : 12,
                }]}>
                    <TextInput
                        style={styles.input}
                        placeholder={"ID of Workspace"}
                        onChangeText={setSlug}
                    />
                    <TouchableOpacity style={[styles.checkWorkspaceID]} onPress={()=>{
                        if (slug.trim() === ""){
                            OpenAlertPopup("Error", "Veuillez entrer un identifiant")
                            return;
                        }
                        authClient.organization.checkSlug({
                            slug: slug,
                        }).then(result => {
                            if (result.data && result.data.status) {
                                setIsSlugValid(true);
                            } else {
                                setIsSlugValid(false);
                                OpenAlertPopup("Error" ,"Cette ID est déjà utiliser ou invalide")
                            }
                        }).catch(error => {
                            console.error("Erreur lors de la vérification du slug :", error);
                            setIsSlugValid(false);
                            OpenAlertPopup("Error" ,"Impossible de vérifier le slug pour le moment.")
                        });
                    }}>
                        <Text>Valider</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.rightActions}>
                <Pressable style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Annuler</Text>
                </Pressable>
                <Tooltip text={"Il faut d'abord entrer un identifiant"}>
                    <Pressable
                        style={[
                            styles.submitBtn,
                            { opacity: isSlugValid ?1 : 0.5 },
                        ]}
                        onPress={()=>{
                            setIsSlugValid(false);
                            authClient.organization.create({
                                name: name,
                                slug: slug,
                            }).then(r => {
                                console.log(r.data);
                                onSubmit();
                                OpenAlertPopup("Succès", "Votre workspace a été créé avec succès !");


                            }).catch(err => {
                                console.error("Erreur lors de la création :", err);

                                const errorMsg = err?.message || "Une erreur est survenue lors de la création.";
                                OpenAlertPopup("Erreur", errorMsg);
                            });


                        }}
                        disabled={!isSlugValid}
                    >
                        <Text style={styles.submitText}>Enregistrer</Text>
                    </Pressable>
                </Tooltip>
            </View>
            <AlertModal
                visible={isAlertModalOpen}
                onClose={()=>{setIsAlertModalOpen(false)}}
                Message={alertMessage}
                Title={alertTitle}/>
        </BaseModal>
    )
}
const styles = StyleSheet.create({
    container : {
        margin : 10,
    },
    image : {
        width: 200,
        alignSelf : "center",
        borderRadius : 20,
        borderWidth : 1,
        height: 200
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginTop: 12,
        marginBottom: 4
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#0F172A',
        margin : 10,
    },
    checkWorkspaceID: {
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: "flex-start",
    },

    row: { flexDirection: 'row', gap: 8 },
    optionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 },
    optionText: { fontSize: 12, color: '#64748B' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
    rightActions: {
        marginVertical : 10,
        flexDirection: 'row',
        gap: 8,
        justifyContent : "flex-end"
    },
    deleteIconBtn: { padding: 10, borderRadius: 8, backgroundColor: '#FEE2E2' },
    cancelBtn: { paddingHorizontal: 14, paddingVertical: 10 },
    cancelText: { color: '#64748B', fontWeight: '600' },
    submitBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    submitText: { color: '#FFFFFF', fontWeight: '600' },
})