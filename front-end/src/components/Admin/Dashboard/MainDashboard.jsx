import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { adminAPI } from "../../../services/api.service";
import avatar1 from "../../../assets/admin-dashboard-images/table-avatar/1.png";
import avatar2 from "../../../assets/admin-dashboard-images/table-avatar/2.png";
import avatar3 from "../../../assets/admin-dashboard-images/table-avatar/3.png";
import avatar4 from "../../../assets/admin-dashboard-images/table-avatar/4.png";
import avatar5 from "../../../assets/admin-dashboard-images/table-avatar/5.png";

// Register everything
Chart.register(...registerables);

const Dashboard = ({ dashboardData }) => {
  const [chartData, setChartData] = useState({
    revenueData: [2, 4, 3, 2, 4, 3, 2, 3, 2, 4],
    userData: [3, 2, 4, 3, 5, 4, 3, 2, 4, 5],
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    topScorers: [
      { name: "Alice", score: 95, avatar: avatar1 },
      { name: "Bob", score: 89, avatar: avatar2 },
      { name: "Charlie", score: 87, avatar: avatar3 },
      { name: "Diana", score: 82, avatar: avatar4 },
      { name: "Shayana", score: 82, avatar: avatar5 },
    ],
  });

  useEffect(() => {
    // If dashboardData is available and not loading, fetch full chart data
    if (dashboardData && !dashboardData.loading) {
      fetchChartData();
    }
  }, [dashboardData]);

  const fetchChartData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();

      if (response.success && response.data) {
        const { charts, recentActivity } = response.data;

        setChartData({
          revenueData: charts?.revenueData || [2, 4, 3, 2, 4, 3, 2, 3, 2, 4],
          userData: charts?.userData || [3, 2, 4, 3, 5, 4, 3, 2, 4, 5],
          labels: charts?.labels || [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
          ],
          topScorers: recentActivity?.topScorers || [
            { name: "Alice", score: 95, avatar: avatar1 },
            { name: "Bob", score: 89, avatar: avatar2 },
            { name: "Charlie", score: 87, avatar: avatar3 },
            { name: "Diana", score: 82, avatar: avatar4 },
            { name: "Shayana", score: 82, avatar: avatar5 },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    }
  };
  const revenueChartRef = useRef(null);
  const userChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const userChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    // Don't create charts if data isn't ready
    if (!chartData) return;

    // Cleanup before creating
    if (revenueChartInstance.current) revenueChartInstance.current.destroy();
    if (userChartInstance.current) userChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    // Create gradient for Revenue Chart
    const revenueCtx = revenueChartRef.current.getContext("2d");
    const revenueGradient = revenueCtx.createLinearGradient(0, 0, 0, 400);
    revenueGradient.addColorStop(0, "#6D9FE0");
    revenueGradient.addColorStop(1, "rgba(172, 204, 246, 0.5)");

    // Create gradient for User Chart
    const userCtx = userChartRef.current.getContext("2d");
    const userGradient = userCtx.createLinearGradient(0, 0, 0, 400);
    userGradient.addColorStop(0, "#6D9FE0");
    userGradient.addColorStop(1, "rgba(172, 204, 246, 0.5)");

    // Revenue Chart
    revenueChartInstance.current = new Chart(revenueChartRef.current, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.revenueData,
            borderColor: "#6D9FE0",
            backgroundColor: revenueGradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
          },
          y: {
            display: true,
            grid: {
              display: true,
              color: "rgba(0,0,0,0.1)",
            },
          },
        },
      },
    });

    // User Chart
    userChartInstance.current = new Chart(userChartRef.current, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.userData,
            borderColor: "#6D9FE0",
            backgroundColor: userGradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
          },
          y: {
            display: true,
            grid: {
              display: true,
              color: "rgba(0,0,0,0.1)",
            },
          },
        },
      },
    });

    // Pie Chart
    pieChartInstance.current = new Chart(pieChartRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [60, 40],
            backgroundColor: [
              // First gradient color
              (() => {
                const ctx = pieChartRef.current.getContext("2d");
                const gradient = ctx.createLinearGradient(0, 0, 0, 200); // vertical gradient
                gradient.addColorStop(0, "#0E5F98");
                gradient.addColorStop(1, "#2D889C");
                return gradient;
              })(),
              // Second solid color
              "#189EFE",
            ],
            cutout: "60%",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    // Cleanup
    return () => {
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      if (userChartInstance.current) userChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();
    };
  }, [chartData]);

  return (
    <div className="px-0 pt-5 lg:px-20 lg:pt-20 pb-10 lg:pb-5">
      {/* Top row with charts */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-28 pb-10 lg:pb-20">
        {/* Total Revenue Chart */}
        <div className="bg-[#F2F7FF] drop-shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium text-[#004399] mb-24">
            Total revenue
          </h3>
          <div className="relative">
            <canvas ref={revenueChartRef}></canvas>
          </div>
        </div>

        {/* Total User Chart */}
        <div className="bg-[#F2F7FF] drop-shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium text-[#004399] mb-24">
            Total user
          </h3>
          <div className="relative">
            <canvas ref={userChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 lg:gap-6">
        <div>
          <h3 className="text-xl font-medium text-black mb-3 text-center">
            Top scorer
          </h3>
          {/* Top Scorer */}
          <div className="bg-[#D6EEFF] rounded-tr-3xl rounded-bl-3xl p-6 shadow-sm">
            <div className="space-y-4">
              {chartData.topScorers.map((scorer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {scorer.avatar ? (
                        <img
                          src={scorer.avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium text-sm">
                          {scorer.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-800 font-medium">
                      {scorer.name}
                    </span>
                  </div>
                  <span className="text-gray-800 font-semibold">
                    {scorer.avgScore
                      ? scorer.avgScore.toFixed(1)
                      : scorer.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="">
          <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-7">
            {/* Legend */}
            <div className="">
              {/* Web */}
              <div className="flex items-center justify-between mb-7 w-64">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-9 rounded-sm bg-[#2D889C]"></div>
                  <div className="text-black font-medium text-xl">Web</div>
                </div>
                <div className="text-black font-medium text-xl">60%</div>
              </div>

              {/* Mobile */}
              <div className="flex items-center justify-between w-64">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-9 rounded-sm bg-[#189EFE]"></div>
                  <div className="text-black font-medium text-xl">Mobile</div>
                </div>
                <div className="text-black font-medium text-xl">40%</div>
              </div>
            </div>

            <div className="w-56 h-56 relative">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
