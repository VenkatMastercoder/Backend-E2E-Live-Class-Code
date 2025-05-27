-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "dob" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");
