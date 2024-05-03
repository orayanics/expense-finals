export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("auth"));

  return (
    <>
      <div>
        <h3>Dashboard</h3>
      </div>

      {user && (
        <div>
          <h4>{user.name}</h4>
          <img src={user.photo} alt={user.name} />
        </div>
      )}
    </>
  );
}
