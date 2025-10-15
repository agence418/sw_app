'use client';

import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface Tool {
    id: number;
    name: string;
    url: string;
}

export const ManageToolsView = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: '', url: '' });
    const [newTool, setNewTool] = useState({ name: '', url: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const loadTools = async () => {
        try {
            const response = await fetch('/api/tools');
            if (!response.ok) throw new Error('Erreur lors du chargement');
            const data = await response.json();
            setTools(data);
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du chargement des outils');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTools();
    }, []);

    const handleAdd = async () => {
        if (!newTool.name || !newTool.url) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch('/api/tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTool)
            });

            if (!response.ok) throw new Error('Erreur lors de l\'ajout');

            setNewTool({ name: '', url: '' });
            setShowAddForm(false);
            await loadTools();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de l\'outil');
        }
    };

    const handleEdit = (tool: Tool) => {
        setEditingId(tool.id);
        setEditForm({ name: tool.name, url: tool.url });
    };

    const handleSave = async (id: number) => {
        if (!editForm.name || !editForm.url) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch(`/api/tools/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) throw new Error('Erreur lors de la modification');

            setEditingId(null);
            await loadTools();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la modification de l\'outil');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet outil ?')) return;

        try {
            const response = await fetch(`/api/tools/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');

            await loadTools();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression de l\'outil');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({ name: '', url: '' });
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
                    <LinkIcon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    Gestion des outils
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </div>

            {showAddForm && (
                <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Nouvel outil</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nom de l'outil"
                            value={newTool.name}
                            onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="url"
                            placeholder="URL"
                            value={newTool.url}
                            onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Enregistrer
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewTool({ name: '', url: '' });
                                }}
                                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                    >
                        {editingId === tool.id ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                                <input
                                    type="url"
                                    value={editForm.url}
                                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSave(tool.id)}
                                        className="flex items-center gap-2 text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-400 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 text-white px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-400 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                                        {tool.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 break-all">
                                        {tool.url}
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(tool)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tool.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {tools.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Aucun outil enregistré
                </p>
            )}
        </div>
    );
};
