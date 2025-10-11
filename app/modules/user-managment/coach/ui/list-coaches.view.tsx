'use client';

import React, {useEffect, useState} from 'react';
import { UserPlus, Trash2, Edit2, Save, X, Award, QrCode } from 'lucide-react';
import {useSession} from "next-auth/react";
import {ResetPasswordModal} from "@/app/modules/user-managment/_shared/ui/reset-password-modal.view";

interface Coach {
    id: string;
    name: string;
    email: string;
    expertise: string;
}

export const ListCoachesView = () => {
    const [coaches, setCoaches] = useState<Coach[]>([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userOnModal, setUserOnModal] = useState<Coach | null>(null);
    const [showRefreshQRCodeModal, setShowRefreshQRCodeModal] = useState(false)
    const {user} = useSession().data

    const fetchCoaches = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/coaches');
            if (response.ok) {
                const data = await response.json();
                setCoaches(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des coachs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
    }, []);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        expertise: '',
    });

    const handleShowResetPasswordQRCode = async (coach: Coach) => {
        setUserOnModal(coach);
        setShowRefreshQRCodeModal(true);
    }

    const handleAdd = async () => {
        if (!formData.name || !formData.email || !formData.expertise) return;
        
        console.log('Attempting to create coach:', formData);
        
        try {
            const response = await fetch('/api/coaches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    expertise: formData.expertise,
                }),
            });
            
            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);
            
            if (response.ok) {
                console.log('Coach created successfully');
                await fetchCoaches();
                setFormData({ name: '', email: '', expertise: '' });
                setShowAddForm(false);
            } else {
                console.error('Failed to create coach:', responseData);
            }
        } catch (error) {
            console.error('Erreur lors de la création du coach:', error);
        }
    };

    const handleDelete = (id: string) => {
        setCoaches(coaches.filter(c => c.id !== id));
    };

    const handleEdit = (coach: Coach) => {
        setEditingId(coach.id);
        setFormData({
            name: coach.name,
            email: coach.email,
            expertise: coach.expertise,
        });
    };

    const handleSaveEdit = () => {
        setCoaches(coaches.map(c => 
            c.id === editingId 
                ? {
                    ...c,
                    name: formData.name,
                    email: formData.email,
                    expertise: formData.expertise,
                }
                : c
        ));
        setEditingId(null);
        setFormData({ name: '', email: '', expertise: '' });
    };

    const toggleAvailability = (day: string) => {
        setFormData(prev => ({
            ...prev
        }));
    };

    return (
        <div className="w-full px-2 md:px-4">
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-yellow-500" />
                        Gestion des Coachs
                    </h2>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Ajouter un coach
                    </button>
                </div>

                {showAddForm && (
                    <div className="p-4 ">
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Nom"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm dark:text-gray-800"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm dark:text-gray-800"
                            />
                            <input
                                type="text"
                                placeholder="Expertise"
                                value={formData.expertise}
                                onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm dark:text-gray-800"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <button
                                onClick={handleAdd}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white dark:text-gray-900 px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                <Save className="w-4 h-4" />
                                Enregistrer
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setFormData({ name: '', email: '', expertise: '' });
                                }}
                                className="flex items-center justify-center gap-2 bg-gray-600 text-white dark:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
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
                            <div className="text-gray-500">Chargement des coachs...</div>
                        </div>
                    ) : (
                    <div className="space-y-3">
                        {coaches.map((coach) => (
                            <div key={coach.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                                {editingId === coach.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:text-gray-800"
                                            placeholder="Nom"
                                        />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:text-gray-800"
                                            placeholder="Email"
                                        />
                                        <input
                                            type="text"
                                            value={formData.expertise}
                                            onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:text-gray-800"
                                            placeholder="Expertise"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="flex items-center justify-center gap-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors flex-1 text-xs"
                                            >
                                                <Save className="w-3 h-3" />
                                                Sauver
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setFormData({ name: '', email: '', expertise: '' });
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
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{coach.name}</h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">{coach.email}</p>
                                                <div className="mt-1">
                                                    <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-white px-2 py-1 rounded text-xs">
                                                        {coach.expertise}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 ml-2">

                                                {user.role === 'admin' && (
                                                    <button
                                                        onClick={() => handleShowResetPasswordQRCode(coach)}
                                                        className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-white rounded"
                                                    >
                                                        <QrCode className="w-4 h-4"/>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(coach)}
                                                    className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-white rounded"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coach.id)}
                                                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-white rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
            <ResetPasswordModal show={showRefreshQRCodeModal} user={userOnModal} setShow={setShowRefreshQRCodeModal}/>
        </div>
    );
};