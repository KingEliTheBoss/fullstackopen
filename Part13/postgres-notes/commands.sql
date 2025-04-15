CREATE TABLE notes (id SERIAL PRIMARY KEY, content text NOT NULL, important boolean, date time);
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);


insert into users (username, name) values ('mluukkai','Matti Luukkainen');
insert into users (username, name) values ('ilves','Kalle Ilves');
insert into users (username, name) values ('jakouse','Jami Kousa');


insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);


insert into user_notes (user_id, note_id) values (2,1);
insert into user_notes (user_id, note_id) values (2,2);