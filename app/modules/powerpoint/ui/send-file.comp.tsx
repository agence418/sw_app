import {Upload} from "lucide-react";
import React, {useState} from "react";

export const SendFileComp = () => {
    const [presentationFile, setPresentationFile] = useState<File | null>(null);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600"/>
                Envoi de présentation
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
                Envoyez votre présentation PowerPoint avant la deadline du jeudi soir.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4"/>
                <input
                    type="file"
                    accept=".ppt,.pptx"
                    onChange={(e) => setPresentationFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="presentation-upload"
                />
                <label htmlFor="presentation-upload" className="cursor-pointer">
                    <div className="text-gray-600 mb-2">
                        {presentationFile ? presentationFile.name : 'Cliquez pour sélectionner votre présentation'}
                    </div>
                    <div className="text-sm text-gray-400">
                        Formats acceptés: .ppt, .pptx
                    </div>
                </label>
            </div>

            {presentationFile && (
                <button
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Envoyer la présentation
                </button>
            )}
        </div>
    )
}