import React, { createContext, useReducer } from "react";

// Initial state for training creation
const initialState = {
  // Basic Info (from Document tab)
  basicInfo: {
    quizTitle: "",
    title: "",
    topic: "",
    category: "",
    description: "",
    totalMarks: "",
    timeLimit: "15",
    maxAttempts: "1",
  },

  // Exam Simulator (from QuestionsContent tab)
  examSimulator: {
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    showCorrectAnswers: true,
    allowReview: true,
  },

  // Guided Questions
  guidedQuestions: {
    questions: [],
    files: [],
  },

  // Documents
  documents: {
    files: [],
    uploadedFiles: [],
  },

  // Quiz Settings
  settings: {
    shuffleQuestions: false,
    isActive: true,
    isPaid: false,
    price: 0,
    certificateEnabled: true,
    randomizeAnswers: false,
  },

  // Creation state
  creation: {
    currentStep: "exam",
    isCreating: false,
    createdProgramId: null,
    errors: {},
  },
};

// Actions for the reducer
const ACTIONS = {
  UPDATE_BASIC_INFO: "UPDATE_BASIC_INFO",
  UPDATE_EXAM_SIMULATOR: "UPDATE_EXAM_SIMULATOR",
  UPDATE_GUIDED_QUESTIONS: "UPDATE_GUIDED_QUESTIONS",
  UPDATE_DOCUMENTS: "UPDATE_DOCUMENTS",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  SET_CURRENT_STEP: "SET_CURRENT_STEP",
  SET_CREATING: "SET_CREATING",
  SET_CREATED_PROGRAM_ID: "SET_CREATED_PROGRAM_ID",
  SET_ERRORS: "SET_ERRORS",
  RESET_FORM: "RESET_FORM",
  ADD_DOCUMENT: "ADD_DOCUMENT",
  REMOVE_DOCUMENT: "REMOVE_DOCUMENT",
  ADD_QUESTION: "ADD_QUESTION",
  REMOVE_QUESTION: "REMOVE_QUESTION",
  UPDATE_QUESTION: "UPDATE_QUESTION",
};

// Reducer function
const trainingReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_BASIC_INFO:
      return {
        ...state,
        basicInfo: { ...state.basicInfo, ...action.payload },
      };

    case ACTIONS.UPDATE_EXAM_SIMULATOR:
      return {
        ...state,
        examSimulator: { ...state.examSimulator, ...action.payload },
      };

    case ACTIONS.UPDATE_GUIDED_QUESTIONS:
      return {
        ...state,
        guidedQuestions: { ...state.guidedQuestions, ...action.payload },
      };

    case ACTIONS.UPDATE_DOCUMENTS:
      return {
        ...state,
        documents: { ...state.documents, ...action.payload },
      };

    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case ACTIONS.SET_CURRENT_STEP:
      return {
        ...state,
        creation: { ...state.creation, currentStep: action.payload },
      };

    case ACTIONS.SET_CREATING:
      return {
        ...state,
        creation: { ...state.creation, isCreating: action.payload },
      };

    case ACTIONS.SET_CREATED_PROGRAM_ID:
      return {
        ...state,
        creation: { ...state.creation, createdProgramId: action.payload },
      };

    case ACTIONS.SET_ERRORS:
      return {
        ...state,
        creation: { ...state.creation, errors: action.payload },
      };

    case ACTIONS.ADD_DOCUMENT:
      return {
        ...state,
        documents: {
          ...state.documents,
          files: [...state.documents.files, action.payload],
        },
      };

    case ACTIONS.REMOVE_DOCUMENT:
      return {
        ...state,
        documents: {
          ...state.documents,
          files: state.documents.files.filter(
            (_, index) => index !== action.payload
          ),
        },
      };

    case ACTIONS.ADD_QUESTION:
      return {
        ...state,
        examSimulator: {
          ...state.examSimulator,
          questions: [...state.examSimulator.questions, action.payload],
        },
      };

    case ACTIONS.REMOVE_QUESTION:
      return {
        ...state,
        examSimulator: {
          ...state.examSimulator,
          questions: state.examSimulator.questions.filter(
            (_, index) => index !== action.payload
          ),
        },
      };

    case ACTIONS.UPDATE_QUESTION:
      return {
        ...state,
        examSimulator: {
          ...state.examSimulator,
          questions: state.examSimulator.questions.map((question, index) =>
            index === action.payload.index
              ? { ...question, ...action.payload.updates }
              : question
          ),
        },
      };

    case ACTIONS.RESET_FORM:
      return initialState;

    default:
      return state;
  }
};

// Create context
const TrainingCreationContext = createContext();

