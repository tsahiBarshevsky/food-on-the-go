import { ToastAndroid } from "react-native";

const notify = (message) => {
    console.log('message', message)
    switch (message) {
        case 'Firebase: Error (auth/email-already-in-use).':
            ToastAndroid.show('Email is already in use', ToastAndroid.SHORT);
            break;
        case 'Firebase: Error (auth/invalid-email).':
            ToastAndroid.show('Bad email format', ToastAndroid.SHORT);
            break;
        case 'Firebase: Error (auth/user-not-found).':
            ToastAndroid.show("Invalid email or doesn't exists", ToastAndroid.SHORT);
            break;
        case 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).':
            ToastAndroid.show("Invalid or incorrect password", ToastAndroid.SHORT);
            break;
        case 'Firebase: Error (auth/internal-error).':
            ToastAndroid.show("Internal error", ToastAndroid.SHORT);
            break;
        case 'Firebase: Error (auth/wrong-password).':
            ToastAndroid.show("Wrong password", ToastAndroid.SHORT);
            break;
        case 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).':
            ToastAndroid.show("There is no user record corresponding to this identifier", ToastAndroid.SHORT);
            break;
        case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
            ToastAndroid.show("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.", ToastAndroid.SHORT);
            break;
        default:
            return null;
    }
}

export { notify };