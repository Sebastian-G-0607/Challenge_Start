import { configureMock, updateMock, deleteMock } from '../controllers/controllers.mjs';
import { mockConfigurations } from '../db/db.mjs';
import assert from 'node:assert/strict';
import { test, beforeEach } from 'node:test';

// Utilidad para mockear res
function createResMock() {
    const res = {};
    res.statusCode = null;
    res.body = null;
    res.status = function(code) { this.statusCode = code; return this; };
    res.json = function(obj) { this.body = obj; return this; };
    res.send = function(obj) { this.body = obj; return this; };
    return res;
}

beforeEach(() => {
    mockConfigurations.length = 0;
    mockConfigurations.push({
        id: 1,
        path: '/test',
        method: 'GET',
        status: 200,
        response: { ok: true },
        contentType: 'application/json'
    });
});

test('configureMock guarda un mock con solo los parámetros obligatorios', async () => {
    const req = {
        body: {
            path: '/only-required',
            method: 'GET',
            status: 200,
            response: { ok: true },
            contentType: 'application/json'
        }
    };
    const res = createResMock();

    await configureMock(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(mockConfigurations.length, 2);
    assert.deepEqual(
        Object.keys(mockConfigurations[1]).sort(),
        ['contentType', 'id', 'method', 'path', 'response', 'status'].sort()
    );
});

test('configureMock guarda un mock con parámetros opcionales', async () => {
    const req = {
        body: {
            path: '/with-optional',
            method: 'POST',
            status: 201,
            response: { ok: false },
            contentType: 'application/json',
            queryParams: { foo: 'bar' },
            bodyParams: { id: 1 },
            headers: { 'x-custom': 'abc' }
        }
    };
    const res = createResMock();

    await configureMock(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(mockConfigurations.length, 2);
    assert.deepEqual(
        Object.keys(mockConfigurations[1]).sort(),
        [
            'contentType', 'id', 'method', 'path', 'response', 'status',
            'queryParams', 'bodyParams', 'headers'
        ].sort()
    );
    assert.deepEqual(mockConfigurations[1].queryParams, { foo: 'bar' });
    assert.deepEqual(mockConfigurations[1].bodyParams, { id: 1 });
    assert.deepEqual(mockConfigurations[1].headers, { 'x-custom': 'abc' });
});

test('updateMock actualiza un mock existente', async () => {
    const req = {
        params: { id: '1' },
        body: { response: { ok: false } }
    };
    const res = createResMock();

    await updateMock(req, res);

    assert.equal(mockConfigurations[0].response.ok, false);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: 'Mock actualizado' });
});

test('updateMock retorna 404 si el mock no existe', async () => {
    const req = {
        params: { id: '999' },
        body: { response: { ok: false } }
    };
    const res = createResMock();

    await updateMock(req, res);

    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, { error: 'Mock no encontrado' });
});

test('updateMock retorna 400 si hay propiedades no válidas', async () => {
    const req = {
        params: { id: '1' },
        body: { invalidProp: 123 }
    };
    const res = createResMock();

    await updateMock(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
        error: 'Propiedades no válidas para actualizar: invalidProp'
    });
});

test('updateMock retorna 500 si ocurre un error', async () => {
    const req = {
        params: { id: '1' },
        body: null // Esto causará un error en Object.keys(newConfig)
    };
    const res = createResMock();

    await updateMock(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, { error: 'Ocurrió un error al actualizar el mock' });
});

test('deleteMock elimina un mock existente', async () => {
    const req = {
        params: { id: '1' }
    };
    const res = createResMock();

    await deleteMock(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: 'Mock eliminado' });
    assert.equal(mockConfigurations.length, 0);
});

test('deleteMock retorna 404 si el mock no existe', async () => {
    const req = {
        params: { id: '999' }
    };
    const res = createResMock();

    await deleteMock(req, res);

    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, { error: 'Mock no encontrado' });
});