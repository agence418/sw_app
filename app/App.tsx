'use client';

import {withLogin} from "./modules/auth/ui/with-login.hoc";
import {SessionProvider} from "./modules/auth/providers/session.provider";
import {ParticipantApp} from "@/app/ParticipantApp";
import {withConfig} from "@/app/modules/config/ui/with-config.hoc";

const ProtectedApp = withConfig(withLogin(ParticipantApp));

const Wrapper = () => {
    return (
        <SessionProvider>
            <ProtectedApp />
        </SessionProvider>
    )
}

export default Wrapper;