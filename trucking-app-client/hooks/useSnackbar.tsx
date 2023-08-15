// useSnackbar.tsx
import { useContext } from 'react';
import { SnackbarContext } from '../providers/SnackBarProvider';

const useSnackbar = () => {
    return useContext(SnackbarContext);
};

export default useSnackbar;
