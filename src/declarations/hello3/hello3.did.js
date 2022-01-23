export const idlFactory = ({ IDL }) => {
  const Poster = IDL.Record({ 'principal' : IDL.Text, 'name' : IDL.Text });
  const Time = IDL.Int;
  const Message = IDL.Record({
    'content' : IDL.Text,
    'time' : Time,
    'author' : IDL.Text,
  });
  return IDL.Service({
    'follow' : IDL.Func([IDL.Text], [], []),
    'follows' : IDL.Func([], [IDL.Vec(Poster)], ['query']),
    'get_name' : IDL.Func([], [IDL.Opt(IDL.Text)], []),
    'post' : IDL.Func([IDL.Text], [], []),
    'posts' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'posts_by_id' : IDL.Func([IDL.Text], [IDL.Vec(Message)], []),
    'set_name' : IDL.Func([IDL.Text], [], []),
    'timeline' : IDL.Func([], [IDL.Vec(Message)], []),
  });
};
export const init = ({ IDL }) => { return []; };
