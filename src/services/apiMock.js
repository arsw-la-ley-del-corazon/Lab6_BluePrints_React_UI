const MOCK_DB = [
  { author: 'jeisson', name: 'room-1', points: [ {x:40,y:40}, {x:120,y:60}, {x:200,y:40}, {x:300,y:120}, {x:340,y:200} ] },
  { author: 'jeisson', name: 'room-2', points: [ {x:60,y:80}, {x:160,y:80}, {x:260,y:140}, {x:360,y:180} ] },
  { author: 'jeisson', name: 'room-3', points: [ {x:30,y:80}, {x:120,y:80}, {x:210,y:140}, {x:160,y:180},{x:190,y:180} ] },
  { author: 'alexa',   name: 'room-1', points: [ {x:30,y:30}, {x:80,y:90}, {x:140,y:120}, {x:220,y:160}, {x:280,y:200} ] },
  { author: 'alexa',   name: 'room-2', points: [ {x:40,y:30}, {x:90,y:90}, {x:150,y:120}, {x:230,y:160}, {x:290,y:200} ] },
  { author: 'valentina',   name: 'room-1', points: [ {x:10,y:10}, {x:90,y:90}, {x:150,y:150}, {x:250,y:250}, {x:300,y:300} ] },
  { author: 'alison',   name: 'room-1', points: [ {x:40,y:30}, {x:90,y:90}, {x:150,y:120}, {x:230,y:160}, {x:290,y:200} ] }

];

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
const norm = s => String(s ?? '').trim().toLowerCase();

const mock = {
  async get(url) {
    await delay(120);

    if (url === '/blueprints') {
      return { data: MOCK_DB };
    }


    const m1 = url.match(/^\/blueprints\/([^/]+)$/);
    if (m1) {
      const author = decodeURIComponent(m1[1]);
      return { data: MOCK_DB.filter(b => norm(b.author) === norm(author)) };
    }


    const m2 = url.match(/^\/blueprints\/([^/]+)\/([^/]+)$/);
    if (m2) {
      const author = decodeURIComponent(m2[1]);
      const name   = decodeURIComponent(m2[2]);
      const bp = MOCK_DB.find(b => norm(b.author) === norm(author) && norm(b.name) === norm(name));
      if (!bp) {
        const err = new Error('Not Found');
        err.response = { status: 404, data: { message: 'Blueprint not found' } };
        throw err;
      }
      return { data: bp };
    }

    throw new Error(`GET no mockeado: ${url}`);
  },

  async post(url, body) {
    await delay(120);

    if (url === '/auth/login') {
      if (body?.username && body?.password) return { data: { token: 'mock.jwt.token' } };
      const err = new Error('Unauthorized');
      err.response = { status: 401, data: { message: 'Credenciales inválidas' } };
      throw err;
    }


    if (url === '/blueprints') {
      const bp = body;
      if (!bp?.author || !bp?.name || !Array.isArray(bp.points)) {
        const err = new Error('Bad Request');
        err.response = { status: 400, data: { message: 'Blueprint inválido' } };
        throw err;
      }
      const exists = MOCK_DB.some(b => norm(b.author) === norm(bp.author) && norm(b.name) === norm(bp.name));
      if (exists) {
        const err = new Error('Conflict');
        err.response = { status: 409, data: { message: 'Ya existe un blueprint con ese autor/nombre' } };
        throw err;
      }
      MOCK_DB.push({ author: bp.author, name: bp.name, points: bp.points });
      return { data: bp };
    }

    throw new Error(`POST no mockeado: ${url}`);
  },
};

export default mock;


export async function getAll() {
  const { data } = await mock.get('/blueprints');
  return data;
}

export async function getByAuthor(author) {
  const { data } = await mock.get(`/blueprints/${encodeURIComponent(author)}`);
  return data;
}

export async function getByAuthorAndName(author, name) {
  const { data } = await mock.get(`/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`);
  return data;
}

export async function create(blueprint) {
  const { data } = await mock.post('/blueprints', blueprint);
  return data;
}
