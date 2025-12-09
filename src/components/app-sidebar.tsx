"use client"

import * as React from "react"
import {
  IconDashboard,
  IconHelp,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/src/components/nav-main"
import { NavSecondary } from "@/src/components/nav-secondary"
import { NavUser } from "@/src/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import { User } from "../generated/prisma/client"
import Image from "next/image"
import logo from "@/src/assets/logo.png";
import { ModeToggle } from "./toggle-theme"

const data = {
  navMain: [
    {
      title: "Criar link de Inscrição",
      url: "/dashboard/links",
      icon: IconDashboard,
    },
    {
      title: "Criar Usuários",
      url: "/dashboard/usuarios",
      icon: IconUsers,
    },
  ],

  navSecondary: [
    {
      title: "Configurações",
      url: "/dashboard/perfil",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "/dashboard/ajuda",
      icon: IconHelp,
    }
  ],
}

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: User | null
}

export function AppSidebar({ ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>

        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex gap-x-3">
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="/dashboard">
                  <Image alt="logo" src={logo} width={35} height={35} />

                  <span className="text-base font-semibold">Crachá Pro</span>

                </a>
              </SidebarMenuButton>
              <ModeToggle />

            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
