import "./styles.css";

function InternalServerError() {
  return (
    <div className="internal-server-err">
      <div>
        <h2 className="display-4">500 Internal Server Error</h2>
        <p>
          Oops. The server encountered an internal error or misconfiguration and
          was unable to complete your request.
        </p>
        <p>
          Try to refresh this page or feel free to contact us if the problem
          persist
        </p>
      </div>
    </div>
  );
}

export default InternalServerError;
