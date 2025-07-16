import React, { useState } from 'react'
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

export const InternalLayout = () => {
    
    const [sidebarAbierta, setSidebarAbierta] = useState(false);
  return (
    <>
        <SideBar abierto={sidebarAbierta} setAbierto={setSidebarAbierta} />
        <div className={`contenido-principal ${sidebarAbierta ? "con-sidebar" : ""}`}>
            <Outlet />
        </div>
    </>
  )
}
