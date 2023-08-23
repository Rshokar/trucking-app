import { createRef } from 'react';

export const navigationRef = createRef<any>();

export function navigate(name: any, params: any) {
    if (navigationRef.current?.navigate) {
        navigationRef.current?.navigate(name, params);
    }
}

