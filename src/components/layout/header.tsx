
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { logout } from "@/app/auth/actions";
import Link from "next/link";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/server-config";

async function getUser() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  
  const adminApp = getAdminApp();
  if (!adminApp) return null;

  try {
    const decodedClaims = await getAuth(adminApp).verifySessionCookie(session, true);
    return decodedClaims;
  } catch (error) {
    return null;
  }
}

export async function Header() {
  const user = await getUser();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">User</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}>
                <button type="submit" className="w-full text-left">
                    <DropdownMenuItem>
                        Log out
                    </DropdownMenuItem>
                </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
            <Link href="/login">Login</Link>
        </Button>
      )}
    </header>
  );
}
