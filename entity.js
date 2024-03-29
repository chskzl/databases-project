module.exports = function(){
	var express = require('express');
	var router = express.Router();

	function getStars(res, mysql, context, complete){
		mysql.pool.query("SELECT id, name, system, type, age FROM stars", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.stars = results;
			complete();
		});
	}
	
	function getStar(res, mysql, context, id, complete){
		var sql = "SELECT id, name, system, type, age FROM stars WHERE id = ?";
		var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.star = results[0];
            complete();
        });
	}

	function getPlanets(res, mysql, context, complete){
		mysql.pool.query("SELECT planet_id, planets.name, diameter, period, stars.name as star_name, num_moons FROM planets INNER JOIN planet_orbit ON planets.id = planet_orbit.planet_id INNER JOIN stars on planet_orbit.star_id = stars.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.planets = results;
			complete();
		});
	}

	function getPlanet(res, mysql, context, id, complete){
		var sql = "SELECT planet_id, planets.name, diameter, period, stars.name as star_name, num_moons FROM planets INNER JOIN planet_orbit ON planets.id = planet_orbit.planet_id INNER JOIN stars on planet_orbit.star_id = stars.id WHERE planet_id = ?";
		var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planet = results[0];
            complete();
        });
	}

	function getMoons(res, mysql, context, complete){
		mysql.pool.query("SELECT moons.id, moons.name as moon_name, planets.name as planet_name, moons.diameter FROM moons INNER JOIN planets on planet_orbiting = planets.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.moons = results;
			complete();
		});
	}

	function getMoon(res, mysql, context, id, complete){
		var sql = "SELECT moons.id, moons.name as moon_name, planets.name as planet_name, moons.diameter FROM moons INNER JOIN planets on planet_orbiting = planets.id WHERE moons.id = ?";
		var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.moon = results[0];
            complete();
        });
	}

	function getElements(res, mysql, context, complete){
		mysql.pool.query("SELECT name, id FROM elements", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.elements = results;
			complete();
		});
	}

	function getElementRelated(res, mysql, context, id, complete){
		var sql = "SELECT name, id FROM elements WHERE id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.element = results[0];
			complete();
		});
		sql = "SELECT stars.name, system, type, age FROM stars INNER JOIN star_composition ON stars.id = star_id INNER JOIN elements ON element_id = elements.id WHERE elements.id=?";
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.stars = results;
			complete();
		});
		sql = "SELECT planets.name, diameter, period, stars.name as star_name, num_moons FROM planets INNER JOIN planet_orbit ON planets.id = planet_orbit.planet_id INNER JOIN stars on planet_orbit.star_id = stars.id INNER JOIN planet_composition ON planets.id = planet_composition.planet_id INNER JOIN elements ON element_id = elements.id WHERE elements.id=?";
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.planets = results;
			complete();
		});
		sql = "SELECT moons.id, moons.name as moon_name, planets.name as planet_name, moons.diameter FROM moons INNER JOIN planets on planet_orbiting = planets.id INNER JOIN moon_composition ON moons.id = moon_composition.moon_id INNER JOIN elements ON element_id = elements.id WHERE elements.id=?";
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.moons = results;
			complete();
		});
	}

	/*Display stars*/

	router.get('/', function(req, res){	
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["delete.js", "update.js", "filter.js"];
		var mysql = req.app.get('mysql');
		getStars(res, mysql, context, complete);
		function complete(){
		callbackCount++;
			if(callbackCount >= 1){
				res.render('stars', context);
			}

		}
	});

	/*Display planets*/

	router.get('/planets', function(req, res){	
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["delete.js", "update.js", "filter.js"];
		var mysql = req.app.get('mysql');
		getPlanets(res, mysql, context, complete);
		function complete(){
		callbackCount++;
			if(callbackCount >= 1){
				res.render('planets', context);
			}

		}
	});

	/*Display moons*/

	router.get('/moons', function(req, res){	
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["delete.js", "update.js", "filter.js"];
		var mysql = req.app.get('mysql');
		getMoons(res, mysql, context, complete);
		function complete(){
		callbackCount++;
			if(callbackCount >= 1){
				res.render('moons', context);
			}

		}
	});

	/*Display elements*/

	router.get('/elements', function(req, res){	
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getElements(res, mysql, context, complete);
		function complete(){
		callbackCount++;
			if(callbackCount >= 1){
				res.render('elements', context);
			}

		}
	});

	/*Get entities related to one element*/

	router.get('/elements/:id', function(req, res){	
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getElementRelated(res, mysql, context, req.params.id, complete);
		function complete(){
		callbackCount++;
			if(callbackCount >= 4){
				res.render('element-related', context);
			}

		}
	});

	router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO stars (name, system, type, age) VALUES (?,?,?,?)";
        var inserts = [req.body.name, req.body.system, req.body.type, req.body.age];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/');
            }
        });
    });

	router.post('/planets', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO planets (name, diameter, period, num_moons) VALUES (?,?,?,?); INSERT INTO planet_orbit (star_id, planet_id) VALUES ((SELECT id FROM stars WHERE name = ?),(SELECT id FROM planets WHERE name = ?));";
        var inserts = [req.body.name, req.body.diameter, req.body.period, req.body.num_moons, req.body.star_name, req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/planets');
            }
        });
    });

	router.post('/moons', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO moons (name, diameter, planet_orbiting) VALUES (?,?,(SELECT id FROM planets WHERE name = ?))";
        var inserts = [req.body.name, req.body.diameter, req.body.planet_orbiting];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/moons');
            }
        });
    });

	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM stars WHERE id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
				res.status(202).end();
			}

		})
	})

	router.delete('/planets/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM planet_orbit WHERE planet_id = ?; DELETE FROM planets WHERE id = ?;";
		var inserts = [req.params.id, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
				res.status(202).end();
			}

		})
	})

	router.delete('/moons/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM moons WHERE id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
				res.status(202).end();
			}

		})
	})
	
	//update star
	 router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js"];
        var mysql = req.app.get('mysql');
        getStar(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-star', context);
            }

        }
    });
	
	router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE stars SET name=?, system=?, type=?, age=? WHERE id=?";
        var inserts = [req.body.name, req.body.system, req.body.type, req.body.age, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    //update planet
	 router.get('/planets/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js"];
        var mysql = req.app.get('mysql');
        getPlanet(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-planet', context);
            }

        }
    });
	
	router.put('/planets/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE planets SET name=?, diameter=?, period=?, num_moons=? WHERE id=?";
        var inserts = [req.body.name, req.body.diameter, req.body.period, req.body.num_moons, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    //update moon
	 router.get('/moons/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js"];
        var mysql = req.app.get('mysql');
        getMoon(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-moon', context);
            }

        }
    });
	
	router.put('/moons/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE moons SET name=?, diameter=?, planet_orbiting=? WHERE id=?";
        var inserts = [req.body.name, req.body.diameter, req.body.planet_orbiting, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

	return router;
}();
