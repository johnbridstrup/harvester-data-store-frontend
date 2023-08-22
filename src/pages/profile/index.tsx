import MainLayout from "@/components/layout/main";
import UserProfile from "@/components/profile/UserProfile";
import "./styles.css";

function UserProfileView() {
  return (
    <MainLayout>
      <div className="container">
        <UserProfile />
      </div>
    </MainLayout>
  );
}

export default UserProfileView;
