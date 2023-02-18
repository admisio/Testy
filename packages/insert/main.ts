// import { readXlsxFile } from 'read-excel-file/node';
import prisma from "./prisma";
import {Row} from "read-excel-file";
import readXlsxFile from "read-excel-file/node";
import bcrypt from "bcrypt";
import * as crypto from "crypto";

console.log('Hello world');

const getGroupNameByIndex = (index: number): string => {
    switch (index) {
        case 0:
            return 'none';
        case 1:
            return 'IT';
        case 2:
            return 'KB';
        case 3:
            return 'IT, KB';
        case 4:
            return 'G';
        case 5:
            return 'IT, G';
        case 6:
            return 'KB, G';
        case 7:
            return 'IT, KB, G';
        default:
            return 'none';
    }
}
const asyncMain = async () => {
    // const users = await prisma.user.findMany();
    // console.log(users);
    const readXlsxFile = require('read-excel-file/node');
    const rows = await readXlsxFile('users.xlsx');

    // each row has name, email and tests to write (IT, KB, G)
    // we need to split them based on the test combination and write them to the database
    // there will be 8 groups e.g.
    // IT, KB, G
    // IT, KB
    // IT, G
    // IT
    // KB, G
    // KB
    // G
    // none
    // each group will have a different test combination

    const groups: [string, Row[]][] = [];
    for (let i = 0; i < 8; i++) {
        groups.push(['', []]);
    }
    rows.forEach((row: Row) => {
        const tests: string[] = [row[2], row[3], row[4]].map((t) => t ? t.toString() : '');
        console.log(tests)

        let groupIndex = 0;
        if (tests[0] === 'IT') {
            groupIndex += 1;
        }
        if (tests[1] === 'KB') {
            groupIndex += 2;
        }
        if (tests[2] === 'G') {
            groupIndex += 4;
        }
        groups[groupIndex][0] = tests.join(', ');
        groups[groupIndex][1].push(row);
    });

    groups.forEach((group) => {
        console.log('------------------')
        console.log(group);
    });

    // if group is bigger than 15, split it into multiple groups
    const subgroups: [string, Row[]][] = [];
    groups.forEach((group) => {
        if (group[1].length > 15) {
            const numberOfSubgroups = Math.ceil(group.length / 15);
            console.log("should create " + numberOfSubgroups + " subgroups")
            for (let i = 0; i < numberOfSubgroups; i++) {
                console.log("creating subgroup " + i)
                subgroups.push([group[0], group[1].slice(i * 15, (i + 1) * 15)]);
            }
        } else {
            subgroups.push(group);
        }
    });
    console.log("subgroups created" + subgroups.length);

    subgroups.forEach((group) => {
        console.log('------------------')
        console.log(group);
    });
    console.log(subgroups.length);


    const adminCreds: [string, string, string][] = [];
    for (let i = 0; i < subgroups.length; i++) {
        const subgroup = subgroups[i];
        const [username, password] = [`admin${i + 1}`, 'NPMJeMrdka123'];
        adminCreds.push([username, password, `SKUPINA NANEČISTO ${i + 1} - ${subgroup[0] ?? ''}`]);
        const dbAdmin = await prisma.admin.create({
            data: {
                username,
                name: 'admin',
                surname: 'admin',
                email: `admin${i + 1}`,
                password: await bcrypt.hash(password, 12)
            }
        });
        const dbGroup = await prisma.group.create({
            data: {
                name: `SKUPINA NANEČISTO ${i + 1} - ${subgroup[0] ?? ''}`
            }
        });
        await prisma.adminsOnGroups.create({
            data: {
                adminId: dbAdmin.id,
                groupId: dbGroup.id
            }
        });
    }
    console.log('-----ADMIN CREDS-----')
    console.log(adminCreds);
    const creds: [string, string, string][] = [];
    const dbGroups = await prisma.group.findMany();
    for (const user of rows) {
        const [name, email, it, kb, g] = [user[0], user[1], user[2], user[3], user[4]].map((t) => t ? t.toString() : '');
        const [username, password] = [name.replace(" ", ""), crypto.randomBytes(4).toString('hex')];
        const dbUser = await prisma.user.create({
            data: {
                username,
                name,
                email,
                password: await bcrypt.hash(password, 10),
                group: {
                    connect: {
                        // id: dbGroups.find((group) => group.name === `SKUPINA NANEČISTO ${i + 1} - ${it ?? ''}, ${kb ?? ''}, ${g ?? ''}`).id
                        id: dbGroups.find((group) => group.name.includes(`- ${it}, ${kb}, ${g}`))?.id
                    }
                }
            },
            include: {
                group: true
            }
        });
        creds.push([username, password, `SKUPINA NANEČISTO ${dbUser.group!.name}`]);
    }
    console.log('-----USER CREDS-----')
    console.log(creds);

}

asyncMain().then(r => console.log("finished"));
// prisma.user.findMany().then((users) => {
//     console.log(users);
// });

