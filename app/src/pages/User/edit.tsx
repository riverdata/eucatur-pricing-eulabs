import RootLayout from "@components/Layout";
import { User } from "@utils/entities";
import { UserService } from "@utils/services/api/user";
import { useParams } from "react-router-dom";
import UserForm from "./components/form";
import PageLoader from "@components/PageLoader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserEditScreen() {
  const { id } = useParams();
  const [data, setData] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const users = await UserService.getOne(id);
        setData(users);
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
      {isLoading ? <PageLoader /> : <UserForm user={data} mode="UPDATE" />}
    </RootLayout>
  );
}
