"use client"

import React from "react";

interface BudgetDisplayProps {
  initialBudget: number | null;
  onAddFunds: () => void;
  onReset: () => void;
}

const BudgetDisplay: React.FC<BudgetDisplayProps> = ({ initialBudget, onAddFunds, onReset }) => {
  const handleAddFunds = () => {
    onAddFunds();
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="budget-display alert alert-primary" role="alert">
      <h3 className="mb-3">
        Seu saldo é de: <strong>{initialBudget ? (initialBudget > 0 ? initialBudget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Não definido") : ""}</strong>
      </h3>
      {initialBudget !== null && initialBudget <= 0 && (
        <button className="btn btn-primary mr-3" onClick={handleAddFunds}>
          Adicionar Fundos
        </button>
      )}
      {initialBudget !== null && initialBudget > 0 && (
        <>
          <button className="btn btn-primary mr-3" onClick={handleAddFunds}>
            Adicionar Fundos
          </button>
          <button className="btn btn-outline-warning" onClick={handleReset}>
            Reiniciar
          </button>
        </>
      )}
    </div>
  );
};

export default BudgetDisplay;
