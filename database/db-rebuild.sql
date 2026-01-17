--QUERY 4: updating GM Hummer description using REPLACE()

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
AND inv_model = 'Hummer';


--QUERY 6: Updating image paths to include the /vehicles/ directory

UPDATE inventory
SET
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');