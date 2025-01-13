const express = require('express');
const db = require('./db');
const url = require('url');
const http = require('http');
const path = require("node:path");

const server = http.createServer((req, res ) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, UPDATE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = url.parse(req.url, true);
    const {pathname, query} = parsedUrl;

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const handleDatabaseError = (res, err, message) => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: message, details: err.message }));
    };
    //////////////////////////////////TRUCKS////////////////////////////////////////////////
    if (pathname === '/trucks' && req.method === 'GET') {
        db.query('SELECT * FROM trucks', (err, results) => {
            if (err) return handleDatabaseError(res, err, 'Failed to fetch trucks.');
            res.writeHead(200);
            res.end(JSON.stringify(results));
        });
    } else if (pathname.startsWith('/trucks/') && req.method === 'GET') {
        const id = pathname.split('/')[2];
        db.query('SELECT * FROM trucks WHERE id = ?', [id], (err, results) => {
            if (err) return handleDatabaseError(res, err, 'Failed to fetch truck by ID.');
            res.writeHead(200);
            res.end(JSON.stringify(results[0] || {}));
        });
    } else if (pathname === '/trucks' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { plate_number, brand, model, capacity, status } = JSON.parse(body);
            db.query(
                'INSERT INTO trucks (plate_number, brand, model, capacity, status) VALUES (?, ?, ?, ?, ?)',
                [plate_number, brand, model, capacity, status],
                (err, result) => {
                    if (err) return handleDatabaseError(res, err, 'Failed to create truck.');
                    res.writeHead(201);
                    res.end(JSON.stringify({ id: result.insertId }));
                }
            );
        });
    }
    else if (pathname.startsWith('/trucks/') && req.method === 'PUT') {
        const id = pathname.split('/')[2];
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { plate_number, brand, model, capacity, status } = JSON.parse(body);
            db.query(
                'UPDATE trucks SET plate_number=?, brand=?, model=?, capacity=?, status=? WHERE id = ?',
                [plate_number, brand, model, capacity, status, id],
                (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: 'Failed to update driver.', details: err.message }));
                        return;
                    }
                    res.writeHead(200);
                    res.end(JSON.stringify({ message: 'Truck updated successfully.' }));
                }
            );
        });
    }
    else if (pathname.startsWith('/trucks/') && req.method === 'DELETE') {
        const id = pathname.split('/')[2];
        db.query('DELETE FROM trucks WHERE id = ?', [id], (err) => {
            if (err) return handleDatabaseError(res, err, 'Failed to delete truck.');
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Truck deleted successfully.' }));
        });
    }
    //////////////////////////////////////////////////////////////Drivers////////////////////////////////////////////////////////////
    else if (pathname === '/drivers' && req.method === 'GET'){
        db.query('Select * from drivers', (err, result) => {
            if (err) handleDatabaseError(res, err, 'Failed to fetch drivers')
            res.writeHead(200);
            res.end(JSON.stringify(result))
        });
    }
    else if(pathname.startsWith('/drivers/') && req.method === 'GET'){
        const id = pathname.split('/')[2];
        db.query('Select * from drivers where id = ?', [id], (err,result) => {
            if (err) return handleDatabaseError(res, err, 'Failed to fetch truck by ID.');
            res.writeHead(200);
            res.end(JSON.stringify(result[0] || {}));
        });
    }
    else if(pathname === '/drivers' && req.method === "POST"){
        let body = "";
        req.on('data', chunk => { body += chunk.toString() });
        req.on('end', () => {
            const {first_name, last_name, license_number, phone_number, status} = JSON.parse(body);
            db.query(
                'Insert into drivers(first_name, last_name, license_number, phone_number, status) values (?,?,?,?,?)', [first_name, last_name, license_number, phone_number, status],
                (err, result) => {
                    if (err) handleDatabaseError(res, err, "Failed to add driver.");
                    res.writeHeader(201);
                    res.end(JSON.stringify({ id: result.insertId}));
                }
            )
        })
    }
    else if(pathname.startsWith('/drivers/') && req.method === 'PUT'){
        const id = pathname.split('/')[2];
        let body = '';
        req.on('data' , chunk => { body += chunk.toString() });
        req.on('end', () => {
            const {first_name, last_name, license_number, phone_number, status} = JSON.parse(body);
            db.query(
                'UPDATE drivers set first_name = ?, last_name = ?, license_number = ?, phone_number = ?, status = ? where id = ?',
                [first_name, last_name, license_number, phone_number, status, id],
                (err) => {
                    if (err) handleDatabaseError(res, err, "Failed to update driver.");
                    res.writeHeader(200);
                    res.end(JSON.stringify({message: 'Updated successfully'}));
                }
            )
        })
    }
    else if(pathname.startsWith('/drivers/') && req.method === 'DELETE'){
        const id = pathname.split('/')[2];
        db.query(
            'Delete from drivers where id = ? ', [id],
            (err, result) => {
                if (err) handleDatabaseError(res, err, "Failed to delete driver.");
                res.writeHeader(200);
                res.end(JSON.stringify({ message: 'Delted successfully'}));
            }
        )
    }
    //////////////////////////////////////////////Routes///////////////////////////////////////////////////////////////////////////
    else if(pathname === '/routes' && req.method === "GET"){
        db.query('Select * from routes', (err, result) => {
            if (err) handleDatabaseError(res, err, "Failed to fetch routes.")
            res.writeHeader(200);
            res.end(JSON.stringify(result));
        })
    }
    else if(pathname.startsWith('/routes/') && req.method === "GET"){
        const id = pathname.split('/')[2];
        db.query('Select * from routes where id = ?', [id], (err, result) => {
            if (err) handleDatabaseError(res, err, "Failed to fetch route with id.");
            res.writeHeader(200);
            res.end(JSON.stringify(result[0] || {}));
        })
    }
    else if(pathname === '/routes' && req.method === 'POST'){
        let body = "";
        req.on("data", chunk => { body += chunk.toString()});
        req.on("end", () =>{
            const{origin, destination, distance_km, estimated_time} = JSON.parse(body);
            db.query('Insert into routes(origin, destination, distance_km, estimated_time) values (?,?,?,?)',
            [origin, destination, distance_km, estimated_time],
                (err, result) => {
                if (err) handleDatabaseError(res, err, "Failed to add route.");
                res.writeHeader(201);
                res.end(JSON.stringify({id: result.insertId}))
            }
            );
        });
    }
    else if(pathname.startsWith('/routes/') && req.method === 'UPDATE'){
        const id = pathname.split('/')[2];
        let body = "";
        req.on("data", chunk => {body += chunk.toString()})
        req.on("end", () => {
            const {origin, destination, distance_km, estimated_time} = JSON.parse(body);
            db.query('UPDATE routes Set origin = ? , destination = ? , distance_km= ? , estimated_time=? where id = ?',
                [origin, destination, distance_km, estimated_time,id],
                (err, result) => {
                    if (err) handleDatabaseError(res, err, "Failed to update route.")
                    res.writeHeader(201);
                    res.end(JSON.stringify({ message: 'Truck updatedd succesfully.'}))
                }
            );
        });
    }
    else if(pathname.startsWith('/routes/') && req.method === 'DELETE'){
        const id = pathname.split('/')[2];
        db.query(
            'Delete from routes where id = ? ', [id],
            (err, result) => {
                if (err) handleDatabaseError(res, err, "Failed to delete driver.");
                res.writeHeader(200);
                res.end(JSON.stringify({ message: 'Delted successfully'}));
            }
        )
    }
 ////////////////////////////////////////////////////////////Assignments///////////////////////////////////////////////////
        else if (pathname === '/assignments' && req.method === 'GET') {
            db.query('SELECT * FROM assignments', (err, results) => {
                if (err) return handleDatabaseError(res, err, 'Failed to fetch assignments.');
                res.writeHead(200);
                res.end(JSON.stringify(results));
            });
        } else if (pathname.startsWith('/assignments/') && req.method === 'GET') {
            const id = pathname.split('/')[2];
            db.query('SELECT * FROM assignments WHERE id = ?', [id], (err, results) => {
                if (err) return handleDatabaseError(res, err, 'Failed to fetch assignment by ID.');
                res.writeHead(200);
                res.end(JSON.stringify(results[0] || {}));
            });
        } else if (pathname === '/assignments' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                const { truck_id, driver_id, route_id, assignment_date, status } = JSON.parse(body);
                db.query(
                    'INSERT INTO assignments (truck_id, driver_id, route_id, assignment_date, status) VALUES (?, ?, ?, ?, ?)',
                    [truck_id, driver_id, route_id, assignment_date, status],
                    (err, result) => {
                        if (err) return handleDatabaseError(res, err, 'Failed to create assignment.');
                        res.writeHead(201);
                        res.end(JSON.stringify({ id: result.insertId }));
                    }
                );
            });
        } else if (pathname.startsWith('/assignments/') && req.method === 'PUT') {
            const id = pathname.split('/')[2];
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                const { truck_id, driver_id, route_id, assignment_date, status } = JSON.parse(body);
                db.query(
                    'UPDATE assignments SET truck_id = ?, driver_id = ?, route_id = ?, assignment_date = ?, status = ? WHERE id = ?',
                    [truck_id, driver_id, route_id, assignment_date, status, id],
                    (err) => {
                        if (err) return handleDatabaseError(res, err, 'Failed to update assignment.');
                        res.writeHead(200);
                        res.end(JSON.stringify({ message: 'Assignment updated successfully.' }));
                    }
                );
            });
        } else if (pathname.startsWith('/assignments/') && req.method === 'DELETE') {
            const id = pathname.split('/')[2];
            db.query('DELETE FROM assignments WHERE id = ?', [id], (err) => {
                if (err) return handleDatabaseError(res, err, 'Failed to delete assignment.');
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Assignment deleted successfully.' }));
            });
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Route not found.' }));
        }
});

    server.listen(5000, () => {
        console.log('Server running on http://localhost:5000');
    })





































