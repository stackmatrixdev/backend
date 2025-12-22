import Certificate from "../models/Certificate.model.js";
import User from "../models/User.model.js";
import Program from "../models/Program.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import Quiz from "../models/Quiz.model.js";
import crypto from "crypto";
import mongoose from "mongoose";

class CertificateController {
  // Generate certificate for user
  static async generateCertificate(req, res) {
    try {
      const { programId, quizAttemptId, type } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!type || !["program", "quiz"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Valid certificate type is required (program or quiz)",
        });
      }

      // Check if user already has a certificate for this item
      const existingCertificate = await Certificate.findOne({
        user: userId,
        ...(type === "program"
          ? { program: programId }
          : { quizAttempt: quizAttemptId }),
      });

      if (existingCertificate) {
        return res.status(400).json({
          success: false,
          message: "Certificate already exists for this item",
        });
      }

      let certificateData = {
        user: userId,
        type,
        verificationCode: crypto.randomBytes(16).toString("hex"),
        issuedAt: new Date(),
        status: "active",
      };

      // Handle program certificate
      if (type === "program") {
        if (!programId) {
          return res.status(400).json({
            success: false,
            message: "Program ID is required for program certificate",
          });
        }

        const program = await Program.findById(programId);
        if (!program) {
          return res.status(404).json({
            success: false,
            message: "Program not found",
          });
        }

        // Check if user has completed the program (has sufficient quiz attempts)
        const programQuizzes = await Quiz.find({ program: programId });
        const completedQuizzes = await QuizAttempt.find({
          user: userId,
          quiz: { $in: programQuizzes.map((q) => q._id) },
          status: "completed",
          passed: true,
        });

        // Require at least 80% of program quizzes to be completed
        const completionRate = completedQuizzes.length / programQuizzes.length;
        if (completionRate < 0.8) {
          return res.status(400).json({
            success: false,
            message:
              "Insufficient program completion. Complete at least 80% of program quizzes.",
          });
        }

        certificateData = {
          ...certificateData,
          program: programId,
          title: `Certificate of Completion - ${program.name}`,
          description: `This certifies that the recipient has successfully completed the ${program.name} program`,
          completionRate: Math.round(completionRate * 100),
          completedQuizzes: completedQuizzes.length,
          totalQuizzes: programQuizzes.length,
        };
      }
      // Handle quiz certificate
      else if (type === "quiz") {
        if (!quizAttemptId) {
          return res.status(400).json({
            success: false,
            message: "Quiz attempt ID is required for quiz certificate",
          });
        }

        const quizAttempt = await QuizAttempt.findById(quizAttemptId)
          .populate("quiz", "title description")
          .populate("user", "name email");

        if (!quizAttempt) {
          return res.status(404).json({
            success: false,
            message: "Quiz attempt not found",
          });
        }

        if (quizAttempt.user._id.toString() !== userId) {
          return res.status(403).json({
            success: false,
            message:
              "You can only generate certificates for your own quiz attempts",
          });
        }

        if (!quizAttempt.passed || quizAttempt.status !== "completed") {
          return res.status(400).json({
            success: false,
            message: "Certificate can only be generated for passed quizzes",
          });
        }

        certificateData = {
          ...certificateData,
          quizAttempt: quizAttemptId,
          quiz: quizAttempt.quiz._id,
          title: `Certificate of Achievement - ${quizAttempt.quiz.title}`,
          description: `This certifies that the recipient has successfully passed the ${quizAttempt.quiz.title} quiz`,
          score: quizAttempt.score,
          maxScore: quizAttempt.maxScore,
          percentage: Math.round(
            (quizAttempt.score / quizAttempt.maxScore) * 100
          ),
        };
      }

      // Create certificate
      const certificate = new Certificate(certificateData);
      await certificate.save();

      // Populate certificate data for response
      await certificate.populate([
        { path: "user", select: "name email profileImage" },
        { path: "program", select: "name description topic" },
        { path: "quiz", select: "title description" },
      ]);

