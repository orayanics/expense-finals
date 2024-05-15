export default function ConditionalMessage({ condition, type, message }) {
  return (
    <>
      {condition ? (
        <>
          <p className="dashboard-title-date">{type}</p>
          <div className="dashboard-exp">{message}</div>
        </>
      ) : (
        <>
          <p className="dashboard-title-date">{type}</p>
          <div className="dashboard-exp">{message}</div>
        </>
      )}
    </>
  );
}
