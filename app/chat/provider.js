"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "./_components/AppSidebar";

// keep this on the client side

function ChatspaceProvider({ children }) {
  const { user } = useUser();
  const newUserMutation = useMutation(api.users.CreateNewUser);
  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    const result = await newUserMutation({
      name: user?.fullName,
      email: user?.primaryEmailAddress.emailAddress,
      picture: user?.imageUrl,
    });
    console.log("USERS INFO:", result);
    setUserDetail(result);
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <div className="w-full p-10">{children}</div>
        </SidebarProvider>
      </UserDetailContext.Provider>
    </div>
  );
}

export default ChatspaceProvider;
