-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "blood_group" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);
