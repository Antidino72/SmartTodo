import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions} from 'react-native';
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import {useAuth} from "@/src/context/AuthContext";
import {router} from "expo-router";
import {UserCard} from "@/src/components/UserCard";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

interface MenuBurgerProps {
    openProfilModal?: () => void
    openWorkspaceModel?: () => void
}


export function MenuBurger({openProfilModal,openWorkspaceModel} : MenuBurgerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const animationValue = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

    const toggleMenu = () => {
        const toValueOpen = !isOpen;

        if (toValueOpen) {
            setIsVisible(true);

            // Ouverture → spring sympa
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 40,
            }).start();

        } else {
            // Fermeture → timing précis
            Animated.timing(slideAnim, {
                toValue: -MENU_WIDTH,
                duration: 400,        // ← exactement 200ms puis ferme
                useNativeDriver: true,
            }).start(() => {
                setIsVisible(false);  // ← déclenché exactement à la fin
            });
        }

        Animated.timing(animationValue, {
            toValue: toValueOpen ? 1 : 0,
            duration: 800,
            useNativeDriver: true,
        }).start();

        setIsOpen(toValueOpen);
    };


    const topBarRotate = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });
    const topBarTranslate = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 13],
    });
    const middleBarOpacity = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });
    const bottomBarRotate = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-45deg'],
    });
    const bottomBarTranslate = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -13],
    });

    const {isAuthenticated, signOut, user, refreshSession} = useAuth();

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={toggleMenu} style={styles.burgerButton} activeOpacity={0.8}>
                <Animated.View
                    style={[styles.bar, {transform: [{translateY: topBarTranslate}, {rotate: topBarRotate}]}]}/>
                <Animated.View style={[styles.bar, {top: 13, opacity: middleBarOpacity}]}/>
                <Animated.View style={[styles.bar, {
                    top: 26,
                    transform: [{translateY: bottomBarTranslate}, {rotate: bottomBarRotate}]
                }]}/>
            </TouchableOpacity>

            {isVisible && (
                <View style={styles.overlayContainer}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        activeOpacity={1}
                        onPress={toggleMenu}
                    />
                    <Animated.View style={[styles.drawer, {transform: [{translateX: slideAnim}]}]}>
                        <Text style={styles.menuTitle}>Smart TODO</Text>
                        <UserCard
                            image={user?.image ?? "https://lh3.googleusercontent.com/a/default-user=s96-c"}
                            name={user?.name ?? "Utilisateur"}
                            email={user?.email ?? ""}
                            id={user?.id ?? ""}
                        />
                        <TouchableOpacity style={styles.menuItem} onPress={()=>{
                            toggleMenu()
                            openProfilModal?.();
                        }}>
                            <FontAwesome name="user" color="white" size={20}/>
                            <Text style={styles.menuItemText}>Profil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <FontAwesome name="gear" color="white" size={20}/>
                            <Text style={styles.menuItemText}>Paramètres</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={()=>{
                            toggleMenu()
                            openWorkspaceModel ? openWorkspaceModel() : console.error("Error when oppening workspaceModal")
                        }}>
                            <FontAwesome5 name="network-wired" size={20} color="white" />
                            <Text style={styles.menuItemText}>Workspace</Text>
                        </TouchableOpacity>
                        {isAuthenticated && (
                            <TouchableOpacity onPress={() => {
                                signOut().then(
                                    () => {
                                        toggleMenu();
                                    }
                                )
                            }} style={[styles.menuItem, {backgroundColor: "#710c0c"}]}>
                                <FontAwesome name="power-off" color="white" size={20}/>
                                <Text style={styles.menuItemText}>Déconnexion</Text>
                            </TouchableOpacity>
                        )}

                        {

                            !isAuthenticated && (
                            <TouchableOpacity onPress={() => {
                                router.push("/auth/login");
                                toggleMenu();
                            }} style={[styles.menuItem, {backgroundColor: "#4f6dea"}]}>
                                <FontAwesome name="sign-in" color="white" size={20}/>
                                <Text style={styles.menuItemText}>Connexion</Text>
                            </TouchableOpacity>
                        )}

                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        zIndex: 999,
    },
    burgerButton: {
        width: 40,
        height: 32,
        position: 'relative',
        zIndex: 1010,
        margin: 15,
    },
    bar: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 6,
        backgroundColor: '#ffffff',
        borderRadius: 2,
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        zIndex: 1000,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: MENU_WIDTH,
        height: '100%',
        backgroundColor: '#1e293b',
        paddingTop: 80,
        paddingHorizontal: 20,
        elevation: 15,
        boxShadow : "0px 4px 10px #0000",
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        paddingBottom: 10,
    },
    menuItem: {
        paddingVertical: 15,
        borderWidth: 2,
        borderRadius: 20,
        paddingLeft: 20,
        boxShadow: "3px 3px 1px #000000",
        backgroundColor: '#334155',
        margin: 10,
        display: "flex",
        gap: 15,
        flexDirection: "row"
    },
    menuItemText: {
        fontSize: 18,
        color: '#cbd5e1',
        fontWeight: '600',
    },
});