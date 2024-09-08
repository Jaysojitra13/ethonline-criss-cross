/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_STACKR || 'http://localhost:3000';


export const initGame = async (): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}/init-game`);
        console.log('Game initialized:', response.data.gameid);
        return { ...response.data }
    } catch (error) {
        console.error('Error initializing game:', error);
        throw error;
    }
};

export const move = async (value: number, row: number, col: number, id: string, moveNumber: number): Promise<void> => {
    try {
        console.log(id)
        const response = await axios.post(`${BASE_URL}/move`, { value, row, col, id, moveNumber });
        console.log('Move logged:', response.data);
    } catch (error) {
        console.error('Error logging move:', error);
        throw error;
    }
};

export const getRandomNumbers = async (gameid: string, moveNumber: number): Promise<{ firstNumber: number, secondNumber: number }> => {
    try {
        const response = await axios.post(`${BASE_URL}/get-random-numbers`, {
            gameid,
            moveNumber
        });
        console.log('Random numbers fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching random numbers:', error);
        throw error;
    }
};