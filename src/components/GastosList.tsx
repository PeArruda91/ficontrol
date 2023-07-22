"use client"

import React from "react";

interface Gasto {
  descricao: string;
  valor: number;
  data: string;
}

interface GastosListProps {
  gastos: Gasto[];
  onDelete: (index: number) => void;
}

const GastosList: React.FC<GastosListProps> = ({ gastos, onDelete }) => {
  const getColorClass = (index: number): string => {
    const colors = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-dark"];
    return colors[index % colors.length];
  };

  return (
    <ul>
      {gastos.map((gasto, index) => (
        <li key={index} className={getColorClass(index)}>
          {gasto.descricao} - {gasto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} - {gasto.data}
          <button onClick={() => onDelete(index)} className="btn btn-sm btn-danger ml-2">
            <i className="bi bi-x"></i>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default GastosList;
