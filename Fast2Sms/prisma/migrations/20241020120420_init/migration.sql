-- CreateTable
CREATE TABLE "Otp" (
    "otp_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "otp_number" TEXT NOT NULL,
    "otp_status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("otp_id")
);
