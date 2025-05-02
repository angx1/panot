import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserDataAction } from "@/app/actions";

import AppearanceSettings from "./_components/appearance-settings";
import AccountSettings from "./_components/account-settings";
import ProfileSettings from "./_components/profile-settings";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const userData = await getUserDataAction();
  return (
    <div className="w-full max-w-screen flex flex-col gap-10">
      <section id="profile">
        <ProfileSettings user={userData} />
      </section>

      <section id="appearance">
        <AppearanceSettings />
      </section>

      <section id="account">
        <AccountSettings user={userData} />
      </section>
    </div>
  );
}
