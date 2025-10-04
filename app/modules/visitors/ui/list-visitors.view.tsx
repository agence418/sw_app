'use client';

import React, {useEffect, useState} from 'react';
import {Edit2, QrCode, RefreshCw, Save, Trash2, UserPlus, X} from 'lucide-react';
import {useSession} from "next-auth/react";
import QRCode from 'qrcode';


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
    const [error, setError] = useState<string | null>(null);
    const [showRefreshQRCodeModal, setShowRefreshQRCodeModal] = useState(false)
    const [userOnModal, setUserOnModal] = useState(undefined);
    const [onModalQRCode, setonModalQRCode] = useState(undefined);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: ''
    });
    const {user} = useSession().data

    // Charger les visitors depuis l'API
    const loadVisitors = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/visitor');
            if (!response.ok) throw new Error('Erreur lors du chargement');
            const data = await response.json();
            setVisitors(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des visitors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVisitors();
    }, []);

    const handleShowResetPasswordQRCode = async (visitor: Visitor) => {
        try {
            setUserOnModal(visitor);
            setShowRefreshQRCodeModal(true);
            setonModalQRCode(undefined)


            const res = await fetch(`/api/auth/get-reset-password-link?email=${encodeURIComponent(visitor.email)}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de la génération du lien');
            }

            const resetLink = data.resetLink;

            const codeSrc = await QRCode.toDataURL(resetLink, {
                width: 256,
                margin: 0,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })

            setonModalQRCode(codeSrc)
        } catch (err) {
            alert('Erreur lors de la génération du QR code');
            // console.error(err)
        }
    }

    const handleAdd = async () => {
        if (!formData.name || !formData.email) return;

        try {
            const response = await fetch('/api/visitor', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
                })
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || 'Erreur lors de l\'ajout');
                return;
            }

            await loadVisitors();
            setFormData({name: '', email: '', phone: '', skills: ''});
            setShowAddForm(false);
        } catch (err) {
            alert('Erreur lors de l\'ajout du visitor');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce visitor ?')) return;

        try {
            const response = await fetch(`/api/visitor/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');
            await loadVisitors();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (visitor: Visitor) => {
        setEditingId(visitor.id);
        setFormData({
            name: visitor.name,
            email: visitor.email,
            phone: visitor.phone || '',
            skills: visitor.skills?.join(', ') || ''
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/visitor/${editingId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
                })
            });

            if (!response.ok) throw new Error('Erreur lors de la mise à jour');

            await loadVisitors();
            setEditingId(null);
            setFormData({name: '', email: '', phone: '', skills: ''});
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    return (
        <div className="w-full px-2 md:px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Gestion des Visitors</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={loadVisitors}
                            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/>
                            Rafraîchir
                        </button>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            <UserPlus className="w-4 h-4"/>
                            Ajouter
                        </button>
                    </div>
                </div>

                {showAddForm && (
                    <div className="p-4 bg-blue-50 border-b border-blue-200">
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Nom"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                                type="tel"
                                placeholder="Téléphone"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Compétences (séparées par des virgules)"
                                value={formData.skills}
                                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <button
                                onClick={handleAdd}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                <Save className="w-4 h-4"/>
                                Enregistrer
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setFormData({name: '', email: '', phone: '', skills: ''});
                                }}
                                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            >
                                <X className="w-4 h-4"/>
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600 text-sm">Chargement...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600 text-sm">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {visitors.map((visitor) => (
                                <div key={visitor.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    {editingId === visitor.id ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Nom"
                                            />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Email"
                                            />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Téléphone"
                                            />
                                            <input
                                                type="text"
                                                value={formData.skills}
                                                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Compétences"
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="flex items-center justify-center gap-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors flex-1 text-xs"
                                                >
                                                    <Save className="w-3 h-3"/>
                                                    Sauver
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setFormData({name: '', email: '', phone: '', skills: ''});
                                                    }}
                                                    className="flex items-center justify-center gap-1 bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors flex-1 text-xs"
                                                >
                                                    <X className="w-3 h-3"/>
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-800 text-sm truncate">{visitor.name}</h3>
                                                    <p className="text-gray-600 text-xs truncate">{visitor.email}</p>
                                                    {visitor.phone && (
                                                        <p className="text-gray-500 text-xs">{visitor.phone}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 ml-2">
                                                    {user.role === 'admin' && (
                                                        <button
                                                            onClick={() => handleShowResetPasswordQRCode(visitor)}
                                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                        >
                                                            <QrCode className="w-4 h-4"/>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(visitor)}
                                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                    >
                                                        <Edit2 className="w-4 h-4"/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(visitor.id)}
                                                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </div>
                                            {visitor.skills && visitor.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {visitor.skills.map((skill, idx) => (
                                                        <span key={idx}
                                                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
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
                    )
                    }
                </div>
            </div>
            {showRefreshQRCodeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-md max-h-[100vh] overflow-auto">
                        <h3 className="text-lg font-semibold mb-4">Réinitialisation du mot de passe</h3>
                        {userOnModal && (
                            <>
                                <p className="text-lg font-semibold mt-8 text-center w-full">{userOnModal.name}</p>
                                <p className="text-xs font-semibold mb-8 text-center text-gray-500 w-full">{userOnModal.email}</p>
                            </>
                        )}
                        <p className="text-sm text-gray-600 mb-4">Scannez ce QR code pour rediriger l'utilisateur vers
                            la page de réinitialisation du mot de passe.</p>
                        {onModalQRCode ? (
                            <div id={'qrcode'} className="flex justify-center my-12">
                                <img src={onModalQRCode} alt="QR Code"/>
                            </div>) : (
                            <div className="text-center py-8">
                                <div
                                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600 text-sm">Génération du QR code...</p>
                            </div>
                        )}
                        <button
                            onClick={() => setShowRefreshQRCodeModal(false)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
        ;
};