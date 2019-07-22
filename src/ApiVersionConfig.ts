export interface ApiVersionConfig {
    account: {
        setPreference?: string
    },
    autocompleteSession: {
        init?: string[], // Array needed to set up all necessary sockets
        autocomplete?: string,
        hotkey?: string,
        variable?: string,
        feedback?: string,
        setRealtimeData?: string,
        reply?: string,
    },
    customSuggestions: {
        delete?: string,
        edit?: string,
        add?: string,
    },
    events: {
        fetch?: string
    },
    pointApi: {
        fetch?: string
    },
    authManager: {
        refreshJwtToken?: string,
        fetch?: string
    }
}