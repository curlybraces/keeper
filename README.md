# Keeper

Keeper is a simple, secure web based password manager that uses key derivation. 

## How it works

Keeper is a password manager that uses a form of [Key Derivation](https://en.wikipedia.org/wiki/Key_derivation_function) to securely store user data (logins). User data is encrypted with the standard `AES-256-GCM` algorithm that uses randomly generated 32 byte keys *(DEK (Data Encryption Key))*. These randomly generated 32 byte keys are stored encrypted with a *DK/KEK (Derived Key / Key Encryption Key)* derived using `pbkdf2`, passed with the user's plaintext password. 

## Installation

Requirements: `nodejs` `npm` `postgres`

```bash
git clone https://github.com/devhsoj/keeper.git
cd keeper
npm i
```

## Setup

#### Postgres
```sql
CREATE DATABASE keeper;
CREATE TABLE users(username VARCHAR(16),password VARCHAR(60),dek VARCHAR(130));
CREATE TABLE logins(id VARCHAR(36) PRIMARY KEY NOT NULL,owner VARCHAR(16),data text);
```

#### .env
.env should be in the `keeper/` directory
```env
# Server
PORT=3000
TLS_KEY=/path/to/somekey.pem
TLS_CERT=/path/to/somecert.pem

# Postgres
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=hopefully_strong_password
PGDATABASE=keeper

# Crypto
BCRYPT_ROUNDS=12
PBKDF2_ITERATIONS=100000

# (Note: Changing the options above while running could break user logins, best to change only once,
# or if you know what you're doing)
```

## Starting Keeper
```bash
cd /path/to/keeper
npm start
```
or using [PM2](https://pm2.keymetrics.io/) for running as a service
```bash
cd /path/to/keeper
pm2 start
```

## To-Do
Keeper is brand new, and subject to a lot of changes

* Better Documentation
* Better UI/UX - not very good at front end sorry :(
* Sharing logins
* Different categories of logins
* Favorites
* Trash
* Backups
* etc...

## License
[MIT](https://choosealicense.com/licenses/mit/)