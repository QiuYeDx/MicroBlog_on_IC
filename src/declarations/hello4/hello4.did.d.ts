import type { Principal } from '@dfinity/principal';
export interface Message {
  'content' : string,
  'time' : Time,
  'author' : string,
}
export interface Poster { 'principal' : string, 'name' : string }
export type Time = bigint;
export interface _SERVICE {
  'follow' : (arg_0: string) => Promise<undefined>,
  'follows' : () => Promise<Array<Poster>>,
  'get_name' : () => Promise<[] | [string]>,
  'post' : (arg_0: string) => Promise<undefined>,
  'posts' : () => Promise<Array<Message>>,
  'posts_by_id' : (arg_0: string) => Promise<Array<Message>>,
  'set_name' : (arg_0: string) => Promise<undefined>,
  'timeline' : () => Promise<Array<Message>>,
}
