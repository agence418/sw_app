'use client';

import {Link} from "lucide-react";
import React, {useEffect, useState} from "react";

interface Tool {
    id: number;
    name: string;
    url: string;
}

export const ToolsView = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTools = async () => {
            try {
                const response = await fetch('/api/tools');
                if (!response.ok) throw new Error('Erreur lors du chargement');
                const data = await response.json();
                setTools(data);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTools();
    }, []);

    return (
        <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Link className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400"/>
                Outils pratiques
            </h2>

            {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
            ) : (
                <div className="space-y-3">
                    {tools.map((lien) => (
                        <a
                            key={lien.id}
                            href={lien.url}
                            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-800 dark:text-gray-200 font-medium">{lien.name}</span>
                                <Link className="w-4 h-4 text-gray-400 dark:text-gray-500"/>
                            </div>
                        </a>
                    ))}
                    {tools.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            Aucun outil disponible
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}