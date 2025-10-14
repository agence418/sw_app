'use client';

import React, {useEffect, useState} from 'react';
import {CheckCircle, Upload, X} from 'lucide-react';
import jwt from 'jsonwebtoken';
import {useParams} from 'next/navigation';
import '../../global.css';

interface TokenPayload {
    teamId: number;
    teamName: string;
    participantId: number;
    type: string;
}

export default function UploadPage() {
    const params = useParams();
    const token = params.token as string;

    const [teamInfo, setTeamInfo] = useState<{teamName: string} | null>(null);
    const [isValidToken, setIsValidToken] = useState(false);
    const [presentationFile, setPresentationFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Vérifier le token côté client (juste pour afficher le nom de l'équipe)
        try {
            const decoded = jwt.decode(token) as TokenPayload;
            if (decoded && decoded.teamName) {
                setTeamInfo({teamName: decoded.teamName});
                setIsValidToken(true);
            } else {
                setError('Token invalide');
            }
        } catch (err) {
            setError('Token invalide');
        }
    }, [token]);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx') || file.name.endsWith('.pdf')) {
                setPresentationFile(file);
                setError(null);
            } else {
                setError('Veuillez sélectionner un fichier PowerPoint (.ppt, .pptx) ou PDF');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPresentationFile(file);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!presentationFile) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', presentationFile);

            const response = await fetch('/api/presentations/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'envoi');
            }

            setUploadSuccess(true);
            setPresentationFile(null);
        } catch (err: any) {
            console.error('Erreur:', err);
            setError(err.message || 'Erreur lors de l\'envoi du fichier');
        } finally {
            setIsUploading(false);
        }
    };

    if (error && !isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
                    <X className="w-16 h-16 mx-auto text-red-500 mb-4"/>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Lien invalide ou expiré
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ce lien n'est plus valide ou a expiré. Veuillez générer un nouveau lien depuis votre application mobile.
                    </p>
                </div>
            </div>
        );
    }

    if (uploadSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4"/>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Présentation envoyée !
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Votre présentation a été envoyée avec succès pour l'équipe <strong>{teamInfo?.teamName}</strong>.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Vous pouvez fermer cette fenêtre.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="text-center mb-8">
                    <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4"/>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Envoi de présentation
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Équipe: <strong className="text-blue-600 dark:text-blue-400">{teamInfo?.teamName}</strong>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Ce lien est valide pendant 6 heures
                    </p>
                </div>

                <div
                    className={`border-4 border-dashed rounded-xl p-12 text-center transition-all ${
                        isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                            : 'border-gray-300 dark:border-gray-700'
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <Upload className={`w-20 h-20 mx-auto mb-6 ${isDragging ? 'text-blue-500 animate-bounce' : 'text-gray-400'}`}/>
                    <input
                        type="file"
                        accept=".ppt,.pptx,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="presentation-upload"
                    />
                    <label htmlFor="presentation-upload" className="cursor-pointer">
                        {presentationFile ? (
                            <div>
                                <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    {presentationFile.name}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">
                                    {(presentationFile.size / 1024 / 1024).toFixed(2)} Mo
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Cliquez pour sélectionner votre présentation
                                </div>
                                <div className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                                    ou glissez-déposez votre fichier ici
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-500">
                                    Formats acceptés: .ppt, .pptx, .pdf
                                </div>
                            </div>
                        )}
                    </label>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
                    </div>
                )}

                {presentationFile && (
                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUploading ? 'Envoi en cours...' : 'Envoyer la présentation'}
                        </button>
                        <button
                            onClick={() => setPresentationFile(null)}
                            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Annuler
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