// Context provider component
export const TrainingCreationProvider = ({ children, initialProgram }) => {
  // If we have an initialProgram, merge it with initialState
  const getInitialState = () => {
    if (!initialProgram) return initialState;

    return {
      basicInfo: {
        quizTitle: initialProgram.title || initialProgram.name || "",
        title: initialProgram.title || initialProgram.name || "",
        topic: initialProgram.topic || "",
        category: initialProgram.category || "",
        description: initialProgram.description || "",
        totalMarks: initialProgram.marks || initialProgram.totalMarks || "",
        timeLimit: initialProgram.duration || initialProgram.timeLimit || "15",
        maxAttempts: initialProgram.maxAttempts || "1",
      },
      examSimulator: {
        questions: initialProgram.questions || [],
        timeLimit: initialProgram.duration || 30,
        passingScore: initialProgram.passingScore || 70,
        maxAttempts: initialProgram.maxAttempts || 3,
        showCorrectAnswers:
          initialProgram.showCorrectAnswers !== undefined
            ? initialProgram.showCorrectAnswers
            : true,
        allowReview:
          initialProgram.allowReview !== undefined
            ? initialProgram.allowReview
            : true,
      },
      guidedQuestions: {
        questions: initialProgram.guidedQuestions || [],
        files: [],
      },
      documents: {
        files: [],
        uploadedFiles: initialProgram.documents || [],
      },
      settings: {
        shuffleQuestions: initialProgram.shuffleQuestions || false,
        isActive:
          initialProgram.isActive !== undefined
            ? initialProgram.isActive
            : true,
        isPaid: initialProgram.isPaid || false,
        price: initialProgram.price || 0,
        certificateEnabled:
          initialProgram.certificateEnabled !== undefined
            ? initialProgram.certificateEnabled
            : true,
        randomizeAnswers: initialProgram.randomizeAnswers || false,
      },
      creation: {
        currentStep: "exam",
        isCreating: false,
        createdProgramId: initialProgram._id || null,
        errors: {},
      },
    };
  };

  const [state, dispatch] = useReducer(trainingReducer, getInitialState());

  // Action creators
  const actions = {
    updateBasicInfo: (data) =>
      dispatch({ type: ACTIONS.UPDATE_BASIC_INFO, payload: data }),
    updateExamSimulator: (data) =>
      dispatch({ type: ACTIONS.UPDATE_EXAM_SIMULATOR, payload: data }),
    updateGuidedQuestions: (data) =>
      dispatch({ type: ACTIONS.UPDATE_GUIDED_QUESTIONS, payload: data }),
    updateDocuments: (data) =>
      dispatch({ type: ACTIONS.UPDATE_DOCUMENTS, payload: data }),
    updateSettings: (data) =>
      dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: data }),
    setCurrentStep: (step) =>
      dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: step }),
    setCreating: (isCreating) =>
      dispatch({ type: ACTIONS.SET_CREATING, payload: isCreating }),
    setCreatedProgramId: (id) =>
      dispatch({ type: ACTIONS.SET_CREATED_PROGRAM_ID, payload: id }),
    setErrors: (errors) =>
      dispatch({ type: ACTIONS.SET_ERRORS, payload: errors }),
    addDocument: (document) =>
      dispatch({ type: ACTIONS.ADD_DOCUMENT, payload: document }),
    removeDocument: (index) =>
      dispatch({ type: ACTIONS.REMOVE_DOCUMENT, payload: index }),
    addQuestion: (question) =>
      dispatch({ type: ACTIONS.ADD_QUESTION, payload: question }),
    removeQuestion: (index) =>
      dispatch({ type: ACTIONS.REMOVE_QUESTION, payload: index }),
    updateQuestion: (index, updates) =>
      dispatch({ type: ACTIONS.UPDATE_QUESTION, payload: { index, updates } }),
    resetForm: () => dispatch({ type: ACTIONS.RESET_FORM }),
  };

  // Validation functions
  const validateBasicInfo = () => {
    const errors = {};
    if (!state.basicInfo.title.trim()) errors.title = "Title is required";
    if (!state.basicInfo.topic.trim()) errors.topic = "Topic is required";
    if (!state.basicInfo.category.trim())
      errors.category = "Category is required";
    if (!state.basicInfo.description.trim())
      errors.description = "Description is required";
    return errors;
  };

  const validateExamSimulator = () => {
    const errors = {};
    if (state.examSimulator.questions.length === 0) {
      errors.questions = "At least one question is required";
    }
    if (state.examSimulator.timeLimit <= 0) {
      errors.timeLimit = "Time limit must be greater than 0";
    }
    if (
      state.examSimulator.passingScore < 0 ||
      state.examSimulator.passingScore > 100
    ) {
      errors.passingScore = "Passing score must be between 0 and 100";
    }
    return errors;
  };

  const isFormValid = () => {
    const basicInfoErrors = validateBasicInfo();
    const examSimulatorErrors = validateExamSimulator();
    return (
      Object.keys(basicInfoErrors).length === 0 &&
      Object.keys(examSimulatorErrors).length === 0
    );
  };

  return (
    <TrainingCreationContext.Provider
      value={{
        state,
        actions,
        validateBasicInfo,
        validateExamSimulator,
        isFormValid,
      }}
    >
      {children}
    </TrainingCreationContext.Provider>
  );
};

// Custom hook to use the training creation context
export const useTrainingCreation = () => {
  const context = React.useContext(TrainingCreationContext);
  if (!context) {
    throw new Error(
      "useTrainingCreation must be used within a TrainingCreationProvider"
    );
  }
  return context;
};

export default TrainingCreationContext;
