"use client"

import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

type Gasto = {
  descricao: string;
  valor: number;
};

type GastosPorDia = Record<string, Gasto[]>;

const App: React.FC = () => {
  const [gastos, setGastos] = useState<GastosPorDia>({
    "Total": [],
  });

  const [currentTab, setCurrentTab] = useState<string>("Total");
  const [initialBudget, setInitialBudget] = useState<number | null>(null);
  const [showInitialBudgetModal, setShowInitialBudgetModal] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("gastos");
    if (data) {
      setGastos(JSON.parse(data) as GastosPorDia);
    }

    const budgetData = localStorage.getItem("initialBudget");
    if (budgetData) {
      setInitialBudget(Number(budgetData));
    } else {
      setShowInitialBudgetModal(true);
    }
  }, []);

  const adicionarGasto = (descricao: string, valor: number) => {
    if (initialBudget !== null && valor <= initialBudget) {
      setGastos((prevGastos) => {
        return {
          ...prevGastos,
          [currentTab]: [...prevGastos[currentTab], { descricao, valor }],
        };
      });
      setInitialBudget((prevBudget) => prevBudget! - valor);
    } else {
      alert("Saldo insuficiente!");
    }
  };

  const exibirGastos = (tab: string) => {
    return (
      <ul>
        {gastos[tab].map((gasto, index) => (
          <li key={index}>
            {gasto.descricao} - {gasto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            <button onClick={() => deletarGasto(tab, index)}>Deletar</button>
          </li>
        ))}
      </ul>
    );
  };

  const deletarGasto = (tab: string, index: number) => {
    setGastos((prevGastos) => {
      const updatedGastos = [...prevGastos[tab]];
      updatedGastos.splice(index, 1);
      return {
        ...prevGastos,
        [tab]: updatedGastos,
      };
    });
  };

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  const handleSaveInitialBudget = (budget: number) => {
    localStorage.setItem("initialBudget", budget.toString());
    setInitialBudget(budget);
    setShowInitialBudgetModal(false);
  };

  return (
    <div className="container text-center">
      <h1>Controlador financeiro</h1>
      <div
        className={`modal fade${showInitialBudgetModal ? " show" : ""}`}
        tabIndex={-1}
        role="dialog"
        style={{ display: showInitialBudgetModal ? "block" : "none" }}
      >
      </div>

      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          adicionarGasto(form.descricao.value, +form.valor.value);
          form.reset();
        }}
      >
      </form>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link${currentTab === "Total" ? ' active' : ''}`}
            onClick={() => setCurrentTab("Total")}
          >
            Total
          </button>
        </li>
      </ul>
      <div className="content">
        {exibirGastos(currentTab)}
      </div>
    </div>
  );
};

export default App;
