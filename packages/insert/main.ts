// import { readXlsxFile } from 'read-excel-file/node';
import prisma from "./prisma";
import {Row} from "read-excel-file";
import readXlsxFile from "read-excel-file/node";
import bcrypt from "bcrypt";
import * as crypto from "crypto";

const getGroups = (rows: Row[]): [string, Row[]][] => {
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
        groups[groupIndex][0] = tests.filter((s) => s !== '').join(', ');
        groups[groupIndex][1].push(row);
    });

    groups.forEach((group) => {
        console.log('------------------ ' + group[1].length)
        console.log(group);
    });
    return groups;
}

const splitGroups = (groups: [string, Row[]][]): [string, Row[]][] => {
    const subgroups: [string, Row[]][] = [];

    groups.forEach((group) => {
        const groupSize = group[1].length;
        if (groupSize > 15) {
            const numberOfSubgroups = Math.ceil(groupSize / 15);
            for (let i = 0; i < numberOfSubgroups; i++) {
                subgroups.push([group[0], group[1].slice(i * 15, (i + 1) * 15)]);
            }
        } else {
            subgroups.push(group);
        }
    });

    subgroups.forEach((group) => {
        console.log('------------------')
        console.log(group);
    });
    console.log(subgroups.length);
    return subgroups;
}
const asyncMain = async () => {
    const readXlsxFile = require('read-excel-file/node');
    const rows = await readXlsxFile('users-nedele.xlsx');

    const groups: [string, Row[]][] = getGroups(rows);
    const subgroups: [string, Row[]][] = splitGroups(groups);

    const adminCreds: [string, string, string][] = [];
    const creds: [string, string, string][] = [];
    const dbGroups = [];
    const superadmin = await prisma.admin.create({
        data: {
            username: 'adminnedele',
            name: 'superadmin',
            surname: 'superadmin',
            email: 'superadmin',
            password: await bcrypt.hash('CSSDSobotka', 12)
        }
    });
    adminCreds.push(['adminnedele', 'CSSDSobotka', 'CELA NEDELE']);
    for (let i = 0; i < subgroups.length; i++) {
        const subgroup = subgroups[i];
        const [username, password] = [`admin${i + 1}`, 'sveltekitlove'];
        const groupName = `SKUPINA NANEČISTO! neděle ${i + 1} - ${subgroup[0] ?? ''}`;
        adminCreds.push([username, password, groupName]);
        const dbAdmin = await prisma.admin.create({
            data: {
                username: username,
                name: 'admin',
                surname: 'admin',
                email: `admin${i + 1}`,
                password: await bcrypt.hash(password, 12)
            }
        });
        const dbGroup = await prisma.group.create({
            data: {
                name: groupName,
            }
        });
        dbGroups.push(dbGroup);
        await prisma.adminsOnGroups.createMany({
            data: [{
                adminId: dbAdmin.id,
                groupId: dbGroup.id
            },
                {
                    adminId: superadmin.id,
                    groupId: dbGroup.id
                }]
        });

        const groupRows = subgroup[1];
        for (const user of groupRows) {
            const [name, email, it, kb, g] = [user[0], user[1], user[2], user[3], user[4]].map((t) => t ? t.toString() : '');
            const [username, password] = [name.replace(/\s/g, ''), crypto.randomBytes(4).toString('hex')];
            console.log(username, password)
            const dbUser = await prisma.user.create({
                data: {
                    username: username,
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    group: {
                        connect: {
                            id: dbGroup.id
                        }
                    }
                }
            });
            creds.push([username, password, `SKUPINA NANEČISTO ${dbGroup.name}`]);
        }
    }
    console.log('-----ADMIN CREDS-----')
    console.log(adminCreds);
    console.log('-----USER CREDS-----')
    console.log(creds);
}

asyncMain().then(r => console.log("finished"));