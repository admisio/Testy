// import { readXlsxFile } from 'read-excel-file/node';
import prisma from "./prisma";
import {Row} from "read-excel-file";
import readXlsxFile from "read-excel-file/node";
import bcrypt from "bcrypt";
import * as crypto from "crypto";

const asyncMain = async () => {
    const readXlsxFile = require('read-excel-file/node');
    const rows = await readXlsxFile('users-nedele.xlsx');

    const dbGroup = await prisma.group.create({
        data: {
            name: 'SKUPINA NANEČISTO! sobotka - online',
        }
    });

    const [username, password] = [`adminnedele`, 'CSSDSobotka'];
    const dbAdmin = await prisma.admin.create({
        data: {
            username: username,
            name: 'adminnedele',
            surname: 'adminnedele',
            email: `adminnedele`,
            password: await bcrypt.hash(password, 12)
        }
    });
    await prisma.adminsOnGroups.create({
        data: {
            adminId: dbAdmin.id,
            groupId: dbGroup.id
        }
    });

    const creds: [string, string, string][] = [];
    for (const user of rows) {
        const [name, email, it, kb, g] = [user[0], user[1], user[2], user[3], user[4]].map((t) => t ? t.toString() : '');
        const [username, password] = [name.replace(/\s/g, '') + '-nedele', crypto.randomBytes(4).toString('hex')];
        console.log(username, password)
        const dbUser = await prisma.user.create({
            data: {
                username,
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
        creds.push([username, password, `${dbGroup.name}`]);
    }
    console.log('-----USER CREDS-----')
    console.log(creds);
}

asyncMain().then(r => console.log("finished"));