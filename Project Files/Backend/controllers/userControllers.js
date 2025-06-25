const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userSchema(req.body);
    await newUser.save();
    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    user.password = undefined;
    return res.status(200).send({
      message: "Login success successfully",
      success: true,
      token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};
const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (!allCourses) {
      return res.status(404).send("No Courses Found");
    }
    return res.status(200).send({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.error("Error in deleting course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete course" });
  }
};

const postCourseController = async (req, res) => {
  try {
    let price;
    const {
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price,
      C_description,
      S_title,
      S_description,
    } = req.body; 
    const S_content = req.files.map((file) => file.filename);
    const sections = [];
    if (S_content.length > 1){
      for (let i = 0; i < S_content.length; i++) {
        sections.push({
          S_title: S_title[i],
          S_content: {
            filename: S_content[i],
            path: `/uploads/${S_content[i]}`,
          },
          S_description: S_description[i],
        });
      }
    } else{
      sections.push({
        S_title: S_title,
        S_content: {
          filename: S_content[0],
          path: `/uploads/${S_content[0]}`,
        },
        S_description: S_description,
      });
    }
    
    if (C_price == 0) {
      price = "free";
    } else {
      price = C_price;
    }
    const course = new courseSchema({
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price: price,
      C_description,
      sections,
    });
    await course.save();
    res
      .status(201)
      .send({ success: true, message: "Course created successfully" });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to create course" });
  }
};
const getAllCoursesUserController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find({ userId: req.body.userId });
    if (!allCourses) {
      res.send({
        success: false,
        message: "No Courses Found",
      });
    } else {
      res.send({
        success: true,
        message: "All Courses Fetched Successfully",
        data: allCourses,
      });
    }
  } catch (error) {
    console.error("Error in fetching courses:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch courses" });
  }
};
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  try {
    const course = await courseSchema.findByIdAndDelete({ _id: courseid });
    if (course) {
      res
        .status(200)
        .send({ success: true, message: "Course deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Course not found" });
    }
  } catch (error) {
    console.error("Error in deleting course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete course" });
  }
};
const enrolledCourseController = async (req, res) => {
  const { courseid } = req.params;
  const { userId } = req.body;
  try {
    const course = await courseSchema.findById(courseid);
    if (!course) {
      return res
        .status(404)
        .send({ success: false, message: "Course Not Found!" });
    }
    let course_Length = course.sections.length;
    const enrolledCourse = await enrolledCourseSchema.findOne({
      courseId: courseid,
      userId: userId,
      course_Length: course_Length,
    });
    if (!enrolledCourse) {
      const enrolledCourseInstance = new enrolledCourseSchema({
        courseId: courseid,
        userId: userId,
        course_Length: course_Length,
      });
      const coursePayment = new coursePaymentSchema({
        userId: req.body.userId,
        courseId: courseid,
        ...req.body,
      });
      await coursePayment.save();
      await enrolledCourseInstance.save();
      course.enrolled += 1;
      await course.save();
      res.status(200).send({
        success: true,
        message: "Enroll Successfully",
        course: { id: course._id, Title: course.C_title },
      });
    } else {
      res.status(200).send({
        success: false,
        message: "You are already enrolled in this Course!",
        course: { id: course._id, Title: course.C_title },
      });
    }
  } catch (error) {
    console.error("Error in enrolling course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to enroll in the course" });
  }
};
const sendCourseContentController = async (req, res) => {
  const { courseid } = req.params;
  try {
    const course = await courseSchema.findById({ _id: courseid });
    if (!course)
      return res.status(404).send({
        success: false,
        message: "No such course found",
      });
    const user = await enrolledCourseSchema.findOne({
      userId: req.body.userId,
      courseId: courseid,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    } else {
      return res.status(200).send({
        success: true,
        courseContent: course.sections,
        completeModule: user.progress,
        certficateData: user,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
const completeSectionController = async (req, res) => {
  const { courseId, sectionId } = req.body;
  try {
    const enrolledCourseContent = await enrolledCourseSchema.findOne({
      courseId: courseId,
      userId: req.body.userId,
    });
    if (!enrolledCourseContent) {
      return res
        .status(400)
        .send({ message: "User is not enrolled in the course" });
    }
    const updatedProgress = enrolledCourseContent.progress || [];
    updatedProgress.push({ sectionId: sectionId });
    await enrolledCourseSchema.findOneAndUpdate(
      { _id: enrolledCourseContent._id },
      { progress: updatedProgress },
      { new: true }
    );
    res.status(200).send({ message: "Section completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
const sendAllCoursesUserController = async (req, res) => {
  const { userId } = req.body;
  try {
    const enrolledCourses = await enrolledCourseSchema.find({ userId });
    const coursesDetails = await Promise.all(
      enrolledCourses.map(async (enrolledCourse) => {
        const courseDetails = await courseSchema.findOne({
          _id: enrolledCourse.courseId,
        });
        return courseDetails;
      })
    );

    return res.status(200).send({
      success: true,
      data: coursesDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  registerController,
  loginController,
  getAllCoursesController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
};