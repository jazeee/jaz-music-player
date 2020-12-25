import { styled } from "@material-ui/core";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FilterSidebar } from "../FilterSidebar/FilterSidebar";
import { NavBar } from "../Nav/NavBar";

const AppContainer = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

export function Layout() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  return (
    <>
      <FilterSidebar menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}/>
      <AppContainer>
        <NavBar onClickMenu={() => setMenuIsOpen(value => !value)}/>
        <Outlet />
      </AppContainer>
    </>
  )
}