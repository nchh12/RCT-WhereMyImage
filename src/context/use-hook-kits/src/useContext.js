import React, {
    useReducer,
    memo,
    useLayoutEffect,
    createElement,
    createContext,
    useRef,
    useContext,
} from 'react';

const CONTEXT_LISTENERS =
    process.env.NODE_ENV !== 'production' ? Symbol('CONTEXT_LISTENERS') : Symbol();

const createProvider = (OrigProvider, listeners) =>
    memo(({ value, children }) => {
        if (process.env.NODE_ENV !== 'production') {
            useLayoutEffect(() => {
                listeners.forEach(listener => {
                    listener(value);
                });
            });
        } else {
            listeners.forEach(listener => {
                listener(value);
            });
        }
        return createElement(OrigProvider, { value }, children);
    });

const createContextSelector = defaultValue => {
    const context = createContext(defaultValue, () => 0);
    context[CONTEXT_LISTENERS] = new Set();
    context.Provider = createProvider(context.Provider, context[CONTEXT_LISTENERS]);
    delete context.Consumer;
    return context;
};

const useContextSelector = (context, selector) => {
    const listeners = context[CONTEXT_LISTENERS];
    if (process.env.NODE_ENV !== 'production') {
        if (!listeners) {
            throw new Error('useContextSelector requires special context');
        }
    }
    const [, forceUpdate] = useReducer(c => c + 1, 0);
    const value = useContext(context);
    const selected = selector(value);
    const ref = useRef(null);
    useLayoutEffect(() => {
        ref.current = {
            f: selector,
            v: value,
            s: selected,
        };
    });
    useLayoutEffect(() => {
        const callback = nextValue => {
            try {
                if (
                    ref.current.v === nextValue ||
                    Object.is(ref.current.s, ref.current.f(nextValue))
                ) {
                    return;
                }
            } catch (e) {
                // ignored (stale props or some other reason)
            }
            forceUpdate();
        };
        listeners.add(callback);
        return () => {
            listeners.delete(callback);
        };
    }, [listeners]);
    return selected;
};

const StateContext = createContextSelector();

export default {
    createContextSelector,
    useContextSelector,
    StateContext,
};
