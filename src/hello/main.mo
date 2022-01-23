import List "mo:base/List";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

actor {
    private type Time = Time.Time;
    private type Message = {
        content: Text;
        time: Time;
        author: Text;
    };
    private type MyBlog = actor{
        follow: shared (Principal) -> async ();
        follows: shared query() -> async [Principal];
        post: shared (Text) -> async ();
        posts: shared query () -> async [Message];
        timeline: shared () -> async [Message];
        set_name: shared (Text) -> async ();
        get_name: shared () -> async ?Text;
    };

    stable var followed : List.List<Principal> = List.nil();
    stable var messages : List.List<Message> = List.nil();
    stable var myName : Text = "[nameless!]";

    public shared func set_name(name: Text) : async(){
        myName := name;
    };

    public shared func get_name() : async ?Text {
        return ?myName;
    };
    
    public shared func follow(id: Principal) : async (){
        followed := List.push(id, followed);
    };
    
    public shared query func follows() : async [Principal]{
        List.toArray(followed)
    };

    public shared ({caller}) func post(text: Text) : async (){
        //Security Check
        //assert(Principal.toText(caller) == "..."); 
        var msg : Message = {
            content = text;
            time = Time.now();
            author = myName;
        };
        messages := List.push(msg, messages);
    };

    public shared query func posts() : async [Message]{
        List.toArray(messages)
    };

    public shared func timeline() : async [Message]{
        var all : List.List<Message> = List.nil();
        for(id in Iter.fromList(followed)){
            let canister : MyBlog = actor(Principal.toText(id));
            let msgs = await canister.posts();
            all := List.append(all, List.fromArray(msgs));
        };
        List.toArray(all)
    };

};
