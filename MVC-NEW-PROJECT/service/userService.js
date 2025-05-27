const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUserService = async () => {
  // 2. DB Logic
  const usersData = await prisma.user.findMany();
  return usersData;
};

const getUserByIDService = async (data) => {
  const userData = await prisma.user.findUnique({
    where: {
      user_id: data.user_id,
    },
  });

  return userData;
};

const createUserService = async (data) => {
  const newuser = await prisma.user.create({
    data: {
      name: data.name,
      class: data.class,
      blood_group: data.blood_group,
      phone_number: data.phone_number,
    },
  });

  return newuser;
};

const updateUserService = async (data) => {
  const newupdatedData = await prisma.user.update({
    where: {
      user_id: data.user_id,
    },
    data: {
      name: data.name,
      class: data.class,
      blood_group: data.blood_group,
      phone_number: data.phone_number,
    },
  });

  return newupdatedData;
};

const deleteUserService = async (data) => {
  return await prisma.user.delete({
    where: {
      user_id: data.user_id,
    },
  });
};

module.exports = {
  getAllUserService,
  getUserByIDService,
  createUserService,
  updateUserService,
  deleteUserService,
};
