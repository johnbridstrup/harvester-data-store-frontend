import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { UserPagination } from "@/components/pagination";
import UsersList from "@/components/users/UsersList";
import { queryUsers } from "@/features/users/usersSlice";
import "./styles.css";

function UserListView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(queryUsers({}));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS User Management"}
          className={"display-6 mt-4 mb-4"}
        />
        <UsersList />
        <UserPagination />
      </div>
    </MainLayout>
  );
}

export default UserListView;
