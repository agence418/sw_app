import {Users} from "lucide-react";
import React from "react";

export const TeamCreationView = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Enregistrement des projets
            </h2>
        </div>
    );
}