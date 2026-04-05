#!/bin/bash
#
user="u08"
pass="Main.Hunger.Neck.Forest.46"
db="u08"
#
MYSQL="mysql -u $user --password=$pass $db"
#
# === Create tables ===
echo "Creating tables..."
echo "source make_tables.sql;" | $MYSQL
#
# =============================================
# SUPPLIERS
# =============================================
echo "Generating supplier inserts..."
#
# suppliers table
jq -r '.[] | [._id, .name, .email] | @tsv' suppliers_100.json | while IFS=$'\t' read -r id name email; do
    name=$(echo "$name" | sed "s/'/''/g")
    echo "INSERT INTO suppliers VALUES ($id, '$name', '$email');"
done > insert_suppliers.sql
#
$MYSQL < insert_suppliers.sql
echo "Suppliers loaded."
#
# supplier_phones table
jq -r '.[] | ._id as $sid | .tel[] | [$sid, .number] | @tsv' suppliers_100.json | while IFS=$'\t' read -r sid phone; do
    echo "INSERT INTO supplier_phones VALUES ($sid, '$phone');"
done > insert_phones.sql
#
$MYSQL < insert_phones.sql
echo "Supplier phones loaded."
#
# =============================================
# ORDERS
# =============================================
echo "Generating order inserts..."
#
# orders table (auto-generate order_id since the JSON has none)
jq -r --slurp 'to_entries[] | [(.key+1), .value.when, .value.supp_id] | @tsv' orders_4000.json | while IFS=$'\t' read -r oid odate sup; do
    echo "INSERT INTO orders VALUES ($oid, '$odate', $sup);"
done > insert_orders.sql
#
$MYSQL < insert_orders.sql
echo "Orders loaded."
#
# order_parts table
jq -r --slurp 'to_entries[] | (.key+1) as $oid | .value.items[] | [$oid, .part_id, .qty] | @tsv' orders_4000.json | while IFS=$'\t' read -r oid pid qty; do
    echo "INSERT INTO order_parts VALUES ($oid, $pid, $qty);"
done > insert_order_parts.sql
#
$MYSQL < insert_order_parts.sql
echo "Order parts loaded."
#
echo
echo "All data loaded successfully."
