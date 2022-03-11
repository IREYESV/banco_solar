//import pg from 'pg'
const { Pool } = require('pg')

// creamos nuestro pool de conexiones
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'banco_solar',
    password: '1234',
    max: 4,
    min: 2,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
})

//consulta por todos los usuarios
async function consultar() {
    const client = await pool.connect()
    const res = await client.query(
        "select * from usuarios"
    )
    client.release()
    return res.rows
}
//consulta por un usuario
async function consulta_usuario() {
    const client = await pool.connect()
    const res = await client.query({
      text :"select * from usuarios"
    }
    )
    client.release()
    return res
}

async function transferencias() {
    const client = await pool.connect()
    const res = await client.query(
        "select * from transferencias"
    )
    client.release()
    console.log(res.rows)
    return res.rows
}
//crear funcion para hacer transferencias
async function hacer_transferencia(emisor_nombre, receptor_nombre, monto_transferencia) {
    const client = await pool.connect()
    
    // primero obtener el emisor
    const res = await client.query({
        text: "select * from usuarios where nombre= $1",
        values:[emisor_nombre]
    })
    const emisor = res.rows[0]

    const res2 = await client.query({
        text: "select * from usuarios where nombre= $1",
        values:[receptor_nombre]
    })
    const receptor = res2.rows[0]

    // creamos una transferencia en la base de datos
    let res3 = await client.query({
        text: "insert into transferencias (emisor, receptor, monto ) values ($1, $2, $3)",
        values:[emisor.id, receptor.id, parseInt(monto_transferencia)]
    })

    
    client.release()
    return res.rows
}

async function insertar_usuario(nombre, balance) {
    let client
    try {
        client = await pool.connect();
    } catch (conn_error) {
        console.log(conn_error)
    }
    // acá realizamos la consulta e ingresamos un usuario
    let res = await client.query({
        text: "insert into usuarios(nombre, balance ) values ($1, $2)",
        values:[nombre, balance]
    })
    
    client.release()
    return res.send
}

module.exports ={consultar, transferencias,insertar_usuario,hacer_transferencia}



