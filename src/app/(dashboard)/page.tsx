import DashboardView from "@/features/dashboard/views/dashboard-view";
import LandingView from "@/features/landing/views/landing-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

//this way we develop ui in components features amd not in app folder, which will be used for routing prefetching and other stuff,also we can have multiple components in features and use them in views as needed, this way we can keep our code organized and maintainable
export default async function Dashboard() {
    const { userId, orgId } = await auth();

    if (!userId) {
      return <LandingView />;
    }

    if (!orgId) {
      redirect("/org-selection");
    }

    return (
      <DashboardView />
    )
}
