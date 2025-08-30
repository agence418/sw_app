import {Users, Plus, Trash2, Check, ArrowRight} from "lucide-react";
import React, {useState, useEffect} from "react";
import {ProjectsProvider, useProjects} from "../../projects/contexts/projects.context";
import { CreateProjectDTO } from "../../projects/types/project.types";

interface Participant {
    id: string;
    name: string;
    email: string;
}

export const TeamCreationView = () => {
    return(
        <ProjectsProvider>
            <TeamCreation />
        </ProjectsProvider>
    )
}

const TeamCreation = () => {
    const { projects, addProject, loading, error } = useProjects();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [formData, setFormData] = useState<CreateProjectDTO>({
        name: "",
        description: "",
        participantId: "",
        participantName: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchParticipants();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            await addProject(formData);
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

            <button
                type="submit"
                disabled={isSubmitting}
                className="mb-4 w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isSubmitting ? (
                    "Création en cours..."
                ) : (
                    <>
                        Valider les projets
                        <ArrowRight className="w-4 h-4 ml-4" />
                    </>
                )}
            </button>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Enregistrement des projets
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du projet
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Application de covoiturage"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <input
                        type={'text'}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Décrivez le projet en quelques lignes..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Participant responsable
                    </label>
                    <select
                        value={formData.participantId}
                        onChange={handleParticipantChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Sélectionner un participant</option>
                        {participants.map((participant) => (
                            <option key={participant.id} value={participant.id}>
                                {participant.name} ({participant.email})
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isSubmitting ? (
                        "Création en cours..."
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer le projet
                        </>
                    )}
                </button>
            </form>

            {projects.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-md font-semibold mb-3">Projets créés ({projects.length})</h3>
                    <div className="space-y-2">
                        {projects.map((project) => (
                            <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-gray-900">{project.name}</div>
                                <div className="text-sm text-gray-600">{project.description}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Par: {project.participantName}
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