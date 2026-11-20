import Toast from "react-native-toast-message";

const VISIBILITY_TIME = 5000;

function showSuccessToast(text: string) {
  Toast.show({ type: "success", text1: text, visibilityTime: VISIBILITY_TIME, autoHide: true });
}

function showErrorToast(text: string) {
  Toast.show({ type: "error", text1: text, visibilityTime: VISIBILITY_TIME, autoHide: true });
}

export { showErrorToast, showSuccessToast };
