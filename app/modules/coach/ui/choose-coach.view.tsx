import {MessageSquare} from "lucide-react";
import React, {useState, useEffect} from "react";

interface Coach {
    id: number;
    name: string;
    email: string;
    expertise: string;
}

export const ChooseCoachView = () => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [coachPreferences, setCoachPreferences] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600"/>
                Préférences de coaching
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
                Sélectionnez les coaches que vous aimeriez rencontrer samedi.
            </p>

            {loading ? (
                <div className="text-center py-8">
                    <div className="text-gray-500">Chargement des coachs...</div>
                </div>
            ) : (
                <div className="space-y-3">
                    {coaches.map((coach) => (
                        <label key={coach.id}
                               className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 mr-3"
                                checked={coachPreferences.includes(coach.name)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setCoachPreferences(prev => [...prev, coach.name]);
                                    } else {
                                        setCoachPreferences(prev => prev.filter(c => c !== coach.name));
                                    }
                                }}
                            />
                            <div className="flex-1">
                                <div className="text-gray-800 font-medium">{coach.name}</div>
                                {coach.expertise && (
                                    <div className="text-sm text-gray-600">{coach.expertise}</div>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            )}

            <button
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Enregistrer mes préférences
            </button>
        </div>
    )
}