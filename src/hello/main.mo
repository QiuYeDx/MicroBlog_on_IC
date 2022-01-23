import List "mo:base/List";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Order "mo:base/Order";

actor {
    private var order_s : Order.Order = #less;
    private var order_m : Order.Order = #equal;
    private var order_l : Order.Order = #greater;
    private type Time = Time.Time;
    private type Message = {
        content: Text;
        time: Time;
        author: Text;
    };
    private type Poster = {
        principal: Text;
        name: Text;
    };
    private type MyBlog = actor{
        follow: shared (Principal) -> async ();
        follows: shared query () -> async [Poster];
        post: shared (Text) -> async ();
        posts: shared query () -> async [Message];
        timeline: shared () -> async [Message];
        set_name: shared (Text) -> async ();
        get_name: shared () -> async ?Text;
    };

    stable var followed : List.List<Poster> = List.nil();
    stable var messages : List.List<Message> = List.nil();
    stable var myName : Text = "[nameless!]";

    public shared func set_name(name: Text) : async(){
        myName := name;
    };

    public shared func get_name() : async ?Text {
        return ?myName;
    };
    
    public shared func follow(id: Text) : async (){
        let canister : MyBlog = actor(id);
        switch(await canister.get_name()){
            case(?_name){
                followed := List.push({
                    principal = id;
                    name = _name;
                }, followed);
            };
            case(_){
                followed := List.push({
                    principal = id;
                    name = "[no name]";
                }, followed);
            };
        };
        
    };
    
    public shared query func follows() : async [Poster]{
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

    public shared func posts_by_id(id : Text) : async [Message]{
        let canister : MyBlog = actor(id);
        await canister.posts()
    };

    public shared func timeline() : async [Message]{
        var all : List.List<Message> = List.nil();
        for(id in Iter.fromList(followed)){
            let canister : MyBlog = actor(id.principal);
            let msgs = await canister.posts();
            all := List.append(all, List.fromArray(msgs));
        };
        var last = List.toArray(all);
        Array.sort<Message>(last, func(a: Message, b: Message){
            if(a.time > b.time){
                return order_s;
            };
            if(a.time < b.time){
                return order_l;
            };
            return order_m;
        })
    };

};
