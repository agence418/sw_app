import {Plus, Users} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import {CreateIdeaDTO, Idea} from "../../ideas/types/idea.types";

interface Participant {
    id: string;
    name: string;
    email: string;
}

export const IdeaCreationView = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [formData, setFormData] = useState<CreateIdeaDTO>({
        name: "",
        description: "",
        participantId: "",
        participantName: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchParticipants();
        fetchIdeas();
    }, []);

    const availableParticipants = useMemo(() => {
        if (!participants.length || !ideas.length) return participants;

        const assignedParticipantIds = new Set(
            ideas.map(idea => String(idea.participantId)) // ✅ Conversion en string
        );

        return participants.filter(p => !assignedParticipantIds.has(String(p.id)));
    }, [participants, ideas]);

    const fetchParticipants = async () => {
        try {
            const response = await fetch('/api/participants');
            if (response.ok) {
                const data = await response.json();
                setParticipants(data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des participants:', error);
        }
    };

    const fetchIdeas = async () => {
        try {
            const response = await fetch('/api/ideas');
            if (response.ok) {
                const data = await response.json();
                setIdeas(data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error);
            setError('Erreur lors de la récupération des projets');
        }
    };
    console.log({participants})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");
        setError(null);

        try {
            const response = await fetch('/api/ideas', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Erreur lors de la création du projet');

            const newIdea = await response.json();
            newIdea.participantName = participants.find((participant) => participant.id.toString() === newIdea.participantId)?.name || "";

            setIdeas(prev => [newIdea, ...prev]);
            setFormData({
                name: "",
                description: "",
                participantId: "",
                participantName: ""
            });
            setSuccessMessage("Projet créé avec succès!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error('Erreur lors de la création du projet:', error);
            setError('Erreur lors de la création du projet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleParticipantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedParticipant = participants.find(p => p.id === selectedId);
        setFormData({
            ...formData,
            participantId: selectedId,
            participantName: selectedParticipant?.name || ""
        });
    };

    return (
        <>
            <div
                className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500"/>
                    Enregistrement des idées
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 text-red-600 dark:text-white rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div
                        className="mb-4 p-3 bg-green-50 dark:bg-green-900 text-green-600 dark:text-white rounded-lg text-sm">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nom
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-green-600 focus:border-transparent dark:text-gray-800"
                            placeholder="Ex: Application de covoiturage"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Porteur de projet
                        </label>
                        <select
                            value={formData.participantId}
                            onChange={handleParticipantChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-green-600 focus:border-transparent dark:text-gray-800"
                            required
                        >
                            <option value="">Sélectionner un participant</option>
                            {availableParticipants.map((participant) => (
                                <option key={participant.id} value={participant.id}>
                                    {participant.name} ({participant.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <input
                            type={'text'}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-green-600 focus:border-transparent dark:text-gray-800"
                            placeholder="Décrivez le projet en quelques lignes..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            "Création en cours..."
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2"/>
                                Ajouter le projet
                            </>
                        )}
                    </button>
                </form>

                {ideas.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-md font-semibold mb-3">Idées ({ideas.length})</h3>
                        <div className="space-y-2">
                            {ideas.map((idea) => (
                                <div key={idea.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{idea.name}</div>
                                    <div
                                        className="text-sm text-gray-600 dark:text-gray-400">{idea.description ?? 'Tu pe'}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Par: {idea.participantName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}