import { createAuthClient } from 'better-auth/react';

import {adminClient, organizationClient} from "better-auth/client/plugins";
import {backend_adress} from "@/src/constants/Backend";

export const authClient = createAuthClient({
    fetchOptions : {
      credentials :"include"
    },
    trustedOrigins: [
        "http://localhost:8081",
        "http://192.168.56.1:8081",
    ],
    disableOriginCheck: true,
    advanced: {
        cookiePrefix: "better-auth",
        crossSubDomainCookies: {
            enabled: false,
        }
    },
    baseURL: backend_adress,
   plugins : [
       adminClient(),
       organizationClient()
   ]
});