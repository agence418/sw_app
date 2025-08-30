'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { LoginView } from './login.view';
import {StartupWeekendAdminApp} from '../../../../app/AdminApp';
import {StartupWeekendCoachApp} from "../../../CoachApp";

export const withLogin = <P extends Record<string, any>>(
    Component: React.ComponentType<P>
) => {
    const LoginComponent = (props: P) => {
        const { data: session, status } = useSession();

        // Afficher un loader pendant la vérification
        if (status === 'loading') {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (status === 'unauthenticated' || !session) {
            return <LoginView />;
        }

        if (session?.user.role === 'admin') {
            return <StartupWeekendAdminApp />;
        }


        if (session?.user.role === 'coach') {
            return <StartupWeekendCoachApp />;
        }

        return <Component {...props} />;
    };

    LoginComponent.displayName = `withLogin(${Component.displayName || Component.name || 'Component'})`;

    return LoginComponent;
};