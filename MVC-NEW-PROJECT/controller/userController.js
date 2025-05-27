const {
  getAllUserService,
  getUserByIDService,
  createUserService,
  updateUserService,
  deleteUserService,
} = require("../service/userService");

const getAllUserController = async (req, res) => {
  // 1. Data from Frontend

  // 2.DB
  const usersData = await getAllUserService();

  // 3. Data to Frontend
  res
    .status(200)
    .json({ message: "User Data ret Scuessfully", data: usersData });
};

const getUserByIDController = async (req, res) => {
  // 1. Data from Frontend
  const data = req.params;

  // 2. DB Logic
  const userData = await getUserByIDService(data);

  // 3. Data to Frontend
  res.json({ message: "User Data ret Scuessfully", data: userData });
};

const createUserController = async (req, res) => {
  // 1. Data from Frontend
  const data = req.body;

  // 2. DB Logic
  const newuser = await createUserService(data);

  // 3. Data to Frontend
  res
    .status(200)
    .json({ message: "New User Created Scuessfully", data: newuser });
};

const updateUserController = async (req, res) => {
  // 1. Data from Frontend
  const data = req.body;

  // 2. DB Logic
  const newupdatedData = await updateUserService(data);

  // 3. Data to Frontend
  res.json({ message: "User Data update Scuessfully", data: newupdatedData });
};

const deleteUserController =  async (req, res) => {
  // 1. Data from Frontend
  const data = req.body;

  // 2. DB Logic
  await deleteUserService(data)

  // Data to Frontend
  res.status(200).json({ message: "User delete Scuessfully" });
}

module.exports = {
  getAllUserController,
  getUserByIDController,
  createUserController,
  updateUserController,
  deleteUserController
};
