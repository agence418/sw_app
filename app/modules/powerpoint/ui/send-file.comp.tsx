import {Copy, ExternalLink, Laptop, Upload} from "lucide-react";
import React, {useState} from "react";
import {useSession} from "next-auth/react";

export const SendFileComp = () => {
    const {data: session} = useSession();
    const [presentationFile, setPresentationFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadUrl, setUploadUrl] = useState<string | null>(null);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

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
            // Vérifier l'extension du fichier
            if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx') || file.name.endsWith('.pdf')) {
                setPresentationFile(file);
            } else {
                alert('Veuillez sélectionner un fichier PowerPoint (.ppt, .pptx) ou PDF');
            }
        }
    };

    const handleGenerateLink = async () => {
        setIsGeneratingLink(true);
        try {
            const response = await fetch('/api/presentations/generate-token', {
                method: 'POST',
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || 'Erreur lors de la génération du lien');
                return;
            }

            const data = await response.json();
            setUploadUrl(data.uploadUrl);
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la génération du lien');
        } finally {
            setIsGeneratingLink(false);
        }
    };

    const handleCopyLink = () => {
        if (uploadUrl) {
            navigator.clipboard.writeText(uploadUrl);
            alert('Lien copié dans le presse-papier !');
        }
    };

    const handleUpload = async () => {
        if (!presentationFile) return;

        setIsUploading(true);
        setUploadSuccess(false);

        try {
            // Récupérer d'abord le token
            const tokenResponse = await fetch('/api/presentations/generate-token', {
                method: 'POST',
            });

            if (!tokenResponse.ok) {
                throw new Error('Erreur lors de la génération du token');
            }

            const {token} = await tokenResponse.json();

            // Envoyer le fichier
            const formData = new FormData();
            formData.append('file', presentationFile);

            const uploadResponse = await fetch('/api/presentations/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json();
                throw new Error(error.error || 'Erreur lors de l\'envoi');
            }

            setUploadSuccess(true);
            setPresentationFile(null);
            alert('Présentation envoyée avec succès !');
        } catch (error: any) {
            console.error('Erreur:', error);
            alert(error.message || 'Erreur lors de l\'envoi du fichier');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                        <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                    </div>
                    Envoi de présentation
                </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Envoyez votre présentation PowerPoint ou PDF avant la deadline. Formats acceptés : .ppt, .pptx, .pdf
            </p>

            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                } ${presentationFile ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    presentationFile
                        ? 'bg-green-100 dark:bg-green-900'
                        : isDragging
                        ? 'bg-blue-100 dark:bg-blue-900'
                        : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                    <Upload className={`w-8 h-8 ${
                        presentationFile
                            ? 'text-green-600 dark:text-green-400'
                            : isDragging
                            ? 'text-blue-500'
                            : 'text-gray-400'
                    }`}/>
                </div>
                <input
                    type="file"
                    accept=".ppt,.pptx,.pdf"
                    onChange={(e) => setPresentationFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="presentation-upload"
                />
                <label htmlFor="presentation-upload" className="cursor-pointer">
                    <div className={`font-semibold mb-2 ${
                        presentationFile
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-gray-700 dark:text-gray-300'
                    }`}>
                        {presentationFile ? (
                            <span className="flex items-center justify-center gap-2">
                                <span>✓</span>
                                <span>{presentationFile.name}</span>
                            </span>
                        ) : (
                            'Cliquez pour sélectionner votre présentation'
                        )}
                    </div>
                    {!presentationFile && (
                        <>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                                ou glissez-déposez votre fichier ici
                            </div>
                            <div className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                                Formats acceptés: .ppt, .pptx, .pdf (max 50 MB)
                            </div>
                        </>
                    )}
                </label>
            </div>

            {presentationFile && (
                <div className="space-y-3 mt-4">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Envoi en cours...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5"/>
                                <span>Envoyer la présentation</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setPresentationFile(null)}
                        className="w-full text-gray-600 dark:text-gray-400 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Changer de fichier
                    </button>
                </div>
            )}

            {uploadSuccess && (
                <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        ✓
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-green-800 dark:text-green-300">Présentation envoyée !</div>
                        <div className="text-sm text-green-700 dark:text-green-400">Votre fichier a été reçu avec succès.</div>
                    </div>
                </div>
            )}

            {/* Séparateur */}
            <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                <span className="px-4 text-gray-500 text-sm font-medium">ou</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            {/* Bouton pour obtenir le lien */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Envoyer depuis un ordinateur</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Générez un lien sécurisé pour envoyer votre présentation depuis un ordinateur. Validité : 6 heures.
                </p>

                {!uploadUrl ? (
                    <button
                        onClick={handleGenerateLink}
                        disabled={isGeneratingLink}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isGeneratingLink ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Génération...</span>
                            </>
                        ) : (
                            <>
                                <ExternalLink className="w-5 h-5"/>
                                <span>Générer le lien</span>
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-300 dark:border-gray-700">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                Lien d'envoi sécurisé
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={uploadUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors flex items-center gap-2 font-medium shadow-lg hover:shadow-xl">
                                    <Copy className="w-4 h-4"/>
                                    <span className="hidden sm:inline">Copier</span>
                                </button>
                            </div>
                        </div>
                        <a
                            href={uploadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <ExternalLink className="w-5 h-5"/>
                            Ouvrir le lien dans un nouvel onglet
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
