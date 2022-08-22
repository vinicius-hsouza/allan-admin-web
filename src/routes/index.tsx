
import React from 'react';
import { SideBar } from '../components/Sidebar';
import Menu from '../components/Menu';
import { useAuth } from "../hooks/auth"
import { AppRoutes } from "./AppRoutes";
import { SignRoutes } from "./SignRoutes";


export function Routes(): JSX.Element {
  const { user } = useAuth();

  if (!user) {
    return (
      <SignRoutes />
    )
  }
  return (
    <Menu>
      {/* <SideBar /> */}
      <AppRoutes />
    </Menu>
  )
}
