import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { API } from "../../services/apiServices";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const getCurrentWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
};

const joursSemaine = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

const GraphComponent = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    API.reservation.list()
      .then(res => {
        setReservations(res.results);
      })
      .catch(err => console.error("Erreur chargement réservations :", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Chargement…</div>;
  }
  if (!reservations.length) {
    return <div className="p-4 text-center text-gray-500">Aucune réservation.</div>;
  }

  const byDay = reservations.reduce((acc, r) => {
    if (weekDates.includes(r.date)) {
      const idx = weekDates.indexOf(r.date);
      acc[idx] = (acc[idx] || 0) + 1;
    }
    return acc;
  }, {});

  const data = {
    labels: joursSemaine,
    datasets: [
      {
        label: "Réservations",
        data: weekDates.map((_, i) => byDay[i] || 0),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
      x: { title: { display: false } },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-center">Semaine</h2>
      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default GraphComponent;
