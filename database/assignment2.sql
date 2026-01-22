

--QUERY 1 : insterting new value into account table

INSERT INTO account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)))

VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);


--QUERY 2 : Modyfing TOny Stark account to admin account
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--QUERY 3 : Deleting Tony Stark account from account table

DELETE FROM account
WHERE account_email = 'tony@starkent.com';

--QUERY 4: updating GM Hummer description using REPLACE()

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
AND inv_model = 'Hummer';

--QUERY 5: Using INNER JOIN -- selecting "Sport" inventory items (only items in the "Sport" classification)

SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--QUERY 6: Updating image paths to include the /vehicles/ directory

UPDATE inventory
SET
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
