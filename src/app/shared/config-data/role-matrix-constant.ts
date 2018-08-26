export class RoleMatrix {
    public static roleMatrix = {
        'admin': {
            'addUpdatePlayer': true,
            'player': true,
            'main': true,
            'showAddPlayerButton': true,
            'showUpdatePlayerButton': true,
            'showDeletePlayerButton': true
        },
        'user' : {
            'addUpdatePlayer': false,
            'player': true,
            'main': true,
            'showAddPlayerButton': false,
            'showUpdatePlayerButton': false,
            'showDeletePlayerButton': false
        }
    };
 }