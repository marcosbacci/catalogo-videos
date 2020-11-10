import * as React from 'react';
import LoadingContext from './LoadingContext';
import { useEffect, useMemo, useState } from 'react';
import { addGlobalRequestInterceptor, addGlobalResponseInterceptor, removeGlobalRequestInterceptor, removeGlobalResponseInterceptor } from '../../util/http';

export const LoadingProvider = (props) => {
    const [loading, setLoading] = useState(false);
    const [countRequest, setCountRequest] = useState(0);
   
    useMemo(() => {
        let isSubscribed = true;
        const requestIds = addGlobalRequestInterceptor((config) => {
            if (isSubscribed) {
                setLoading(true);
                setCountRequest((prevCountRequest) => prevCountRequest + 1);
            }
            
            return config;
        });

        const responseIds = addGlobalResponseInterceptor((response) => 
        {
            if (isSubscribed) {
                setCountRequest((prevCountRequest) => prevCountRequest - 1);
            }
            return response;
        }, (error) => {
            if (isSubscribed) {
                setCountRequest((prevCountRequest) => prevCountRequest - 1);
            }
            return Promise.reject(error);
        });

        return () => {
            isSubscribed = false;
            removeGlobalRequestInterceptor(requestIds);
            removeGlobalResponseInterceptor(responseIds);
        }
    },
    // eslint-disable-next-line 
    [true]);

    useEffect(() => {
        if (!countRequest) {
            setLoading(false);
        }
    }, [countRequest]);
    
    return (
        <LoadingContext.Provider value={loading}>
            {props.children}
        </LoadingContext.Provider>
    );
};