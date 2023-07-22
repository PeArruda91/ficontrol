"use client"


import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

type Gasto = {
  descricao: string;
  valor: number;
  data: string;
};

type GastosPorDia = Record<string, Gasto[]>;

const App: React.FC = () => {
  // State
  const [gastos, setGastos] = useState<GastosPorDia>({
    "Total": [],
  });
  const [currentTab, setCurrentTab] = useState<string>("Total");
  const [initialBudget, setInitialBudget] = useState<number | null>(null);
  const [showInitialBudgetModal, setShowInitialBudgetModal] = useState(true);

  // Effects
  useEffect(() => {
    // Carrega os gastos salvos no localStorage ao carregar a página
    const data = localStorage.getItem("gastos");
    if (data) {
      setGastos(JSON.parse(data) as GastosPorDia);
    }

    // Carrega o orçamento inicial do localStorage
    const budgetData = localStorage.getItem("initialBudget");
    if (budgetData) {
      setInitialBudget(Number(budgetData));
      setShowInitialBudgetModal(false);
    } else {
      setShowInitialBudgetModal(true);
    }
  }, []);

  useEffect(() => {
    // Salva os gastos no localStorage sempre que houver uma alteração
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  // Funções
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

  const calcularTotalGasto = () => {
    let total = 0;
    Object.values(gastos).forEach((gastosPorOpcao) => {
      gastosPorOpcao.forEach((gasto) => {
        total += gasto.valor;
      });
    });
    return total;
  };

  // Helpers
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
      </ul>
    </div>
  );
};

export default App;