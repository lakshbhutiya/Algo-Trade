
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/server-config";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("session")?.value;

  if (!session) {
      redirect('/login');
  }

  // Double check auth on the server for protected layouts
  const adminApp = getAdminApp();
  if (adminApp) {
    try {
      await getAuth(adminApp).verifySessionCookie(session, true);
    } catch(e) {
      // If cookie is invalid, delete it and redirect to login
      cookies().delete("session");
      redirect('/login');
    }
  } else {
    // If firebase isn't setup, we can't verify the session, so redirect to login
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
