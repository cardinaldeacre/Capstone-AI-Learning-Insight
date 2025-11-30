import SectionCard from "./SectionCard";
import HeaderCard from "./HeaderCard";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 border border-gray-300 rounded-2xl p-3">
        <div className="flex flex-col gap-4s md:gap-6 ">
          <h1>Dashboard</h1>
          <HeaderCard />
          <SectionCard />
        </div>
      </div>
    </div>
  );
}
