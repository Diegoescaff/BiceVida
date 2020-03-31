'use strict';
const express = require('express');
const app = express();
const fs = require('fs');
const request = require('request');

const url = 'https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy';

app.get('/', async(req, res) => {
    const responseDatos = obtenerDatos();
    responseDatos
        .then(async(data) => {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                cobertura: data.policy.workers
            });

        })
        .catch(error => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al Realizar la Petición',
                error: error
            });
        });

});

async function obtenerDatos() {
    return new Promise((resolve, reject) => {
        request(url, async function(error, response, body) {
            if (!error && response.statusCode === 200) {
                let datosResponse = JSON.parse(body)
                await calcularPoliza(datosResponse);
                resolve(datosResponse);
                let datosReturn = JSON.stringify(datosResponse);
                fs.writeFileSync('./data.json', datosReturn);

            } else {
                reject(error);
            }
        });
    });
}


async function calcularPoliza(data) {

    let pencentage = data.policy.company_percentage;
    let coberturaDental = data.policy.has_dental_care;
    data.policy.workers.map(async(e) => {

        let arrayWorker = await validarCobvertura(e, coberturaDental);
        e.coberturaTotal = arrayWorker[0];
        e.detalle = {
            cobertura: arrayWorker[0],
            coberturaDental: arrayWorker[1]
        };

        e.company_percentage_total = e.coberturaTotal * pencentage / 100;
        e.copago_worker = e.coberturaTotal - e.company_percentage_total;

        e.company_percentage_total = +parseFloat(e.company_percentage_total).toFixed(3);
        e.copago_worker = +parseFloat(e.copago_worker).toFixed(3);

    });

}

async function validarCobvertura(employed, cdental) {

    let cobertura;
    let dental;
    if (employed.age <= 65) {
        switch (true) {
            case employed.childs == 0:
                cobertura = 0.279;
                dental = cdental ? 0.12 : 0;

                break;
            case employed.childs == 1:
                cobertura = 0.4396;
                dental = cdental ? 0.1950 : 0;

                break;
            case employed.childs >= 2:
                cobertura = 0.5599;
                dental = cdental ? 0.2480 : 0;
                break;
            default:
                break;
        }
    } else {
        switch (true) {
            case employed.childs == 0:
                cobertura = 0;
                dental = cdental ? 0 : 0;

                break;
            case employed.childs == 1:
                cobertura = 0.4396 - 0.279;
                dental = cdental ? 0.1950 - 0.12 : 0;

                break;
            case employed.childs >= 2:
                cobertura = 0.5599 - 0.279;
                dental = cdental ? 0.2480 - 0.12 : 0;
                break;
            default:
                break;
        }
    }
    return [cobertura, dental];

}

module.exports = app;