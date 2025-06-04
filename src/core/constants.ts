// 元数据键
export const CONTROLLER_METADATA = 'controller:metadata';
export const ROUTE_METADATA = 'route:metadata';
export const METHOD_METADATA = 'method:metadata';
export const PARAM_METADATA = 'param:metadata';
export const INJECTABLE_METADATA = 'injectable:metadata';
export const MODULE_METADATA = 'module:metadata';
export const MIDDLEWARE_METADATA = 'middleware:metadata';
export const PIPE_METADATA = 'pipe:metadata';

// HTTP方法
export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  HEAD = 'head',
  ALL = 'all',
}