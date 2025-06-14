import React, { useEffect, useState } from "react";
import { API } from "../../services/apiServices";
import CalendarComponent from "./CalendarComponent";
import GraphComponent from "./GraphComponent";
import HistoryComponent from "./HistoryComponent";

const joursSemaine = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const getTodayName = () => joursSemaine[new Date().getDay()];

export default function DashboardContent_R() {
  const [stats, setStats] = useState({
    allCount: 0, petitDejCount: 0, lunchCount: 0, dinnerCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = getTodayName();
  const tomorrow = joursSemaine[(joursSemaine.indexOf(today)+1)%7];

  useEffect(() => {
    API.jour.list()
      .then(res => {
        const tomorrowData = res.results.find(j => j.nomJour === tomorrow);
        if (tomorrowData) {
          setStats({
            allCount: tomorrowData.nbre_reserve_jour,
            petitDejCount: tomorrowData.nbre_reserve_lendemain_petitDej,
            lunchCount: tomorrowData.nbre_reserve_lendemain_dejeuner,
            dinnerCount: tomorrowData.nbre_reserve_lendemain_diner,
          });
        }
      })
      .catch(err => setError("Erreur récupération stats"))
      .finally(() => setLoading(false));
  }, [tomorrow]);

  if (loading) return <div>Chargement…</div>;
  if (error)   return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-2">
          Réservations pour {tomorrow}
        </h2>
        <p>Total : {stats.allCount}</p>
        <p>Petit-déj : {stats.petitDejCount}</p>
        <p>Déj : {stats.lunchCount}</p>
        <p>Dîner : {stats.dinnerCount}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 md:col-span-1">
        <HistoryComponent />
      </div>
      <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
        <CalendarComponent />
      </div>
      <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
        <GraphComponent />
      </div>
    </div>
  );
}
