import {Link} from "lucide-react";
import React from "react";

const LIENS_PRATIQUES = [
    {title: 'Site officiel Startup Weekend', url: 'https://startupweekend.org'},
    {title: 'Slack de l\'événement', url: '#'},
    {title: 'Drive partagé', url: '#'},
    {title: 'Modèle de Business Canvas', url: '#'},
    {title: 'Template pitch deck', url: '#'}
];

export const ToolsView = () => {
    return (
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Link className="w-5 h-5 mr-2 text-blue-500"/>
                Outils pratiques
            </h2>

            <div className="space-y-3">
                {LIENS_PRATIQUES.map((lien, index) => (
                    <a
                        key={index}
                        href={lien.url}
                        className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:bg-gray-900 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-gray-800 font-medium">{lien.title}</span>
                            <Link className="w-4 h-4 text-gray-400"/>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}