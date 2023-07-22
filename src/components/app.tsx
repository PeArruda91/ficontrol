"use client"

import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { PieChart, Pie, Cell, Legend } from "recharts";

type Gasto = {
  descricao: string;
  valor: number;
  data: string;
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
      setShowInitialBudgetModal(false);
    } else {
      setShowInitialBudgetModal(true);
    }
  }, []);

  const adicionarGasto = (descricao: string, valor: number) => {
    if (valor <= 0) {
      alert("O valor do gasto deve ser maior que zero.");
    } else if (initialBudget !== null && valor <= initialBudget) {
      const now = new Date();
      const dataHora = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;

      setGastos((prevGastos) => {
        return {
          ...prevGastos,
          [currentTab]: [...prevGastos[currentTab], { descricao, valor, data: dataHora }],
        };
      });
      setInitialBudget((prevBudget) => prevBudget! - valor);
    } else {
      alert("Saldo insuficiente!");
    }
  };

  const exibirGastos = (tab: string) => {
    const gastosExibir = tab === "Total" ? gastos[tab].slice(1) : gastos[tab];
    return (
      <ul>
        {gastosExibir.map((gasto, index) => (
          <li key={index} className={getColorClass(index)}>
            {gasto.descricao} - {gasto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} - {gasto.data}
            <button onClick={() => deletarGasto(tab, index)} className="btn btn-sm btn-danger ml-2">
              <i className="bi bi-x"></i>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const deletarGasto = (tab: string, index: number) => {
    setGastos((prevGastos) => {
      const updatedGastos = [...prevGastos[tab]];
      const deletedGasto = updatedGastos.splice(index, 1)[0];
      setInitialBudget((prevBudget) => prevBudget! + deletedGasto.valor);
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
    if (budget <= 0) {
      alert("O orçamento deve ser maior que zero.");
    } else {
      let previousBudget = 0;

      const budgetData = localStorage.getItem("initialBudget");
      if (budgetData) {
        previousBudget = Number(budgetData);
      }

      const newBudget = previousBudget + budget;

      localStorage.setItem("initialBudget", newBudget.toString());

      setInitialBudget(newBudget);

      setShowInitialBudgetModal(false);

      setGastos((prevGastos) => ({
        ...prevGastos,
        "Total": [{ descricao: "Orçamento", valor: newBudget, data: "" }],
      }));
    }
  };

  const reiniciarGastos = () => {
    localStorage.clear();
    setGastos({ "Total": [] });
    setInitialBudget(null);
    setShowInitialBudgetModal(true);
  };

  const handleAddFunds = () => {
    setShowInitialBudgetModal(true);
  };

  const getColorClass = (index: number): string => {
    const colors = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-dark"];
    return colors[index % colors.length];
  };

  const getColorsMap = (): Record<string, string> => {
    const colors: string[] = ["#007bff", "#6c757d", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#343a40"];
    const colorsMap: Record<string, string> = {};
    Object.keys(gastos).forEach((tab, index) => {
      if (tab !== "Total") {
        colorsMap[tab] = colors[index % colors.length];
      }
    });
    return colorsMap;
  };

  const calcularTotalGasto = () => {
    let total = 0;
    Object.values(gastos).forEach((gastosPorOpcao) => {
      gastosPorOpcao.forEach((gasto) => {
        total += gasto.valor;
      });
    });
    return total;
  };

  const PieChartComponent = () => {
    const colorsMap = getColorsMap();
    const totalGasto = calcularTotalGasto();
    const orcamentoRestante = initialBudget !== null ? initialBudget - totalGasto : 0;
    const data = [
      { name: "Orçamento Restante", value: orcamentoRestante, fill: colorsMap["Orçamento Restante"] },
      ...Object.entries(gastos)
        .filter(([tab]) => tab !== "Total")
        .map(([tab, gastos]) => ({
          name: tab,
          value: gastos.reduce((total, gasto) => total + gasto.valor, 0),
          fill: colorsMap[tab],
        })),
    ];

    return (
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={(entry) => entry.name}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    );
  };


  return (
    <div className="container text-center">
      <h1 className="my-4">Controlador financeiro</h1>
      <div className={`modal fade${showInitialBudgetModal || initialBudget === null ? " show" : ""}`} tabIndex={-1} role="dialog" style={{ display: showInitialBudgetModal || initialBudget === null ? "block" : "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Insira seu orçamento total</h5>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  handleSaveInitialBudget(+form.orcamento.value);
                  form.reset();
                }}
              >
                <div className="form-group">
                  <label htmlFor="orcamento">Orçamento:</label>
                  <input type="number" id="orcamento" className="form-control" step="0.01" defaultValue="0.00" required />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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
            <button className="btn btn-outline-warning" onClick={reiniciarGastos}>
              Reiniciar
            </button>
          </>
        )}
      </div>

      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          adicionarGasto(form.descricao.value, +form.valor.value);
          form.reset();
        }}
      >
        <div className="row mb-4">
          <div className="col-md-4">
            <select name="descricao" className="form-control">
              <option value="Contas">Contas</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Farmácia">Farmácia</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div className="col-md-4">
            <input type="number" placeholder="Valor" name="valor" className="form-control" step="0.01" defaultValue="0.00" required />
          </div>
          <div className="col-md-4">
            <input type="submit" value="Adicionar gasto" className="btn btn-primary" />
          </div>
        </div>
      </form>
     
      <ul className="nav nav-tabs justify-content-center mt-4">
        <li className="nav-item">
          <button className={`nav-link${currentTab === "Total" ? ' active' : ''}`} onClick={() => setCurrentTab("Total")}>
            Suas Finanças
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link${currentTab === "Gráfico de Gastos" ? ' active' : ''}`} onClick={() => setCurrentTab("Gráfico de Gastos")}>
            Gráfico de Gastos
          </button>
        </li>
      </ul>

      {currentTab === "Total" && (
        <div className="content mt-4">
          {exibirGastos(currentTab)}
        </div>
      )}

      {currentTab === "Gráfico de Gastos" && (
        <div className="pie-chart mt-4">
          <PieChartComponent />
        </div>
      )}
    </div>
  );
};

export default App;