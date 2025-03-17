/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 23/09/2024
 **/
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    api_v1_base_url: 'http://localhost:8080/api/v1',
    api_v2_base_url: 'http://localhost:8060/api/v2',
    baseUrl: 'http://localhost:8080',
    firebaseConfig: {
        apiKey: "sua-api-key",
        authDomain: "seu-auth-domain",
        projectId: "seu-project-id",
        storageBucket: "seu-storage-bucket",
        messagingSenderId: "seu-messaging-sender-id",
        appId: "seu-app-id"
    }
};
