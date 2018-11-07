class User {
    static get usersignup () {
        return [
            {
                it: 'As user i can signup on system using email password.',
                status: 1,
                data:    {
                    'email': 'test@techuz.com',
                    'password': 'valid-password'
                }
            },
            {
                it: 'As a user i can not signup on system using same email password.',
                status: 0,
                data:    {
                    'email': 'test@techuz.com',
                    'password': 'valid-password'
                }
            }

        ];
    }
    

    static get socialLogin () {
        return [
            {
                it: 'As a user i can social login.',
                status: 1,
                data:    {
                    'email': 'test@mail.com',
                    'provider': 'facebook',
                    'id': 'adsasdadsasdf5645554'
                }
            },
            {
                it: 'As a user i can social login with diffrent social login with same emailID.',
                status: 1,
                data:    {
                    'email': 'test@mail.com',
                    'provider': 'google',
                    'id': 'adsasdadsasdf5645554google'
                }
            }

        ];
    }

    static get userSignIn () {
        return [
            {
                it: 'As a user i can not login with invalid password',
                status: 0,
                data:    {
                    'email': 'test@techuz.com',
                    'password': 'Invalid password'

                }
            },
            {
                it: 'As a user I can  login with valid password.',
                status: 1,
                data:    {
                    'email': 'test@techuz.com',
                    'password': 'valid-password'
                }
            }

        ];
    }


    static get adminSignIn () {
        return [
            {
                it: 'As a admin I can login with valid password.',
                status: 1,
                data:    {
                    'email': 'niravgoswami@techuz.com',
                    'password': 'techuz123'
                }
            },
            {
                it: 'As a superadmin I can login with valid password.',
                status: 1,
                data:    {
                    'email': 'superadmin@techuz.com',
                    'password': 'techuz123',
                    'type':3
                }
            },
            {
                it: 'As a admin I can not login with invalid password. (Invalid Password)',
                status: 0,
                data:    {
                    'email': 'niravgoswami@techuz.com',
                    'password': 'Invalid-password'
                }
            }
        ];
    }


}


module.exports = User;
