create table if not exists suppliers
(
  _id int not null,
  name varchar(100),
  email varchar(100),
  primary key (_id)
) engine = innodb;

create table if not exists supplier_phones
(
  supplier_id int not null,
  phone varchar(50),
  primary key (supplier_id, phone),
  unique (phone),
  foreign key (supplier_id) references suppliers(_id)
) engine = innodb;

create table if not exists orders
(
  order_id int not null,
  order_date date,
  supplier_id int,
  primary key (order_id),
  foreign key (supplier_id) references suppliers(_id)
) engine = innodb;

create table if not exists order_parts
(
  order_id int not null,
  part_id int not null,
  qty int,
  primary key (order_id, part_id),
  foreign key (order_id) references orders(order_id),
  foreign key (part_id) references parts(_id)
) engine = innodb;
