-- CreateTable
CREATE TABLE "Course" (
    "course_id" TEXT NOT NULL,
    "course_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("course_id")
);
