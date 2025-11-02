import RootLayout from "@components/Layout";
import { Department } from "@utils/entities";
import { useParams } from "react-router-dom";
import PageLoader from "@components/PageLoader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DepartmentService } from "@utils/services/api/department";
import DepartmentForm from "./components/form";

export default function DepartmentEditScreen() {
  const { id } = useParams();
  const [data, setData] = useState<Department>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await DepartmentService.getOne(id);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    };
    fetchData();
  }, [id]);

  return (
    <RootLayout>
      {isLoading ? <PageLoader id="DepartmentEditScreen_PageLoader" /> : <DepartmentForm department={data} mode="UPDATE" />}
    </RootLayout>
  );
}
