import type { Metadata } from "next";
import { AppSidebar } from '@/src/components/app-sidebar'
import { DataTable } from '@/src/components/data-table'
import { SectionCards } from '@/src/components/section-cards'
import { SiteHeader } from '@/src/components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/src/components/ui/sidebar'

import { getUser } from '@/src/lib/dal'

export const metadata: Metadata = {
  title: "Painel Administrativo - Crachá Pro",
  description: "Gerador de Crachás",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getUser();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>

        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
