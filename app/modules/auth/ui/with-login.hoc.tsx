'use client';

import React from 'react';
import {useSession} from 'next-auth/react';
import {LoginView} from './login.view';
import {StartupWeekendAdminApp} from '../../../AdminApp';
import {StartupWeekendCoachApp} from '../../../CoachApp';
import {logoutAction} from "../_actions/logout.action";

export const withLogin = <P extends Record<string, any>>(
    Component: React.ComponentType<P>
) => {
    const LoginComponent = (props: P) => {
        const {data: session, status} = useSession();

        const handleLogout = () => {
            logoutAction();
        };

        if (status === 'loading') {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (status === 'unauthenticated' || !session) {
            return <LoginView/>;
        }

        if (session?.user.role === 'admin') {
            return <>
                {session && (
                    <button
                        onClick={handleLogout}
                        className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition-colors text-sm"
                    >
                        Déconnexion
                    </button>
                )}
                <StartupWeekendAdminApp/>
            </>;
        }

        if (session?.user.role === 'coach') {
            return <>
                {session && (
                    <button
                        onClick={handleLogout}
                        className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition-colors text-sm"
                    >
                        Déconnexion
                    </button>
                )}
                <StartupWeekendCoachApp/>
            </>;
        }

        return <>
            <Component {...props} />
        </>;
    };

    LoginComponent.displayName = `withLogin(${Component.displayName || Component.name || 'Component'})`;

    return LoginComponent;
};