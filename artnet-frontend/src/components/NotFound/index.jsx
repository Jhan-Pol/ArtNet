const notFound = () => {
  return (
    <div
      className="not-found"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
      }}
    >
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default notFound;
