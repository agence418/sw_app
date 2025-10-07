'use client';

import {withLogin} from "./modules/auth/ui/with-login.hoc";
import {SessionProvider} from "./modules/auth/providers/session.provider";
import {ParticipantApp} from "@/app/ParticipantApp";
import {withConfig} from "@/app/modules/config/ui/with-config.hoc";
import {useEffect} from "react";
import {fetchEvent} from "@/app/modules/calendar/_actions/fetch-event.action";

const ProtectedApp = withConfig(withLogin(ParticipantApp));

const Wrapper = () => {
    useEffect(() => {
        fetchEvent()

        const i = setInterval(() => {
            fetchEvent()
        }, 60000)

        return () => clearInterval(i);
    }, []);

    return (
        <SessionProvider>
            <ProtectedApp/>
        </SessionProvider>
    )
}

export default Wrapper;