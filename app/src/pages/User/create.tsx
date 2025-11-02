import RootLayout from "@components/Layout";
import UserForm from "./components/form";

export default function UserCreateScreen() {
  return (
    <RootLayout>
      <UserForm mode="CREATE" />
    </RootLayout>
  );
}
