// Everything releted -- Learning Program ---

import Program from "../models/Program.model.js";
import Category from "../models/Category.model.js";
import User from "../models/User.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";

class ProgramController {
  // Create a new learning program with all sections
  static async createProgram(req, res) {
    try {
      const {
        title,
        topic,
        category,
        description,
        difficulty,
        examSimulator,
        guidedQuestions,
        documents,
        settings,
      } = req.body;

      console.log("=== CREATE PROGRAM DEBUG ===");
      console.log(
        "Received examSimulator:",
        JSON.stringify(examSimulator, null, 2)
      );

      // Validate required fields
      if (!title || !topic || !category || !description) {
        return handleError(
          res,
          400,
          "Missing required fields: title, topic, category, description"
        );
      }

      // Create program object
      const programData = {
        name: title,
        topic,
        category,
        description,
        difficulty: difficulty || "Beginner",
        createdBy: req.user.id,
      };

      // Add Exam Simulator if provided - FIXED VERSION
      if (examSimulator?.enabled && examSimulator?.questions?.length > 0) {
        const { totalMarks, timeLimit, maxAttempts, questions } = examSimulator;

        // Validate exam simulator data
        if (!totalMarks || !questions || questions.length === 0) {
          return handleError(
            res,
            400,
            "Exam simulator requires totalMarks and at least one question"
          );
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (
            !q.type ||
            !q.questionText ||
            q.mark === undefined ||
            !q.correctAnswers
          ) {
            return handleError(
              res,
              400,
              `Question ${
                i + 1
              } is missing required fields (type, questionText, mark, correctAnswers)`
            );
          }

          // Validate options for MCQ
          if (
            (q.type === "single-choice" || q.type === "multi-choice") &&
            (!q.options || q.options.length < 2)
          ) {
            return handleError(
              res,
              400,
              `Question ${i + 1}: MCQ requires at least 2 options`
            );
          }
        }

        // Assign examSimulator to programData
        programData.examSimulator = {
          enabled: true,
          totalMarks: totalMarks,
          timeLimit: timeLimit || 15,
          maxAttempts: maxAttempts || 1,
          questions: questions,
        };

        console.log(
          "examSimulator added to programData:",
          programData.examSimulator.enabled
        );
      } else {
        console.log(
          "examSimulator not added - enabled:",
          examSimulator?.enabled,
          "questions:",
          examSimulator?.questions?.length
        );
      }

      // Add Guided Questions if provided
      if (guidedQuestions?.enabled && guidedQuestions?.questions?.length > 0) {
        const { freeAttempts, questions } = guidedQuestions;

        if (!questions || questions.length === 0) {
          return handleError(
            res,
            400,
            "Guided questions require at least one question"
          );
        }

        // Validate guided questions
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.question || !q.answer) {
            return handleError(
              res,
              400,
              `Guided question ${i + 1} is missing question or answer`
            );
          }
        }

        programData.guidedQuestions = {
          enabled: true,
          freeAttempts: freeAttempts || 3,
          questions,
        };
      }

      // Add Documents if provided
      if (documents && documents.length > 0) {
        for (let i = 0; i < documents.length; i++) {
          const doc = documents[i];
          if (!doc.title || !doc.fileUrl) {
            return handleError(
              res,
              400,
              `Document ${i + 1} is missing title or fileUrl`
            );
          }
        }
        programData.documentation = documents;
      }

      // Add Settings
      if (settings) {
        programData.settings = {
          shuffleQuestions: settings.shuffleQuestions || false,
          isActive: settings.isActive !== undefined ? settings.isActive : true,
          isPaid: settings.isPaid || false,
          price: settings.isPaid ? settings.price || 0 : 0,
        };
      }

      console.log("Final programData before save:", {
        hasExamSimulator: !!programData.examSimulator,
        examEnabled: programData.examSimulator?.enabled,
        questionsCount: programData.examSimulator?.questions?.length,
      });

      // Create and save program
      const newProgram = new Program(programData);
      await newProgram.save();

      console.log("Program saved. Verifying examSimulator:", {
        exists: !!newProgram.examSimulator,
        enabled: newProgram.examSimulator?.enabled,
        questionsCount: newProgram.examSimulator?.questions?.length,
      });

