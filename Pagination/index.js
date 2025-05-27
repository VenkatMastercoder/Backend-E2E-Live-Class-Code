const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors")

const app = express();

const prisma = new PrismaClient();

app.use(cors())

// GET All Courses ( Offset Based ) --> /courses
app.get("/courses", async (req, res) => {
  // 1. Data from Frotnend
  const page = parseInt(req.query.page); // 1
  const limit = parseInt(req.query.limit); // 10

  const skip = (page - 1) * limit; // 0

  // 2. DB Logic
  const course_data = await prisma.course.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      sno: "asc",
    },
  });

  const totalCourses = await prisma.course.count();

  const data = {
    data: course_data,
    meta: {
      pagaination: {
        total_data: totalCourses,
        total_pages: Math.ceil(totalCourses / limit),
        current_page: page,
        per_page: limit,
      },
    },
  };

  // 3. Data to Frontend
  res.status(200).json({ message: "Course Fetched Sccuessfully", data: data });
});

// GET All Courses ( Cursor Based )  --> /course
app.get("/course", async (req, res) => {
  // 1. Data from Frotnend
  const limit = parseInt(req.query.limit); // 10
  const cursor = req.query.course_id;

  console.log("limit:",limit);
  console.log("cursor:",cursor);

  // 2. DB Logic
  // First fetch limit + 1 items to check if there are more
  const course_data = await prisma.course.findMany({
    take: limit + 1,  // Take one extra item
    orderBy: {
      sno: "asc",
    },
    ...(cursor && {
      skip: 1,
      cursor: {
        course_id: cursor,
      },
    }),
  });

  // Check if we have more items
  const hasNextPage = course_data.length > limit;
  // Remove the extra item if it exists
  const items = hasNextPage ? course_data.slice(0, -1) : course_data;

  const totalCourses = await prisma.course.count();

  const data = {
    data: items,
    meta: {
      pagaination: {
        total_data: totalCourses,
        per_page: limit,
        next_cursor: hasNextPage ? items[items.length - 1].course_id : null,
      },
    },
  };

  // 3. Data to Frontend
  res.status(200).json({ message: "Course Fetched Successfully", data: data });
});

app.listen(3000);
