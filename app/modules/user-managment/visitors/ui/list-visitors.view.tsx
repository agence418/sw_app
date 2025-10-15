'use client';

import React, { useEffect, useState } from 'react';
import { Edit2, QrCode, RefreshCw, Save, Trash2, UserPlus, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ResetPasswordModal } from '@/app/modules/user-managment/_shared/ui/reset-password-modal.view';

interface Visitor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
}

export const ListVisitorsView = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [showRefreshQRCodeModal, setShowRefreshQRCodeModal] = useState(false);
  const [userOnModal, setUserOnModal] = useState<Visitor | undefined>(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
  });
  const session = useSession();
  const user = session.data?.user;

  // Charger les visitors depuis l'API
  const loadVisitors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/visitor');
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setVisitors(data);
      setError(null);
    } catch (_err) {
      setError('Erreur lors du chargement des visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleShowResetPasswordQRCode = async (visitor: Visitor) => {
    setUserOnModal(visitor);
    setShowRefreshQRCodeModal(true);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.email) return;

    try {
      const response = await fetch('/api/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          skills: formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s),
        }),
      });

      if (!response.ok) {
        const _error = await response.json();
        alert(_error._error || "Erreur lors de l'ajout");
        return;
      }

      await loadVisitors();
      setFormData({ name: '', email: '', phone: '', skills: '' });
      setShowAddForm(false);
    } catch (_err) {
      alert("Erreur lors de l'ajout du visitor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce visitor ?')) return;

    try {
      const response = await fetch(`/api/visitor/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await loadVisitors();
    } catch (_err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (visitor: Visitor) => {
    setEditingId(visitor.id);
    setFormData({
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone || '',
      skills: visitor.skills?.join(', ') || '',
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/visitor/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          skills: formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s),
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      await loadVisitors();
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', skills: '' });
    } catch (_err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="w-full px-2 md:px-4">
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Gestion des Visiteurs
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={loadVisitors}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Rafraîchir
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2  dark:bg-gray-9000 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-green-400">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm dark:text-gray-800"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm dark:text-gray-800"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm dark:text-gray-800"
              />
              <input
                type="text"
                placeholder="Compétences (séparées par des virgules)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm dark:text-gray-800"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', email: '', phone: '', skills: '' });
                }}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 text-sm">Chargement...</p>
            </div>
          ) : _error ? (
            <div className="text-center py-8 text-red-600 text-sm">{_error}</div>
          ) : (
            <div className="space-y-3">
              {visitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-900"
                >
                  {editingId === visitor.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:text-gray-800"
                        placeholder="Nom"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:text-gray-800"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:text-gray-800"
                        placeholder="Téléphone"
                      />
                      <input
                        type="text"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:text-gray-800"
                        placeholder="Compétences"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center justify-center gap-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-400 transition-colors flex-1 text-xs"
                        >
                          <Save className="w-3 h-3" />
                          Sauver
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '', email: '', phone: '', skills: '' });
                          }}
                          className="flex items-center justify-center gap-1 bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors flex-1 text-xs"
                        >
                          <X className="w-3 h-3" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
                            {visitor.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                            {visitor.email}
                          </p>
                          {visitor.phone && (
                            <p className="text-gray-500 text-xs">{visitor.phone}</p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleShowResetPasswordQRCode(visitor)}
                              className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-white rounded"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(visitor)}
                            className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-white rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(visitor.id)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-white rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {visitor.skills && visitor.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {visitor.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ResetPasswordModal
        show={showRefreshQRCodeModal}
        user={userOnModal}
        setShow={setShowRefreshQRCodeModal}
      />
    </div>
  );
};
