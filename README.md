## Requirement

nodejs
postgres



## FOR DATABASE MIGRATION

** Create database **

createdb -h localhost -p 5432 -U postgres qed_prod

** Switch to postgres user **

sudo -i -u postgres

psql qed_prod < migrations/schema.down.sql

psql qed_prod < migrations/schema.up.sql

psql qed_prod < migrations/seed.sql
