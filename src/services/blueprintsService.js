import * as mock from './apiMock';
import * as client from './apiClient';

const useMock = String(import.meta.env.VITE_USE_MOCK).toLowerCase() === 'true';
const impl = useMock ? mock : client;


const toPoint = (p = {}) => ({
  x: Number(p.x ?? p.X ?? p.coordX ?? p[0] ?? 0),
  y: Number(p.y ?? p.Y ?? p.coordY ?? p[1] ?? 0),
});

const toPoints = (b = {}) => {
  let pts = b.points ?? b.pointList ?? b.pointsDTO ?? b.data?.points ?? [];
  if (!Array.isArray(pts) && pts && typeof pts === 'object') pts = Object.values(pts);
  return Array.isArray(pts) ? pts.map(toPoint).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)) : [];
};

const toBlueprint = (b = {}) => ({
  author: b.author?.name ?? b.author ?? b.autor ?? '',
  name: b.name ?? b.bpname ?? b.title ?? '',
  points: toPoints(b),
});


const listify = (d) => Array.isArray(d) ? d
  : Array.isArray(d?.data) ? d.data
  : Array.isArray(d?.items) ? d.items
  : Array.isArray(d?.blueprints) ? d.blueprints
  : (d && typeof d === 'object') ? Object.values(d) : [];

export const getAll = async () => listify(await impl.getAll());
export const getByAuthor = async (author) => listify(await impl.getByAuthor(author));


export const getByAuthorAndName = async (author, name) =>
  toBlueprint(await impl.getByAuthorAndName(author, name));

export const create = (...a) => impl.create(...a);
export const addPoint = (...a) => impl.addPoint(...a);
