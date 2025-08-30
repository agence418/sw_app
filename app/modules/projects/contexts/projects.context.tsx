"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, CreateProjectDTO } from '../types/project.types';

interface ProjectsContextType {
    projects: Project[];
    loading: boolean;
    error: string | null;
    addProject: (project: CreateProjectDTO) => Promise<void>;
    fetchProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Erreur lors de la récupération des projets');
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const addProject = async (projectData: CreateProjectDTO) => {
        setError(null);
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });
            if (!response.ok) throw new Error('Erreur lors de la création du projet');
            const newProject = await response.json();
            setProjects(prev => [...prev, newProject]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            throw err;
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <ProjectsContext.Provider value={{ projects, loading, error, addProject, fetchProjects }}>
            {children}
        </ProjectsContext.Provider>
    );
};

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
};