"use client"

import React, { useState, useEffect } from "react";

const App = () => {
  const [gastos, setGastos] = useState({
    "segunda-feira": [],
    "terça-feira": [],
    "quarta-feira": [],
    "quinta-feira": [],
    "sexta-feira": [],
    "sábado": [],
    "domingo": [],
  });
  const [diaDaSemana, setDiaDaSemana] = useState("segunda-feira");

  useEffect(() => {
    const data = localStorage.getItem("gastos");
    if (data) {
      setGastos(JSON.parse(data));
    }
  }, []);

  const adicionarGasto = (descricao: any, valor: any) => {
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
        {gastos[dia].map((gasto: { descricao: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; valor: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }, index: React.Key | null | undefined) => (
          <li key={index}>
            {gasto.descricao} - {gasto.valor}
            <button onClick={() => deletarGasto(dia, index)}>Deletar</button>
          </li>
        ))}
      </ul>
    );
  };

  const deletarGasto = (dia: string | number, index: number) => {
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
        onSubmit={(e) => {
          e.preventDefault();
          adicionarGasto(e.target.descricao.value, e.target.valor.value);
        }}
      >
        <input type="text" placeholder="Descrição" name="descricao" />
        <input type="number" placeholder="Valor" name="valor" />
        <input type="submit" value="Adicionar gasto" />
      </form>
      <ul className="tabs">
        {Object.keys(gastos).map((dia) => (
          <li key={dia}>
            <a href="#" onClick={() => setDiaDaSemana(dia)}>
              {dia.charAt(0).toUpperCase() + dia.slice(1)}
            </a>
          </li>
        ))}
      </ul>
      <div className="content">{exibirGastos(diaDaSemana)}</div>
    </div>
  );
};

export default App;
