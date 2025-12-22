# 🎯 Frontend Integration Examples

This file shows how to integrate the backend APIs with your React components.

---

## 📁 Setup

1. Copy `api.service.example.js` to `src/services/api.service.js`
2. Create `.env` file in front-end root:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Authentication Examples

### Login Component

```jsx
// src/Pages/Auth/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Stores/authSlice";
import { authAPI, handleAPIError } from "../../services/api.service";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        toast.success("Login successful!");
        dispatch(loginSuccess());
        
        // Check if admin
        const userData = response.data;
        if (userData.email === "admin@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your form JSX
  );
};
```

### Register Component

```jsx
// src/Pages/Auth/SignUpPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI, handleAPIError } from "../../services/api.service";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      
      if (response.success) {
        toast.success("Registration successful! Please verify your OTP.");
        // Store email for OTP verification
        localStorage.setItem("verifyEmail", formData.email);
        navigate("/otp");
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your form JSX
  );
};
```

### OTP Verification

```jsx
// src/Pages/Auth/OtpPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI, handleAPIError } from "../../services/api.service";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("verifyEmail");
    if (!storedEmail) {
      navigate("/register");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyOtp(email, otp);
      
      if (response.success) {
        toast.success("Email verified successfully!");
        localStorage.removeItem("verifyEmail");
        navigate("/login");
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your OTP input JSX
  );
};
```

---

## 📚 Topics & Programs

### Topics Page

```jsx
// src/Pages/Topics/Topics.jsx
import { useState, useEffect } from "react";
import { topicAPI, handleAPIError } from "../../services/api.service";
import toast from "react-hot-toast";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
  });

  useEffect(() => {
    fetchTopics();
  }, [filters]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await topicAPI.getAll(filters);
      
      if (response.success) {
        setTopics(response.data);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading topics...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <div key={topic._id} className="card">
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <p>Starting from {topic.pricing.bundlePrice} {topic.pricing.currency}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### All Programs Component

```jsx
// src/components/Shared/AllPrograms.jsx
import { useState, useEffect } from "react";
import { programAPI, handleAPIError } from "../../services/api.service";
import { Link } from "react-router-dom";

