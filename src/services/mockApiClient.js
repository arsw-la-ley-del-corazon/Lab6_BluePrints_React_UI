
const MOCK_DB = [
  {
    author: 'alice',
    name: 'room-1',
    points: [
      { x: 40, y: 40 },
      { x: 120, y: 60 },
      { x: 200, y: 40 },
      { x: 300, y: 120 },
      { x: 340, y: 200 },
    ],
  },
  {
    author: 'alice',
    name: 'room-2',
    points: [
      { x: 60, y: 80 },
      { x: 160, y: 80 },
      { x: 260, y: 140 },
      { x: 360, y: 180 },
    ],
  },
  {
    author: 'bob',
    name: 'warehouse',
    points: [
      { x: 30, y: 30 },
      { x: 80, y: 90 },
      { x: 140, y: 120 },
      { x: 220, y: 160 },
      { x: 280, y: 200 },
    ],
  },
]

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

const mock = {
  async get(url) {
    await delay(120)

    if (url === '/blueprints') {
      return { data: MOCK_DB }
    }

    // /blueprints/:author
    const m1 = url.match(/^\/blueprints\/([^/]+)$/)
    if (m1) {
      const author = decodeURIComponent(m1[1])
      return { data: MOCK_DB.filter((b) => b.author === author) }
    }

    // /blueprints/:author/:name
    const m2 = url.match(/^\/blueprints\/([^/]+)\/([^/]+)$/)
    if (m2) {
      const author = decodeURIComponent(m2[1])
      const name = decodeURIComponent(m2[2])
      const bp = MOCK_DB.find((b) => b.author === author && b.name === name)
      if (!bp) {
        const err = new Error('Not Found')
        err.response = { status: 404, data: { message: 'Blueprint not found' } }
        throw err
      }
      return { data: bp }
    }

    throw new Error(`GET no mockeado: ${url}`)
  },

  async post(url, body) {
    await delay(120)

    if (url === '/auth/login') {
      if (body?.username && body?.password) return { data: { token: 'mock.jwt.token' } }
      const err = new Error('Unauthorized')
      err.response = { status: 401, data: { message: 'Credenciales inválidas' } }
      throw err
    }

    throw new Error(`POST no mockeado: ${url}`)
  },
}

export default mock