      return res.status(201).json({
        success: true,
        message: "Certificate generated successfully",
        data: certificate,
      });
    } catch (error) {
      console.error("Generate certificate error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate certificate",
      });
    }
  }

  // Get user's certificates
  static async getUserCertificates(req, res) {
    try {
      const userId = req.params.userId || req.user.id;

      // Check if user is requesting their own certificates or is admin
      if (
        userId !== req.user.id &&
        req.user.role !== "admin" &&
        req.user.role !== "superadmin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own certificates",
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = { user: userId };
      if (req.query.type) {
        filter.type = req.query.type;
      }
      if (req.query.status) {
        filter.status = req.query.status;
      }

      const certificates = await Certificate.find(filter)
        .populate("user", "name email profileImage")
        .populate("program", "name description topic")
        .populate("quiz", "title description")
        .populate("quizAttempt", "score maxScore percentage timeTaken")
        .sort({ issuedAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCertificates = await Certificate.countDocuments(filter);

      return res.status(200).json({
        success: true,
        message: "User certificates retrieved successfully",
        data: {
          certificates,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCertificates / limit),
            totalItems: totalCertificates,
            hasNext: page < Math.ceil(totalCertificates / limit),
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get user certificates error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve user certificates",
      });
    }
  }

  // Get certificate by ID
  static async getCertificateById(req, res) {
    try {
      const { certificateId } = req.params;

      const certificate = await Certificate.findById(certificateId)
        .populate("user", "name email profileImage")
        .populate("program", "name description topic")
        .populate("quiz", "title description")
        .populate("quizAttempt", "score maxScore percentage timeTaken");

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found",
        });
      }

      // Check if user can view this certificate
      if (
        certificate.user._id.toString() !== req.user.id &&
        req.user.role !== "admin" &&
        req.user.role !== "superadmin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own certificates",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Certificate retrieved successfully",
        data: certificate,
      });
    } catch (error) {
      console.error("Get certificate by ID error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve certificate",
      });
    }
  }

  // Verify certificate by verification code (public endpoint)
  static async verifyCertificate(req, res) {
    try {
      const { verificationCode } = req.params;

      const certificate = await Certificate.findOne({
        verificationCode,
        status: "active",
      })
        .populate("user", "name email")
        .populate("program", "name description topic")
        .populate("quiz", "title description");

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found or invalid verification code",
        });
      }

      // Return limited information for public verification
      const verificationData = {
        isValid: true,
        certificate: {
          id: certificate._id,
          title: certificate.title,
          recipientName: certificate.user.name,
          issuedAt: certificate.issuedAt,
          type: certificate.type,
          verificationCode: certificate.verificationCode,
        },
      };

      if (certificate.type === "program" && certificate.program) {
        verificationData.certificate.programName = certificate.program.name;
        verificationData.certificate.completionRate =
          certificate.completionRate;
      } else if (certificate.type === "quiz" && certificate.quiz) {
        verificationData.certificate.quizTitle = certificate.quiz.title;
        verificationData.certificate.score = certificate.score;
        verificationData.certificate.percentage = certificate.percentage;
      }

      return res.status(200).json({
        success: true,
        message: "Certificate verified successfully",
        data: verificationData,
      });
    } catch (error) {
      console.error("Verify certificate error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to verify certificate",
      });
    }
  }

  // Download certificate (generate PDF or return downloadable data)
  static async downloadCertificate(req, res) {
    try {
      const { certificateId } = req.params;

      const certificate = await Certificate.findById(certificateId)
        .populate("user", "name email profileImage")
        .populate("program", "name description topic")
        .populate("quiz", "title description")
        .populate(
          "quizAttempt",
          "score maxScore percentage timeTaken completedAt"
        );

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found",
        });
      }

      // Check if user can download this certificate
      if (
        certificate.user._id.toString() !== req.user.id &&
        req.user.role !== "admin" &&
        req.user.role !== "superadmin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only download your own certificates",
        });
      }

      // In a real implementation, you would generate a PDF here
      // For now, return the certificate data that can be used to generate PDF on frontend
      const certificateData = {
        id: certificate._id,
        title: certificate.title,
        description: certificate.description,
        recipientName: certificate.user.name,
        issuedAt: certificate.issuedAt,
        verificationCode: certificate.verificationCode,
        type: certificate.type,
      };

      if (certificate.type === "program") {
        certificateData.programName = certificate.program?.name;
        certificateData.completionRate = certificate.completionRate;
        certificateData.completedQuizzes = certificate.completedQuizzes;
        certificateData.totalQuizzes = certificate.totalQuizzes;
      } else if (certificate.type === "quiz") {
        certificateData.quizTitle = certificate.quiz?.title;
        certificateData.score = certificate.score;
        certificateData.maxScore = certificate.maxScore;
        certificateData.percentage = certificate.percentage;
        certificateData.completedAt = certificate.quizAttempt?.completedAt;
      }

      return res.status(200).json({
        success: true,
        message: "Certificate data retrieved for download",
        data: certificateData,
      });
    } catch (error) {
      console.error("Download certificate error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to download certificate",
      });
    }
  }

  // Revoke certificate (admin only)
  static async revokeCertificate(req, res) {
    try {
      const { certificateId } = req.params;
      const { reason } = req.body;

      // Check if user is admin
      if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const certificate = await Certificate.findById(certificateId);
      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found",
        });
      }

      certificate.status = "revoked";
      certificate.revokedAt = new Date();
      certificate.revokeReason = reason || "No reason provided";
      certificate.revokedBy = req.user.id;

      await certificate.save();

      return res.status(200).json({
        success: true,
        message: "Certificate revoked successfully",
        data: certificate,
      });
    } catch (error) {
      console.error("Revoke certificate error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to revoke certificate",
      });
    }
  }

  // Get certificate analytics (admin only)
  static async getCertificateAnalytics(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const analytics = await Certificate.aggregate([
        // Group by type and status
        {
          $group: {
            _id: {
              type: "$type",
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.type": 1, "_id.status": 1 } },
      ]);

      // Get monthly certificate generation stats
      const monthlyStats = await Certificate.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$issuedAt" },
              month: { $month: "$issuedAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 }, // Last 12 months
      ]);

      const totalCertificates = await Certificate.countDocuments();
      const activeCertificates = await Certificate.countDocuments({
        status: "active",
      });
      const revokedCertificates = await Certificate.countDocuments({
        status: "revoked",
      });

      return res.status(200).json({
        success: true,
        message: "Certificate analytics retrieved successfully",
        data: {
          analytics,
          monthlyStats,
          summary: {
            total: totalCertificates,
            active: activeCertificates,
            revoked: revokedCertificates,
          },
        },
      });
    } catch (error) {
      console.error("Get certificate analytics error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve certificate analytics",
      });
    }
  }
}

export default CertificateController;
