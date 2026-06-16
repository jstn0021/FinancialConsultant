"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE = "/api/creditors";
const PAGE_SIZE = 20;

const EMPTY_FORM = {
  code: "",
  creditorsName: "",
  address1: "",
  address2: "",
  city: "",
  country: "PH",
  tin1: "",
  tin2: "",
  tin3: "",
};

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-icon" onClick={onClose}>
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CreditorForm({
  initial = EMPTY_FORM,
  isEdit = false,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState(initial);
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="creditor-form">
      <div className="form-row">
        <div className="form-group">
          <label>Code *</label>
          <input
            value={form.code}
            onChange={set("code")}
            required
            placeholder="e.g. 1005"
            disabled={isEdit}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Creditor Name *</label>
        <input
          value={form.creditorsName}
          onChange={set("creditorsName")}
          required
          placeholder="Full name or company"
        />
      </div>

      <div className="form-group">
        <label>Address Line 1</label>
        <input
          value={form.address1}
          onChange={set("address1")}
          placeholder="Street address"
        />
      </div>

      <div className="form-group">
        <label>Address Line 2</label>
        <input
          value={form.address2}
          onChange={set("address2")}
          placeholder="Barangay, subdivision, etc."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input
            value={form.city}
            onChange={set("city")}
            placeholder="e.g. Makati"
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <select value={form.country} onChange={set("country")}>
            <option value="PH">Philippines (PH)</option>
            <option value="JP">Japan (JP)</option>
            <option value="NL">Netherlands (NL)</option>
            <option value="US">United States (US)</option>
            <option value="">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="tin-section-label">TIN</label>
        <div className="tin-row">
          <div className="form-group">
            <label>TIN 1</label>
            <input
              value={form.tin1}
              onChange={set("tin1")}
              placeholder="000-000-000"
            />
          </div>
          <div className="form-group">
            <label>TIN 2</label>
            <input
              value={form.tin2}
              onChange={set("tin2")}
              placeholder="000-000-000"
            />
          </div>
          <div className="form-group">
            <label>TIN 3</label>
            <input
              value={form.tin3}
              onChange={set("tin3")}
              placeholder="000-000-000"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Creditor"}
        </button>
      </div>
    </form>
  );
}

