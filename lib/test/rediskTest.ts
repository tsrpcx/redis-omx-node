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

    await User.repository.createIndex();

    let user = await User.create({
        id: 100010,
        name: 'zhangsan',
        age: 100,
        created: new Date(),
        dbs:["redis","json","redisjson"],
        // group: {
        //     groupName: 'xiaoxueGroup',
        //     score: 100,
        // }
    })


    // user.group = {
    //     groupName: 'xiaoxueGroup',
    //     score: 1000,
    // }

    await User.repository.save(user);

    console.log('user=', user.toJSON());

    let dbUsers = await User.repository.search().where('id').eq(100010).returnAll();
    dbUsers.forEach(async (item) => {
        console.log('dbUser=', item.toJSON())
        item.age = Math.random()*1000000;
        await User.repository.save(item);
    })
    // console.log('dbUser=', dbUser.toJSON());
}

test();


