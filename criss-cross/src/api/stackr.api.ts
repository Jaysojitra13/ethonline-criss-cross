import axios from 'axios';

const BASE_URL = 'http://localhost:3000';


export const initGame = async (): Promise<void> => {
    try {
        const response = await axios.post(`${BASE_URL}/init-game`);
        console.log('Game initialized:', response.data);
    } catch (error) {
        console.error('Error initializing game:', error);
        throw error;
    }
};

export const move = async (value: number, row: number, col: number): Promise<void> => {
    try {
        const response = await axios.post(`${BASE_URL}/move`, { value, row, col });
        console.log('Move logged:', response.data);
    } catch (error) {
        console.error('Error logging move:', error);
        throw error;
    }
};