      return handleSuccess(
        res,
        201,
        newProgram,
        "Program created successfully"
      );
    } catch (error) {
      console.error("Create program error:", error);
      if (error.code === 11000) {
        return handleError(
          res,
          400,
          "A program with this name already exists. Please use a different name."
        );
      }
      return handleError(res, 500, "Failed to create program", error);
    }
  }

  // Get program preview (for preview page)
  static async getProgramPreview(req, res) {
    try {
      const { id } = req.params;

      const program = await Program.findById(id).populate(
        "createdBy",
        "name email"
      );

      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Build preview data
      const preview = {
        basicInfo: {
          title: program.name,
          topic: program.topic,
          category: program.category,
          description: program.description,
          difficulty: program.difficulty,
          createdBy: program.createdBy?.name,
          createdAt: program.createdAt,
        },
        examSimulator: program.examSimulator.enabled
          ? {
              totalMarks: program.examSimulator.totalMarks,
              timeLimit: program.examSimulator.timeLimit,
              maxAttempts: program.examSimulator.maxAttempts,
              totalQuestions: program.examSimulator.questions.length,
              questionBreakdown: {
                singleChoice: program.examSimulator.questions.filter(
                  (q) => q.type === "single-choice"
                ).length,
                multiChoice: program.examSimulator.questions.filter(
                  (q) => q.type === "multi-choice"
                ).length,
                text: program.examSimulator.questions.filter(
                  (q) => q.type === "text"
                ).length,
                fillInGap: program.examSimulator.questions.filter(
                  (q) => q.type === "fill-in-gap"
                ).length,
              },
              questions: program.examSimulator.questions.map((q, idx) => ({
                number: idx + 1,
                type: q.type,
                question: q.questionText,
                mark: q.mark,
                skillLevel: q.skillLevel,
                optionsCount: q.options?.length || 0,
              })),
            }
          : null,
        guidedQuestions: program.guidedQuestions.enabled
          ? {
              freeAttempts: program.guidedQuestions.freeAttempts,
              totalQuestions: program.guidedQuestions.questions.length,
              questions: program.guidedQuestions.questions.map((q, idx) => ({
                number: idx + 1,
                question: q.question,
              })),
            }
          : null,
        documents: program.documentation.map((doc, idx) => ({
          number: idx + 1,
          title: doc.title,
          description: doc.description,
          fileType: doc.fileType,
          uploadedAt: doc.uploadedAt,
        })),
        settings: program.settings,
        status: program.status,
      };

      return handleSuccess(res, 200, preview, "Program preview retrieved");
    } catch (error) {
      devLog(`Get program preview error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve program preview", error);
    }
  }

  // Update program
  static async updateProgram(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const program = await Program.findById(id);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // DEBUG: log authenticated requester and program owner
      console.log("Requester (req.user):", req.user);
      console.log("Program createdBy:", program.createdBy);

      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";

      // If program has no owner, let the first authenticated updater claim it
      if (!program.createdBy && requesterId) {
        program.createdBy = requesterId;
        await program.save(); // persist claim
        console.log(`Program ${id} claimed by user ${requesterId}`);
      }

      const ownerId = program.createdBy ? String(program.createdBy) : null;

      // allow if requester is owner or admin
      if (ownerId) {
        if (ownerId !== requesterId && requesterRole !== "admin") {
          return handleError(res, 403, "Not authorized to update this program");
        }
      } else {
        // still no owner (no authenticated requester) => deny
        return handleError(res, 403, "Not authorized to update this program");
      }

      // Whitelist or shallow-merge updates (keep existing behavior)
      const allowedKeys = [
        "name",
        "title",
        "topic",
        "category",
        "description",
        "difficulty",
        "thumbnail",
        "coverImage",
        "status",
        "isActive",
        "estimatedDuration",
        "settings",
        "examSimulator",
        "guidedQuestions",
        "documentation",
        "pricing",
        "overview",
        "topicsCovered",
        "courseSections",
        "learningObjectives",
        "prerequisites",
      ];

      Object.keys(updates).forEach((key) => {
        if (allowedKeys.includes(key)) program[key] = updates[key];
      });

      await program.save();
      return handleSuccess(res, 200, program, "Program updated successfully");
    } catch (error) {
      console.error("Update program error:", error);
      return handleError(res, 500, "Failed to update program", error);
    }
  }

  // Get all programs
  static async getAllPrograms(req, res) {
    try {
      const {
        category,
        difficulty,
        status,
        search,
        skillLevel,
        duration,
        accessType,
        certification,
        isFree,
      } = req.query;

      const filter = {};

      // Basic filters
      if (category) filter.category = category;
      if (difficulty || skillLevel)
        filter.difficulty = difficulty || skillLevel;
      if (status) filter.status = status;

      // Search
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { topic: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Duration filter (estimatedDuration in hours)
      if (duration) {
        if (duration === "Less than 30 min") {
          filter.estimatedDuration = { $lte: 0.5 };
        } else if (duration === "30 to 60 min") {
          filter.estimatedDuration = { $gt: 0.5, $lte: 1 };
        } else if (duration === "More than 60 min") {
          filter.estimatedDuration = { $gt: 1 };
        }
      }

      // Access Type filter
      if (accessType) {
        if (accessType === "Free Preview Available") {
          filter["pricing.isFree"] = true;
        } else if (accessType === "AI Coach Only") {
          filter["aiCoach.enabled"] = true;
        } else if (accessType === "Exam Simulator Only") {
          filter["examSimulator.enabled"] = true;
        } else if (accessType === "Full Access") {
          filter["aiCoach.enabled"] = true;
          filter["examSimulator.enabled"] = true;
        }
      }

      // Certification filter
      if (certification) {
        filter.certificateEnabled = certification === "Yes";
      }

      // Free/Paid filter
      if (isFree !== undefined) {
        filter["pricing.isFree"] = isFree === "true";
      }

      // Only show published and active programs by default (unless admin specifies status)
      if (!status) {
        filter.status = "published";
        filter.isActive = true;
      }

      const programs = await Program.find(filter)
        .populate("createdBy", "name email")
        .populate("instructor", "name bio expertise")
        .sort({ createdAt: -1 });

      return handleSuccess(
        res,
        200,
        programs,
        `Found ${programs.length} programs`
      );
    } catch (error) {
      devLog(`Get all programs error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve programs", error);
    }
  }

  // Get single program
  static async getProgram(req, res) {
    try {
      const { id } = req.params;

      const program = await Program.findById(id).populate(
        "createdBy",
        "name email"
      );

      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      return handleSuccess(res, 200, program, "Program retrieved successfully");
    } catch (error) {
      devLog(`Get program error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve program", error);
    }
  }

  // Delete program
  static async deleteProgram(req, res) {
    try {
      const { id } = req.params;

      const program = await Program.findById(id);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";
      const ownerId = program.createdBy ? String(program.createdBy) : null;

      // allow delete only to owner or admin
      if (!ownerId) {
        if (requesterRole !== "admin") {
          return handleError(res, 403, "Not authorized to delete this program");
        }
      } else {
        if (ownerId !== requesterId && requesterRole !== "admin") {
          return handleError(res, 403, "Not authorized to delete this program");
        }
      }

      await program.deleteOne();

      return handleSuccess(res, 200, null, "Program deleted successfully");
    } catch (error) {
      devLog(`Delete program error: ${error.message}`);
      return handleError(res, 500, "Failed to delete program", error);
    }
  }

  // Enroll user in program
  static async enrollInProgram(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const program = await Program.findById(id);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      const user = await User.findById(userId);
      if (!user) {
        return handleError(res, 404, "User not found");
      }

      // Check if already enrolled
      const alreadyEnrolled = user.enrolledPrograms.some(
        (enrollment) => enrollment.program.toString() === id
      );

      if (alreadyEnrolled) {
        return handleError(res, 400, "Already enrolled in this program");
      }

      // Add to user's enrolled programs
      user.enrolledPrograms.push({
        program: id,
        enrolledAt: new Date(),
        progress: 0,
        status: "not-started",
      });

      // Update program stats
      program.stats.enrolledUsers += 1;

      await user.save();
      await program.save();

      devLog(`User ${userId} enrolled in program ${id}`);

      return handleSuccess(
        res,
        200,
        {
          programId: id,
          programName: program.name,
          enrolledAt: new Date(),
        },
        "Successfully enrolled in program"
      );
    } catch (error) {
      devLog(`Enroll program error: ${error.message}`);
      return handleError(res, 500, "Failed to enroll in program", error);
    }
  }

  // Get quiz/exam preview with all questions
  static async getQuizPreview(req, res) {
    try {
      const { id } = req.params;

      const program = await Program.findById(id);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Check if exam simulator is enabled
      if (!program.examSimulator || !program.examSimulator.enabled) {
        return handleError(res, 404, "Quiz/Exam not found for this program");
      }

      const exam = program.examSimulator;

      // Build preview response
      const preview = {
        quizTitle: program.name,
        topic: program.topic,
        category: program.category,
        timeLimit: exam.timeLimit,
        totalMarks: exam.totalMarks,
        totalQuestions: exam.questions.length,
        maxAttempts: exam.maxAttempts,
        questions: exam.questions.map((q, index) => ({
          questionNumber: index + 1,
          questionId: q._id,
          type: q.type,
          questionText: q.questionText,
          mark: q.mark,
          skillLevel: q.skillLevel,
          options: q.options || [],
          correctAnswers: q.correctAnswers,
          explanation: q.explanation,
        })),
      };

      return handleSuccess(
        res,
        200,
        preview,
        "Quiz preview retrieved successfully"
      );
    } catch (error) {
      console.error("Get quiz preview error:", error);
      return handleError(res, 500, "Failed to retrieve quiz preview", error);
    }
  }

  // Delete a specific question from exam simulator
  static async deleteQuestion(req, res) {
    try {
      const { programId, questionId } = req.params;

      const program = await Program.findById(programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Check ownership
      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";
      const ownerId = program.createdBy ? String(program.createdBy) : null;

      if (ownerId && ownerId !== requesterId && requesterRole !== "admin") {
        return handleError(res, 403, "Not authorized to delete questions");
      }

      // Check if exam simulator exists
      if (!program.examSimulator || !program.examSimulator.questions) {
        return handleError(res, 404, "No questions found");
      }

      // Find and remove the question
      const questionIndex = program.examSimulator.questions.findIndex(
        (q) => String(q._id) === questionId
      );

      if (questionIndex === -1) {
        return handleError(res, 404, "Question not found");
      }

      // Get the mark of deleted question to update totalMarks
      const deletedQuestionMark =
        program.examSimulator.questions[questionIndex].mark;

      // Remove question
      program.examSimulator.questions.splice(questionIndex, 1);

      // Update total marks
      program.examSimulator.totalMarks = Math.max(
        0,
        program.examSimulator.totalMarks - deletedQuestionMark
      );

      await program.save();

      return handleSuccess(
        res,
        200,
        {
          remainingQuestions: program.examSimulator.questions.length,
          updatedTotalMarks: program.examSimulator.totalMarks,
        },
        "Question deleted successfully"
      );
    } catch (error) {
      console.error("Delete question error:", error);
      return handleError(res, 500, "Failed to delete question", error);
    }
  }

  // Delete entire quiz/exam simulator
  static async deleteQuiz(req, res) {
    try {
      const { id } = req.params;

      const program = await Program.findById(id);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Check ownership
      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";
      const ownerId = program.createdBy ? String(program.createdBy) : null;

      if (ownerId && ownerId !== requesterId && requesterRole !== "admin") {
        return handleError(res, 403, "Not authorized to delete quiz");
      }

      // Check if exam simulator exists
      if (!program.examSimulator || !program.examSimulator.enabled) {
        return handleError(res, 404, "Quiz not found");
      }

      // Disable exam simulator and clear questions
      program.examSimulator = {
        enabled: false,
        totalMarks: 0,
        timeLimit: 15,
        maxAttempts: 1,
        questions: [],
      };

      await program.save();

      return handleSuccess(res, 200, null, "Quiz deleted successfully");
    } catch (error) {
      console.error("Delete quiz error:", error);
      return handleError(res, 500, "Failed to delete quiz", error);
    }
  }

  // Update a single question
  static async updateQuestion(req, res) {
    try {
      const { programId, questionId } = req.params;
      const updates = req.body;

      const program = await Program.findById(programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Check ownership
      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";
      const ownerId = program.createdBy ? String(program.createdBy) : null;

      if (ownerId && ownerId !== requesterId && requesterRole !== "admin") {
        return handleError(res, 403, "Not authorized to update questions");
      }

      // Find question
      const question = program.examSimulator.questions.id(questionId);
      if (!question) {
        return handleError(res, 404, "Question not found");
      }

      // Store old mark for totalMarks adjustment
      const oldMark = question.mark;

      // Update question fields
      const allowedFields = [
        "type",
        "questionText",
        "mark",
        "skillLevel",
        "options",
        "correctAnswers",
        "explanation",
      ];

      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          question[field] = updates[field];
        }
      });

      // Adjust totalMarks if mark changed
      if (updates.mark !== undefined && updates.mark !== oldMark) {
        const markDifference = updates.mark - oldMark;
        program.examSimulator.totalMarks += markDifference;
      }

      await program.save();

      return handleSuccess(res, 200, question, "Question updated successfully");
    } catch (error) {
      console.error("Update question error:", error);
      return handleError(res, 500, "Failed to update question", error);
    }
  }

  // Add a new question to existing quiz
  static async addQuestion(req, res) {
    try {
      const { id } = req.params;
      const newQuestion = req.body;

      const program = await Program.findById(id);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Check ownership
      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";
      const ownerId = program.createdBy ? String(program.createdBy) : null;

      if (ownerId && ownerId !== requesterId && requesterRole !== "admin") {
        return handleError(res, 403, "Not authorized to add questions");
      }

      // Validate question
      if (
        !newQuestion.type ||
        !newQuestion.questionText ||
        !newQuestion.mark ||
        !newQuestion.correctAnswers
      ) {
        return handleError(
          res,
          400,
          "Missing required fields: type, questionText, mark, correctAnswers"
        );
      }

      // Validate options for MCQ
      if (
        (newQuestion.type === "single-choice" ||
          newQuestion.type === "multi-choice") &&
        (!newQuestion.options || newQuestion.options.length < 2)
      ) {
        return handleError(res, 400, "MCQ requires at least 2 options");
      }

      // Initialize exam simulator if not exists
      if (!program.examSimulator || !program.examSimulator.enabled) {
        program.examSimulator = {
          enabled: true,
          totalMarks: 0,
          timeLimit: 15,
          maxAttempts: 1,
          questions: [],
        };
      }

      // Add question
      program.examSimulator.questions.push(newQuestion);

      // Update total marks
      program.examSimulator.totalMarks += newQuestion.mark;

      await program.save();

      const addedQuestion =
        program.examSimulator.questions[
          program.examSimulator.questions.length - 1
        ];

      return handleSuccess(
        res,
        201,
        addedQuestion,
        "Question added successfully"
      );
    } catch (error) {
      console.error("Add question error:", error);
      return handleError(res, 500, "Failed to add question", error);
    }
  }

  // Get available categories from database
  static async getCategories(req, res) {
    try {
      // Fetch all active categories from database
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      
      // Extract just the names
      const categoryNames = categories.map(cat => cat.name);
      
      return handleSuccess(res, 200, {
        categories: categoryNames
      }, "Categories retrieved successfully");
    } catch (error) {
      console.error("Get categories error:", error);
      return handleError(res, 500, "Failed to get categories", error);
    }
  }

  // Add a new category to database
  static async addCategory(req, res) {
    try {
      const { category } = req.body;

      if (!category || !category.trim()) {
        return handleError(res, 400, "Category name is required");
      }

      const categoryName = category.trim();

      // Check if category already exists (case-insensitive)
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
      });

      if (existingCategory) {
        return handleError(res, 400, "Category already exists");
      }

      // Create new category
      const newCategory = await Category.create({
        name: categoryName,
        createdBy: req.user.id
      });

      // Get all categories
      const allCategories = await Category.find({ isActive: true }).sort({ name: 1 });
      const categoryNames = allCategories.map(cat => cat.name);

      return handleSuccess(res, 201, {
        category: newCategory.name,
        allCategories: categoryNames
      }, "Category added successfully");
    } catch (error) {
      console.error("Add category error:", error);
      return handleError(res, 500, "Failed to add category", error);
    }
  }

  // Temporary debug endpoint - add this
  static async debugProgram(req, res) {
    try {
      const { id } = req.params;
      const program = await Program.findById(id);

      console.log("Full program document:", JSON.stringify(program, null, 2));
      console.log("examSimulator exists?", !!program?.examSimulator);
      console.log("examSimulator.enabled?", program?.examSimulator?.enabled);
      console.log(
        "questions length:",
        program?.examSimulator?.questions?.length
      );

      return res.json({
        success: true,
        data: {
          hasExamSimulator: !!program?.examSimulator,
          enabled: program?.examSimulator?.enabled,
          questionsCount: program?.examSimulator?.questions?.length || 0,
          fullExamSimulator: program?.examSimulator,
        },
      });
    } catch (error) {
      return handleError(res, 500, "Debug failed", error);
    }
  }
}

export default ProgramController;
