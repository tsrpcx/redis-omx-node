import { Redisjson } from "./redisjson";
import { RedisClientOptions } from 'redis';
import * as redis from 'redis';
import Client from "../client";
import { GroupItem, User } from "./User";

// declare global {
//     clientOM: Client;
// }


async function test() {
    let cli = redis.createClient();
    await cli.connect();

    global.clientOM = new Client();
    await global.clientOM.use(cli);

    let user = await User.create({
        id: 100010,
        name: 'zhangsan',
        age: 100,
        created: new Date(),
        group: {
            groupName: 'xiaoxueGroup',
            score: 100,
        }
    })


    user.group = {
        groupName: 'xiaoxueGroup',
        score: 1000,
    }

    await User.repository.save(user);

    console.log('user=', user.toJSON());

    let dbUser = await User.repository.search().where('id').eq(100010).returnFirst();

    console.log('dbUser=', dbUser.toJSON());
}

test();


