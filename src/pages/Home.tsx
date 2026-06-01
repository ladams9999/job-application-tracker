import Dashboard from "@/components/analytics/Dashboard";

const Home = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Home</h2>
        <p className="text-muted-foreground">
          Review your dashboard before diving into the full applications list.
        </p>
      </div>

      <Dashboard />
    </div>
  );
};

export default Home;
