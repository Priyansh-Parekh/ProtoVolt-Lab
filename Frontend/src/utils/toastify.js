import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const warning = (message) => {
    toast.warning(message);
};

export const error = (message) =>{
    toast.error(message);
}

export const info = (message) =>{
    toast.info(message);
}

export const success = (message) =>{
    toast.success(message);
}