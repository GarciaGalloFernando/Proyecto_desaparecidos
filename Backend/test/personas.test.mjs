import assert from "node:assert/strict";
import test from "node:test";

import { createApp } from "../src/app.mjs";

test("GET /api/personas devuelve el listado de personas", async (t) => {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/personas`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^application\/json/);
  const personas = await response.json();
  assert.ok(Array.isArray(personas));
  assert.ok(personas.length > 0);
  assert.equal(personas[0].nombre, "María Fernanda Quispe");
});
