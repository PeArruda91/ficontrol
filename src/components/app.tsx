"use client"

import React, { useState, useEffect } from "react";

type Gasto = {
  descricao: string;
  valor: number;
};

type GastosPorDia = Record<string, Gasto[]>;

const App: React.FC = () => {
  const [gastos, setGastos] = useState<GastosPorDia>({
    "segunda-feira": [],
    "terça-feira": [],
    "quarta-feira": [],
    "quinta-feira": [],
    "sexta-feira": [],
    "sábado": [],
    "domingo": [],
  });

  const [diaDaSemana, setDiaDaSemana] = useState<string>("segunda-feira");

  useEffect(() => {
    const data = localStorage.getItem("gastos");
    if (data) {
      setGastos(JSON.parse(data) as GastosPorDia);
    }
  }, []);

  const adicionarGasto = (descricao: string, valor: number) => {
    setGastos((prevGastos) => {
      return {
        ...prevGastos,
        [diaDaSemana]: [...prevGastos[diaDaSemana], { descricao, valor }],
      };
    });
  };

  const exibirGastos = (dia: string) => {
    return (
      <ul>
        {gastos[dia].map((gasto, index) => (
          <li key={index}>
            {gasto.descricao} - {gasto.valor}
            <button onClick={() => deletarGasto(dia, index)}>Deletar</button>
          </li>
        ))}
      </ul>
    );
  };

  const deletarGasto = (dia: string, index: number) => {
    setGastos((prevGastos) => {
      const updatedGastos = [...prevGastos[dia]];
      updatedGastos.splice(index, 1);
      return {
        ...prevGastos,
        [dia]: updatedGastos,
      };
    });
  };

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  return (
    <div>
      <h1>Controlador financeiro</h1>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          adicionarGasto(form.descricao.value, +form.valor.value);
          form.reset();
        }}
      >
        <select name="descricao">
          <option value="Contas">Contas</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Farmácia">Farmácia</option>
          <option value="Outros">Outros</option>
        </select>
        <input type="number" placeholder="Valor" name="valor" />
        <input type="submit" value="Adicionar gasto" />
      </form>
      <ul className="tabs">
        {Object.keys(gastos).map((dia) => (
          <li key={dia}>
            <button onClick={() => setDiaDaSemana(dia)}>
              {dia.charAt(0).toUpperCase() + dia.slice(1)}
            </button>
          </li>
        ))}
      </ul>
      <div className="content">{exibirGastos(diaDaSemana)}</div>
    </div>
  );
};

export default App;
