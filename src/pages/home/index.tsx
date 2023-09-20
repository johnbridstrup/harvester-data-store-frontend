import MainLayout from "@/components/layout/main";
import LandingView from "@/components/home";
import "./styles.css";

function Home() {
  return (
    <MainLayout>
      <div className="container">
        <div className="mb-5">
          <h2 className="display-4">Harvester Data Store</h2>
        </div>
        <LandingView />
      </div>
    </MainLayout>
  );
}

export default Home;
