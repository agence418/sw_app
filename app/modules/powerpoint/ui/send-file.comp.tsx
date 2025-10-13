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
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-500"/>
                Envoi de présentation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Envoyez votre présentation PowerPoint ou PDF avant la deadline.
            </p>

            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}/>
                <input
                    type="file"
                    accept=".ppt,.pptx,.pdf"
                    onChange={(e) => setPresentationFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="presentation-upload"
                />
                <label htmlFor="presentation-upload" className="cursor-pointer">
                    <div className="text-gray-600 dark:text-gray-300 mb-2">
                        {presentationFile ? presentationFile.name : 'Cliquez pour sélectionner votre présentation'}
                    </div>
                    <div className="text-gray-400">
                        ou glissez-déposez votre fichier ici
                    </div>
                    <div className="text-gray-400 mt-1">
                        Formats acceptés: .ppt, .pptx, .pdf
                    </div>
                </label>
            </div>

            {presentationFile && (
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isUploading ? 'Envoi en cours...' : 'Envoyer la présentation'}
                </button>
            )}

            {/* Séparateur */}
            <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                <span className="px-4 text-gray-500">ou</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            {/* Bouton pour obtenir le lien */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                    <Laptop className="w-5 h-5 text-purple-600"/>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Envoyer depuis un ordinateur</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Générez un lien pour envoyer votre présentation depuis un ordinateur. Le lien est valide 6 heures.
                </p>

                {!uploadUrl ? (
                    <button
                        onClick={handleGenerateLink}
                        disabled={isGeneratingLink}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGeneratingLink ? 'Génération...' : 'Générer le lien'}
                    </button>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={uploadUrl}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                                <Copy className="w-4 h-4"/>
                            </button>
                        </div>
                        <a
                            href={uploadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            <ExternalLink className="w-4 h-4"/>
                            Ouvrir dans un nouvel onglet
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
