import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase/server-config";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("session")?.value;

  if (!session) {
      redirect('/login');
  }

  // Double check auth on the server for protected layouts
  try {
    if (!adminApp) throw new Error("Firebase admin app not initialized");
    const auth = getAuth(adminApp);
    await auth.verifySessionCookie(session, true);
  } catch(e) {
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
