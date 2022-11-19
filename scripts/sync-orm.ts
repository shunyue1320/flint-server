import { orm } from "../src/thirdPartyService/TypeORMService";

orm()
    .then(async datasource => {
        await datasource.synchronize(true);
        await datasource.destroy();
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
