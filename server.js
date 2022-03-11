const express = require('express')
const { consultar, transferencias, insertar_usuario,hacer_transferencia } = require('./function.js')

const app = express()
app.use(express.static('static'))

//Recibe los datos de un nuevo usuario y los almacena en PostgreSQL.
app.post('/usuario', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {
        const datos = JSON.parse(body);
        insertar_usuario(datos.nombre, datos.balance)
        res.json({ datos });
    })
})

//Devuelve todos los usuarios registrados con sus balances.
app.get('/usuarios', async (req, res) => {
    try {
        let all_usuarios = await consultar()
        console.log(all_usuarios);
        res.json(all_usuarios)


    } catch (error) {
        console.log("error de consulta es: " + error);
    }
})

// Devuelve todas las transferencias de los usuarios registrados.
app.post('/transferencia', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })
        console.log(body)
    req.on("end", async () => {
        const datos = JSON.parse(body);
        await hacer_transferencia(datos.emisor, datos.receptor, datos.monto)
        console.log(datos)
        res.json({ datos });
    })
})

app.get("/transferencias", async (req, res) => {
    try {
        let all_transferencias =await transferencias();
        res.send(JSON.stringify(all_transferencias));
    } catch (error) {
        console.log("error de transferencias es: " + error);
    }
})

//Recibe los datos modificados de un usuario registrado y los actualiza.
app.put("/usuario", async (req, res) => {
    try {
        let all_transferencias =await transferencias();
        res.send(JSON.stringify(all_transferencias));
    } catch (error) {
        console.log("error de transferencias es: " + error);
    }
})


/*● /usuario DELETE: Recibe el id de un usuario registrado y lo elimina .
● /transferencia POST: Recibe los datos para realizar una nueva transferencia. Se debe
ocupar una transacción SQL en la consulta a la base de datos.
● /transferencias GET: Devuelve todas las transferencias almacenadas en la base de
datos en formato de arreglo.*/



app.listen(3000, () => console.log('Servidor en puerto 3000'))

