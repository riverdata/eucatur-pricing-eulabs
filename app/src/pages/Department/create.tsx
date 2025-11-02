import RootLayout from "@components/Layout";
import DepartmentForm from "./components/form";

export default function DepartmentCreateScreen() {
  return (
    <RootLayout>
      <DepartmentForm mode="CREATE" />
    </RootLayout>
  );
}
