import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("session")?.value;

  if (!session) {
      redirect('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
