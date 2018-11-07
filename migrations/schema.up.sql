CREATE TYPE gender AS ENUM ('Male', 'Female', 'Others');

CREATE TABLE IF NOT EXISTS countries(
  id serial primary key UNIQUE,
  name varchar UNIQUE NOT NULL,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS universities(
  id serial primary key UNIQUE,
  name varchar UNIQUE NOT NULL,
  country_id integer NULL,
  avatar varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

ALTER TABLE universities ADD FOREIGN KEY (country_id) REFERENCES countries(id) ;

CREATE TABLE IF NOT EXISTS category(
  id serial primary key UNIQUE,
  name varchar UNIQUE NOT NULL,
  type varchar CHECK (type IN ('visual','team','vizOfDay')) NOT NULL,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

ALTER TABLE category ADD seq_no integer default 1;

CREATE TABLE IF NOT EXISTS users (
  id serial primary key UNIQUE,
  email varchar UNIQUE,
  password varchar,
  type integer CHECK (type IN (1,2,3)) NOT NULL,
  status integer default(0) NOT NULL,
  dob varchar,
  firstname varchar,
  lastname varchar,
  role varchar,
  avatar varchar,  
  gender gender,  
  mobile varchar,
  bio varchar, 
  country_id integer NULL,
  category_id integer NULL,
  university_id integer NULL,
  in_team integer default(0) NOT NULL,
  google_id varchar NULL,
  facebook_id varchar NULL,
  is_manual integer default(0) NOT NULL,
  created_by_admin integer default(0) NOT NULL,
  created_at timestamp default now(),
  updated_at timestamp default now()    
);

ALTER TABLE users ADD FOREIGN KEY (country_id) REFERENCES countries(id);
ALTER TABLE users ADD FOREIGN KEY (category_id) REFERENCES category(id);
ALTER TABLE users ADD FOREIGN KEY (university_id) REFERENCES universities(id);
ALTER TABLE users ADD seq_no integer default 1;

CREATE TABLE IF NOT EXISTS reset_passwords(
  id serial primary key UNIQUE,
  user_id integer,
  token varchar,
  created_at timestamp default now(),
  updated_at timestamp default now() 
);

ALTER TABLE reset_passwords ADD FOREIGN KEY (user_id) REFERENCES users(id) ;

CREATE TABLE IF NOT EXISTS sessions(
  id serial primary key UNIQUE,
  user_id integer, 
  token text,
  created_time integer,
  exp_time integer,
  message varchar,
  meta jsonb
);

ALTER TABLE sessions ADD FOREIGN KEY (user_id) REFERENCES users(id) ;

CREATE TABLE IF NOT EXISTS visual(
  id serial primary key UNIQUE,
  title varchar,
  author varchar,
  category_id integer NULL,
  country_id integer NULL,
  university_id integer NULL,
  tags varchar,
  upvote integer default(0) NOT NULL,
  avatar varchar,
  embed_code varchar,
  is_featured integer default(0) NOT NULL,
  user_id integer,
  created_by_admin integer default(0) NOT NULL,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

ALTER TABLE visual ADD FOREIGN KEY (country_id) REFERENCES countries(id);
ALTER TABLE visual ADD FOREIGN KEY (category_id) REFERENCES category(id);
ALTER TABLE visual ADD FOREIGN KEY (university_id) REFERENCES universities(id);
ALTER TABLE visual ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE visual ADD seq_no integer default 1;
ALTER TABLE visual ADD data_src varchar;

CREATE TABLE IF NOT EXISTS vizofday(
  id serial primary key UNIQUE,
  category_id integer NULL,
  viz_id integer NULL,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

ALTER TABLE vizofday ADD FOREIGN KEY (category_id) REFERENCES category(id);
ALTER TABLE vizofday ADD FOREIGN KEY (viz_id) REFERENCES visual(id) ;

CREATE TABLE IF NOT EXISTS upvote(
  id serial primary key UNIQUE,
  user_id integer NULL,
  viz_id integer NULL,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

ALTER TABLE upvote ADD FOREIGN KEY (user_id) REFERENCES users(id) ;
ALTER TABLE upvote ADD FOREIGN KEY (viz_id) REFERENCES visual(id) ;

CREATE TABLE IF NOT EXISTS video(
  id serial primary key UNIQUE,
  title varchar,
  author varchar,
  university_id integer NULL,
  country_id integer NULL,
  tags varchar,
  embed_code varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

ALTER TABLE video ADD FOREIGN KEY (university_id) REFERENCES universities(id);
ALTER TABLE video ADD FOREIGN KEY (country_id) REFERENCES countries(id);
ALTER TABLE video ADD seq_no integer default 1;

CREATE TABLE IF NOT EXISTS homepage_about(
  id serial primary key UNIQUE,
  content varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS aboutpage_about(
  id serial primary key UNIQUE,
  content varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS cms_partners(
  id serial primary key UNIQUE,
  avatar varchar,
  title varchar,
  link varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
CREATE TABLE IF NOT EXISTS cms_news(
  id serial primary key UNIQUE,
  content varchar,
  link varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
ALTER TABLE cms_news ADD link varchar;

CREATE TABLE IF NOT EXISTS cms_journey(
  id serial primary key UNIQUE,
  nav_title varchar,
  header varchar,
  content varchar,
  avatar varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
ALTER TABLE cms_journey ADD seq_no integer default 1;

CREATE TABLE IF NOT EXISTS homepage_video_section(
  id serial primary key UNIQUE,
  text_typed varchar,
  text_content varchar,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
