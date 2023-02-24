import bcrypt from 'bcrypt';

type UserType = {
    id: number;
    email: string;
    name: string;
    surname: string;
    username: string;
    password: string;
    groupId: number;
};

type GroupType = {
    id: number;
    name: string;
};

type AdminType = {
    id: number;
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
}

const generateUsers = (data: {
    idStart: number;
    count: number;
    groupId: number;
}): Array<UserType> => {
    const users: Array<UserType> = [];
    for (let i = data.idStart; i < data.count; i++) {
        users.push({
            id: i,
            email: `mail${i}`,
            name: `name${i}`,
            surname: `surname${i}`,
            username: `username${i}`,
            password: `password${i}`,
            groupId: data.groupId
        });
    }
    return users;
};

export const GROUPS: Array<GroupType> = [
    {
        id: 1,
        name: 'group 1'
    },
    {
        id: 2,
        name: 'group 2'
    }
];

export const USERS: Array<UserType> = [
    generateUsers({ idStart: 1, count: 15, groupId: 1 }),
    generateUsers({ idStart: 16, count: 15, groupId: 2 })
]
    .flat()
    .map((user) => {
        return {
            ...user,
            password: bcrypt.hashSync(user.password, 10)
        };
    });

export const ADMIN: AdminType = {
    id: 1,
    name: 'admin',
    surname: 'admin',
    username: 'admin',
    email: 'admin',
    password: bcrypt.hashSync('admin', 10)
};