export default function CreditorsPage() {
  const [creditors, setCreditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCreditors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}?search=${encodeURIComponent(search)}&page=${page}&limit=${PAGE_SIZE}`,
      );
      const data = await res.json();
      setCreditors(data.rows ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data.total ?? 0);
    } catch {
      showToast("Failed to load creditors.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchCreditors();
  }, [fetchCreditors]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleAdd = async (form) => {
    setFormLoading(true);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      showToast("Creditor added.");
      setModal(null);
      fetchCreditors();
    } catch (err) {
      showToast(err.message || "Failed to add creditor.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (form) => {
    setFormLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${form.code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      showToast("Creditor updated.");
      setModal(null);
      fetchCreditors();
    } catch (err) {
      showToast(err.message || "Failed to update creditor.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    const { creditor } = modal;
    setFormLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${creditor.code}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("Creditor deleted.");
      setModal(null);
      fetchCreditors();
    } catch {
      showToast("Failed to delete creditor.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #f9fafb; }

        .page { padding: 32px 24px; max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.875rem; color: #6b7280; margin-top: 2px; }

        .toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .search-input { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.875rem; width: 260px; outline: none; transition: border-color 0.15s; background: #fff; }
        .search-input:focus { border-color: #3b82f6; }

        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 0.875rem; font-weight: 500; border: none; cursor: pointer; transition: background 0.15s; }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
        .btn-secondary { background: #f3f4f6; color: #374151; }
        .btn-secondary:hover:not(:disabled) { background: #e5e7eb; }
        .btn-danger { background: #dc2626; color: #fff; }
        .btn-danger:hover:not(:disabled) { background: #b91c1c; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-icon { background: none; border: none; cursor: pointer; font-size: 1rem; color: #6b7280; padding: 4px 8px; border-radius: 4px; }
        .btn-icon:hover { background: #f3f4f6; }

        .table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        thead { background: #f9fafb; }
        th { text-align: left; padding: 12px 16px; color: #374151; font-weight: 600; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #e5e7eb; }
        td { padding: 12px 16px; color: #111827; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f9fafb; }

        .code-badge { display: inline-block; background: #eff6ff; color: #2563eb; font-weight: 600; padding: 2px 8px; border-radius: 6px; font-size: 0.8125rem; font-family: monospace; }
        .tin-text { color: #6b7280; font-size: 0.8125rem; font-family: monospace; }
        .country-badge { display: inline-block; background: #f0fdf4; color: #16a34a; padding: 1px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }
        .addr-text { color: #6b7280; font-size: 0.8125rem; }

        .row-actions { display: flex; gap: 4px; }
        .action-btn { background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 6px; font-size: 0.8125rem; font-weight: 500; }
        .action-edit { color: #2563eb; }
        .action-edit:hover { background: #eff6ff; }
        .action-delete { color: #dc2626; }
        .action-delete:hover { background: #fef2f2; }

        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280; }
        .pag-btns { display: flex; gap: 4px; }
        .pag-btn { padding: 4px 10px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; font-size: 0.8125rem; }
        .pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pag-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }

        .empty-state { text-align: center; padding: 48px 16px; }
        .empty-state p { font-size: 1rem; font-weight: 500; color: #374151; margin-bottom: 4px; }
        .empty-state span { font-size: 0.875rem; color: #9ca3af; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px; }
        .modal-box { background: #fff; border-radius: 16px; width: 100%; max-width: 560px; padding: 28px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h2 { font-size: 1.125rem; font-weight: 700; color: #111827; }

        .creditor-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .tin-section-label { font-size: 0.8125rem; font-weight: 600; color: #374151; display: block; margin-bottom: 6px; }
        .tin-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .form-group label { font-size: 0.8125rem; font-weight: 600; color: #374151; }
        .form-group input, .form-group select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .form-group input:focus, .form-group select:focus { border-color: #3b82f6; }
        .form-group input:disabled { background: #f9fafb; color: #9ca3af; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 8px; }

        .delete-body { padding: 4px 0 20px; color: #374151; font-size: 0.9375rem; line-height: 1.6; }
        .delete-body strong { color: #111827; }

        .toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; z-index: 100; animation: slide-up 0.2s ease; }
        .toast-success { background: #052e16; color: #bbf7d0; }
        .toast-error { background: #450a0a; color: #fecaca; }
        @keyframes slide-up { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr; }
          .tin-row { grid-template-columns: 1fr; }
          .search-input { width: 100%; }
          th:nth-child(3), td:nth-child(3),
          th:nth-child(5), td:nth-child(5) { display: none; }
        }
      `}</style>

      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-title">Creditors Masterlist</div>
            <div className="page-subtitle">
              {total} creditor{total !== 1 ? "s" : ""} total
            </div>
          </div>
          <div className="toolbar">
            <input
              className="search-input"
              placeholder="Search name, code, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => setModal("add")}>
              + Add Creditor
            </button>
          </div>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
                <th>TIN</th>
                <th>Country</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: 48,
                      color: "#9ca3af",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : creditors.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <p>No creditors found</p>
                      <span>Try a different search or add a new creditor.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                creditors.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <span className="code-badge">{c.code}</span>
                    </td>
                    <td>
                      {c.creditorsName || (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td>
                      <div>{c.address1}</div>
                      {c.address2 && (
                        <div className="addr-text">{c.address2}</div>
                      )}
                    </td>
                    <td>{c.city || "-"}</td>
                    <td>
                      <div className="tin-text">{c.tin1 || "-"}</div>
                      {c.tin2 && <div className="tin-text">{c.tin2}</div>}
                      {c.tin3 && <div className="tin-text">{c.tin3}</div>}
                    </td>
                    <td>
                      {c.country && (
                        <span className="country-badge">{c.country}</span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="action-btn action-edit"
                          onClick={() =>
                            setModal({ type: "edit", creditor: c })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn action-delete"
                          onClick={() =>
                            setModal({ type: "delete", creditor: c })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="pag-btns">
                <button
                  className="pag-btn"
                  disabled={page <= 1}
                  onClick={() => setPage(1)}
                >
                  &laquo;
                </button>
                <button
                  className="pag-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  &lsaquo;
                </button>
                <button className="pag-btn active">{page}</button>
                <button
                  className="pag-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  &rsaquo;
                </button>
                <button
                  className="pag-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modal === "add" && (
        <Modal title="Add Creditor" onClose={() => setModal(null)}>
          <CreditorForm
            onSubmit={handleAdd}
            onCancel={() => setModal(null)}
            loading={formLoading}
          />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Edit Creditor" onClose={() => setModal(null)}>
          <CreditorForm
            initial={modal.creditor}
            isEdit
            onSubmit={handleEdit}
            onCancel={() => setModal(null)}
            loading={formLoading}
          />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Delete Creditor" onClose={() => setModal(null)}>
          <div className="delete-body">
            Are you sure you want to delete{" "}
            <strong>
              {modal.creditor.creditorsName ||
                `Creditor #${modal.creditor.code}`}
            </strong>
            ? This action cannot be undone.
          </div>
          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setModal(null)}
              disabled={formLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </Modal>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
