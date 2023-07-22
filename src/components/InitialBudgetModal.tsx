"use client"

import React from "react";

interface InitialBudgetModalProps {
  show: boolean;
  onSave: (budget: number) => void;
}

const InitialBudgetModal: React.FC<InitialBudgetModalProps> = ({ show, onSave }) => {
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    onSave(+form.orcamento.value);
    form.reset();
  };

  return (
    <div className={`modal fade${show ? " show" : ""}`} tabIndex={-1} role="dialog" style={{ display: show ? "block" : "none" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Insira seu orçamento total</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSave}>
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
  );
};

export default InitialBudgetModal;
