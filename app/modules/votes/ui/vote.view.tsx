import {Users} from "lucide-react";
import React, {useState} from "react";

export const VoteView = () => {
    const [votes, setVotes] = useState<{[key: string]: string}>({});

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Maintenant<br />
                Votes des idées
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
                Votez pour vos 3 idées préférées. Vous avez 3 votes à répartir.
            </p>

            <div className="space-y-3">
                {['Idée 1: Application de covoiturage écologique', 'Idée 2: Plateforme de formations en ligne', 'Idée 3: Marketplace pour produits locaux', 'Idée 4: App de gestion de budget personnel', 'Idée 5: Réseau social pour entrepreneurs'].map((idea, index) => (
                    <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 mr-3"
                            checked={votes[`idea-${index}`] === 'yes'}
                            onChange={(e) => {
                                setVotes(prev => ({
                                    ...prev,
                                    [`idea-${index}`]: e.target.checked ? 'yes' : ''
                                }));
                            }}
                        />
                        <span className="text-gray-800">{idea}</span>
                    </label>
                ))}
            </div>

            <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Confirmer mes votes ({Object.values(votes).filter(v => v === 'yes').length}/3)
            </button>
        </div>
    )
}