"use client"
import React from "react";

interface GastosTabsProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

const GastosTabs: React.FC<GastosTabsProps> = ({ currentTab, onChangeTab }) => {
  return (
    <ul className="nav nav-tabs justify-content-center mt-4">
      <li className="nav-item">
        <button className={`nav-link${currentTab === "Total" ? " active" : ""}`} onClick={() => onChangeTab("Total")}>
          Suas Finanças
        </button>
      </li>
      <li className="nav-item">
        <button className={`nav-link${currentTab === "Gráfico de Gastos" ? " active" : ""}`} onClick={() => onChangeTab("Gráfico de Gastos")}>
          Gráfico de Gastos
        </button>
      </li>
    </ul>
  );
};

export default GastosTabs;
