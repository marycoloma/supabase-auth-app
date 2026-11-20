import { StyleSheet } from "react-native";

// Green colour palette used on every screen
export const colors = {
  primary: "#2E7D32", // main green (buttons, header)
  primaryDark: "#1B5E20", // pressed buttons, headings
  primaryLight: "#E8F5E9", // light green boxes
  accent: "#66BB6A", // borders and highlights
  background: "#F1F8F4", // page background
  card: "#FFFFFF",
  text: "#1F2D1F",
  muted: "#5F7563",
  border: "#C8E6C9",
  error: "#C62828",
  errorBg: "#FDECEA",
  white: "#FFFFFF",
};

// Shared styles so all screens look the same
export const theme = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    gap: 8,
    boxShadow: "0 4px 16px rgba(27, 94, 32, 0.12)",
  },
  title: { fontSize: 26, fontWeight: "bold", color: colors.primaryDark },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", color: colors.text, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputError: { borderColor: colors.error },
  fieldError: { color: colors.error, fontSize: 13 },
  errorBox: { backgroundColor: colors.errorBg, borderRadius: 10, padding: 12 },
  errorBoxText: { color: colors.error, fontSize: 14 },
  successBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    padding: 12,
  },
  successBoxText: { color: colors.primaryDark, fontSize: 14 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  buttonOutline: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonOutlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  muted: { color: colors.muted },
  link: { color: colors.primary, fontWeight: "bold" },
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 4,
  },
  infoTitle: { fontWeight: "bold", color: colors.primaryDark },
});
