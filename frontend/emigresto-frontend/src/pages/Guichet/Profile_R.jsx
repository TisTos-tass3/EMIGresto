import React from "react";
import Header from "../../layout/Header";
import { menuItems, userOptions } from "../../layout/Layout_R/SidebarData_R";
import Profile from "../../layout/Profile";
import Sidebar from "../../layout/Sidebar";

const Profile_R = () => {
  const user = {
    profilePicture: "https://via.placeholder.com/150",
    fullName: "Soumana",
    role: "Vendeur de ticket",
    bio: "Je suis un vendeur de ticket passionné par mon travail.",
  };

  return (
    <div className="h-screen flex w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar title="My Dashboard" menuItems={menuItems} userOptions={userOptions} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <Header h_title="Tableau de bord" h_role="Vendeur de ticket" h_user="Soumana" />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden p-0 flex items-center justify-center">
          <Profile user={user} editable={true} />
        </div>
      </div>
    </div>
  );
};

export default Profile_R;