export default function AllPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await programAPI.getAll();
      
      if (response.success) {
        setPrograms(response.data);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      console.error("Error fetching programs:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading programs...</div>;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {programs.map((program) => (
        <div key={program._id} className="bg-white rounded-xl border">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{program.name}</h3>
            <p className="text-sm text-gray-600">{program.description}</p>
            
            <div className="mt-4 flex justify-between">
              <span className="text-sm">
                {program.examSimulator?.questions?.length || 0} Questions
              </span>
              <span className="text-sm">
                {program.examSimulator?.timeLimit || 0} mins
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Link to={`/overview/${program._id}/course-overview`}>
                <button className="w-full p-2 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg">
                  Train with LearninGPT
                </button>
              </Link>
              <Link to={`/overview/${program._id}/exam-simulator`}>
                <button className="w-full p-2 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg">
                  Start Exam Simulator
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Quiz System

### Start Quiz

```jsx
// src/Pages/QuizInterface/QuizStart.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI, handleAPIError } from "../../services/api.service";
import toast from "react-hot-toast";

export default function QuizStart() {
  const { programId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    setLoading(true);

    try {
      const response = await quizAPI.start(programId);
      
      if (response.success) {
        const { attemptId, questions } = response.data;
        
        // Store attempt data
        sessionStorage.setItem("currentAttempt", JSON.stringify({
          attemptId,
          questions,
          startTime: Date.now(),
        }));
        
        navigate(`/quiz-interface/${attemptId}`);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleStartQuiz}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        {loading ? "Starting..." : "Start Exam"}
      </button>
    </div>
  );
}
```

### Quiz Interface & Submit

```jsx
// src/Pages/QuizInterface/QuizInterface.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI, handleAPIError } from "../../services/api.service";
import toast from "react-hot-toast";

export default function QuizInterface() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attemptData, setAttemptData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("currentAttempt");
    if (stored) {
      const data = JSON.parse(stored);
      setAttemptData(data);
      setTimeLeft(data.timeLimit * 60); // Convert to seconds
      
      // Initialize answers array
      setAnswers(data.questions.map(() => ({
        questionId: null,
        selectedAnswers: [],
      })));
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && attemptData) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId, selectedAnswers) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = { questionId, selectedAnswers };
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const startTime = attemptData.startTime;
      const timeTaken = Math.floor((Date.now() - startTime) / 1000 / 60); // in minutes

      const response = await quizAPI.submit(attemptId, answers, timeTaken);
      
      if (response.success) {
        toast.success("Quiz submitted successfully!");
        sessionStorage.removeItem("currentAttempt");
        navigate(`/quiz-result/${attemptId}`);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your quiz interface JSX
  );
}
```

---

## 🤖 AI Chat

### AI Chat Dashboard

```jsx
// src/Pages/Dashboard/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { aiChatAPI, handleAPIError } from "../../services/api.service";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [sessionId, setSessionId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingChats, setRemainingChats] = useState(3);

  useEffect(() => {
    // Create session on mount
    createSession();
  }, []);

  const createSession = async () => {
    try {
      const response = await aiChatAPI.createSession("General Learning");
      
      if (response.success) {
        setSessionId(response.data.sessionId);
        setRemainingChats(response.data.remainingChats);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      console.error("Error creating session:", errorInfo);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId) return;

    const userMessage = { sender: "user", text: inputValue };
    setConversations((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await aiChatAPI.sendMessage(
        sessionId,
        inputValue,
        "beginner"
      );
      
      if (response.success) {
        const aiMessage = {
          sender: "ai",
          text: response.data.aiResponse,
        };
        setConversations((prev) => [...prev, aiMessage]);
        setRemainingChats(response.data.remainingChats);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      
      if (errorInfo.status === 403) {
        // Free limit reached
        toast.error("Free chat limit reached. Please upgrade!");
      } else {
        toast.error(errorInfo.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {conversations.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      
      <div className="chat-info">
        Remaining free chats: {remainingChats}
      </div>
    </div>
  );
};
```

---

## 👨‍💼 Admin Panel

### Admin Dashboard

```jsx
// src/components/Admin/Dashboard/StartCards.jsx
import { useState, useEffect } from "react";
import { adminAPI, handleAPIError } from "../../../services/api.service";

export const StartCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      console.error("Error fetching stats:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="stat-card">
        <h3>Total Users</h3>
        <p>{stats?.overview?.totalUsers || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Total Programs</h3>
        <p>{stats?.overview?.totalPrograms || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Quiz Attempts</h3>
        <p>{stats?.overview?.totalQuizAttempts || 0}</p>
      </div>
    </div>
  );
};
```

### Create Topic (Admin)

```jsx
// src/components/Admin/Quizz/AdminTopics.jsx
import { useState } from "react";
import { topicAPI, handleAPIError } from "../../../services/api.service";
import toast from "react-hot-toast";

const AdminTopics = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    numberOfFreeQuestions: 3,
    chatbotPrice: "",
    documentationPrice: "",
    examSimulatorPrice: "",
    bundlePrice: "",
    overview: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await topicAPI.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        numberOfFreeQuestions: parseInt(formData.numberOfFreeQuestions),
        chatbotPrice: parseFloat(formData.chatbotPrice),
        documentationPrice: parseFloat(formData.documentationPrice),
        examSimulatorPrice: parseFloat(formData.examSimulatorPrice),
        bundlePrice: parseFloat(formData.bundlePrice),
        overview: formData.overview,
        coverImage: formData.coverImage,
      });
      
      if (response.success) {
        toast.success("Topic created successfully!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          numberOfFreeQuestions: 3,
          chatbotPrice: "",
          documentationPrice: "",
          examSimulatorPrice: "",
          bundlePrice: "",
          overview: "",
          coverImage: "",
        });
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... your form fields */}
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Topic"}
      </button>
    </form>
  );
};
```

---

## 🎯 Best Practices

1. **Always handle loading states**
2. **Show user-friendly error messages**
3. **Store auth tokens securely**
4. **Implement retry logic for failed requests**
5. **Clear sensitive data on logout**
6. **Validate data before API calls**
7. **Use environment variables for API URLs**

---

## 🔒 Security Tips

1. Never log sensitive data (tokens, passwords)
2. Clear tokens on logout
3. Handle 401/403 errors properly
4. Validate user input before sending to API
5. Use HTTPS in production

---

## 📞 Need Help?

- Check `API_ENDPOINTS.md` for complete API documentation
- Review `FIXES_SUMMARY.md` for backend changes
- Test endpoints using Thunder Client/Postman first
- Check browser console for detailed error messages
