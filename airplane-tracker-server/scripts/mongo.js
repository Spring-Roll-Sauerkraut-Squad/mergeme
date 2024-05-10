//Check whether there are duplicate data
db.aircrafts.aggregate([
    { $group: { _id: "$icao24", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 10 }
])


db.airports.aggregate([
    { $group: { _id: "$ident", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 10 }
])

// Create indexes
db.aircrafts.createIndex( { "icao24": 1 }, { unique: true } )
db.airports.createIndex( { "ident": 1 }, { unique: true } )