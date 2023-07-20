import "./styles.css";

function Forbidden() {
  return (
    <div className="forbidden">
      <div>
        <h2 className="display-4">403 Forbidden</h2>
        <p>
          Looks like you are not allowed to view that page.{" "}
          <a href="/">Go Back Home</a>
        </p>
      </div>
    </div>
  );
}

export default Forbidden;
