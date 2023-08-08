import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { UseSession } from "../../Context/Session";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./Charts.css";
ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart() {
  const session = UseSession();
  const [pieData, setPieData] = React.useState([]);
  React.useEffect(() => {
    const requestOption = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(
      `http://localhost:3000/recipe/countRecipes/${session.session.userId}`,
      requestOption
    )
      .then((res) => (res.ok ? res.json() : { counter: [] }))
      .then((data) => {
        setPieData(data.counter);
      });
  }, [pieData]);
  return (
    <Pie
      data={{
        labels: ["My Recipes", "Other Recipes"],
        datasets: [
          {
            label: "# of Recipes",
            data: pieData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      }}
    />
  );
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart() {
  const [pieData, setPieData] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const session = UseSession();
  React.useEffect(() => {
    const requestOption = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(
      `http://localhost:3000/recipe/countIdentifier/${session.session.userId}`,
      requestOption
    )
      .then((res) => (res.ok ? res.json() : { counter: [] }))
      .then((data) => {
        setPieData(data.counter);
      });
    fetch("http://localhost:3000/recipe/identifiers", requestOption)
      .then((res) => (res.ok ? res.json() : { identifiers: [] }))
      .then((data) => {
        setLabels(data.identifiers);
      });
  }, [pieData]);
  return (
    <Bar
      data={{
        labels: labels,
        datasets: [
          {
            label: "Identifiers",
            data: pieData,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
          },
        ],
      }}
    />
  );
}

function Charts() {
  return (
    <>
      <h3> Your recipe division according to identifiers</h3>
      <div className="bar-container">
        <BarChart />
      </div>
      <h3> Amount of recipes compared to the total number of users</h3>
      <div className="pie-container">
        <PieChart />
      </div>
    </>
  );
}

export default Charts;
