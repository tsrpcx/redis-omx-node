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
        group: new GroupItem('zs', 89)
    })

    console.log('user=', user.toJSON());
}

test();


