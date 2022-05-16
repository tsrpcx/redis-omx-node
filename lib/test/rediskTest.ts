import * as redis from 'redis';
import Client from "../client";
import { GroupItem, User } from "./User";

async function test() {
    let cli = redis.createClient();
    await cli.connect();

    global.clientOM = new Client();
    await global.clientOM.use(cli);

    await User.repository.createIndex();

    let user = await User.create({
        id: 100012,
        name: 'zhangsan',
        age: 100,
        created: new Date(),
        dbs: ["redis", "json", "redisjson"],
        group: {
            name: 'g11',
            score: 100,
        }
    })

    // user.group = {
    //     groupName: 'xiaoxueGroup',
    //     score: 'aa' as any,
    // }

    await User.repository.save(user);

    console.log('user=', user.toJSON());


    // return;

    let dbUsers = await User.repository.search().where('group\\.name').eq('g11').returnAll();
    // let dbUsers = await User.repository.search().where('group.groupName').eq('xiaoxueGroup').returnAll();
    // finds all the Mushroomhead albums with the word 'beautiful' in the title from 1990 and beyond

    // text=>()  string=>{}
    // const query = "@group\\.name:{g11}"
    // let dbUsers = await User.repository.searchRaw(query).returnAll();


    dbUsers.forEach(async (item) => {
        console.log('dbUser=', item.toJSON())
        item.age = Math.random() * 1000000;
        await User.repository.save(item);
    })
    console.log('dbUser=', dbUsers);
}

test();


