import DashboardView from "@/features/dashboard/views/dashboard-view";

//this way we develop ui in components features amd not in app folder, which will be used for routing prefetching and other stuff,also we can have multiple components in features and use them in views as needed, this way we can keep our code organized and maintainable
export default function Dashboard() {
    return (
      <DashboardView />
    )
}
