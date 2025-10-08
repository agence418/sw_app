'use client';

import React from 'react';
import {useSession} from 'next-auth/react';
import {LoginView} from './login.view';
import {StartupWeekendAdminApp} from '../../../AdminApp';
import {StartupWeekendCoachApp} from '../../../CoachApp';
import {logoutAction} from "../_actions/logout.action";
import {LogOutIcon} from "lucide-react";
import {VisitorApp} from "../../../VisitorApp";
import {withConfig} from "@/app/modules/config/ui/with-config.hoc";

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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (status === 'unauthenticated' || !session) {
            return <LoginView />;
        }

        if (session?.user.role === 'admin') {
            return <>
                {session && (
                    <button
                        onClick={handleLogout}
                        className="absolute top-2 right-2 z-50 text-white bg-transparent p-2 rounded-full transition-colors text-sm"
                    >
                        <LogOutIcon size={18}/>
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
                        className="absolute top-4 right-4 z-50 text-white bg-transparent px-2 py-[5px] rounded-full transition-colors text-sm"
                    >
                        <LogOutIcon size={18}/>
                    </button>
                )}
                <StartupWeekendCoachApp/>
            </>;
        }

        if (session?.user.role === 'visitor') {
            return <>
                {session && (
                    <button
                        onClick={handleLogout}
                        className="absolute top-4 right-4 z-50 text-white bg-transparent px-2 py-[5px] rounded-full transition-colors text-sm"
                    >
                        <LogOutIcon size={18}/>
                    </button>
                )}
                <VisitorApp/>
            </>;
        }

        return <>
            {session && (
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-4 z-50 text-white bg-transparent px-2 py-[5px] rounded-full transition-colors text-sm"
                >
                    <LogOutIcon size={18}/>
                </button>
            )}
            <Component {...props} />
        </>;
    };

    LoginComponent.displayName = `withLogin(${Component.displayName || Component.name || 'Component'})`;

    return LoginComponent;
};