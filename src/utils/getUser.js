export const getUser = () => {
  const { userId, email, name, photo, isAuth } = JSON.parse(
    localStorage.getItem("auth")
  );
  return { userId, email, name, photo, isAuth };
};
