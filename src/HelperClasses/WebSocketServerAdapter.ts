import * as WebSocket from "ws";
class WebSocketServerAdapter extends WebSocket{
    public id?: string = '';
}
declare namespace WebSocketServerAdapter {
    class AdjustedServer extends WebSocket.Server{
       clientsMapped: Map<string, WebSocketServerAdapter>
    }
}

export = WebSocketServerAdapter;
