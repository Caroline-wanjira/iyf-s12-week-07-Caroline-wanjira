// State with subscribers
const createStore = (initialState) => {
    let state = initialState;
    const listeners = [];

    return {
        getState: () => state,

        setState: (updates) => {
            state = { ...state, ...updates };
            // Notify all listeners
            listeners.forEach((listener) => listener(state));
        },

        subscribe: (listener) => {
            listeners.push(listener);
            // Return unsubscribe function
            return () => {
                const index = listeners.indexOf(listener);
                listeners.splice(index, 1);
            };
        },
    };
};

// Usage
const store = createStore({ count: 0 });

// Subscribe to changes
const unsubscribe = store.subscribe((state) => {
    console.log("State changed:", state);
});

// Update state
store.setState({ count: 1 }); // Triggers subscriber
store.setState({ count: 2 }); // Triggers subscriber

// Stop listening
unsubscribe();
store.setState({ count: 3 }); // Nothing logs now
