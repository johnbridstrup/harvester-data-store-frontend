import SearchHarvester from "./searchharvester";

interface HomeProps {
  theme: string | null;
}

function LandingView(props: HomeProps) {
  return (
    <div className="row">
      <div className="col-md-6 mx-auto">
        <SearchHarvester component="homepage" theme={props.theme} />
      </div>
    </div>
  );
}

export default LandingView;
