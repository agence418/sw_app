import {MessageSquare} from "lucide-react";
import React, {useState} from "react";

export const ChooseCoachView = () => {
    const [coachPreferences, setCoachPreferences] = useState<string[]>([]);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600"/>
                Préférences de coaching - Samedi
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
                Sélectionnez les coaches que vous aimeriez rencontrer samedi.
            </p>

            <div className="space-y-3">
                {[
                    'Marketing Digital',
                    'Développement Tech',
                    'Business Model',
                    'Design UX/UI',
                    'Financement',
                    'Stratégie',
                    'Juridique',
                ].map((coach, index) => (
                    <label key={index}
                           className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 mr-3"
                            checked={coachPreferences.includes(coach)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setCoachPreferences(prev => [...prev, coach]);
                                } else {
                                    setCoachPreferences(prev => prev.filter(c => c !== coach));
                                }
                            }}
                        />
                        <span className="text-gray-800">{coach}</span>
                    </label>
                ))}
            </div>

            <button
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Enregistrer mes préférences
            </button>
        </div>
    )
}