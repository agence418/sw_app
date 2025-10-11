import {Upload} from "lucide-react";
import React, {useState} from "react";

export const SendFileComp = () => {
    const [presentationFile, setPresentationFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

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
            if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx'), file.name.endsWith('pdf')) {
                setPresentationFile(file);
            } else {
                alert('Veuillez sélectionner un fichier PowerPoint (.ppt ou .pptx)');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-500"/>
                Envoi de présentation
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
                Envoyez votre présentation PowerPoint avant la deadline.
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
                    <div className="text-sm text-gray-400">
                        ou glissez-déposez votre fichier ici
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        Formats acceptés: .ppt, .pptx, .pdf
                    </div>
                </label>
            </div>

            {presentationFile && (
                <button
                    className="w-full mt-4 bg-green-600 text-white dark:text-gray-900 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Envoyer la présentation
                </button>
            )}
        </div>
    )
}