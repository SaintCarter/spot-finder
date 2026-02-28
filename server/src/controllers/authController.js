export const login = (req, res) => {
  // Logic for checking passwords would go here
  res.status(200).json({ message: "i let anyone in!" });
};

export const logout = (req, res) => {
  // Logic for checking passwords would go here
  res.status(200).json({ message: "bye!" });
};