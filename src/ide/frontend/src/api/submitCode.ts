import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const compileCode = async (code: string) => {
    try {
        const response = await axios.post('http://localhost:3001/api/lexico', code, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw error;
    }
};

export const sintatico = async (code: string) => {
    try {
        const response = await axios.post('http://localhost:3001/api/sintatico', code, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw error;
    }
};

export const semantico = async (code: string) => {
    try {
        const response = await axios.post('http://localhost:3001/api/semantico', code, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        throw error;
    }
};


export const gerador = async (code: string): Promise<Blob> => {
    try {
        const response = await axios.post('http://localhost:3001/api/gerador', code, {
            headers: {
                'Content-Type': 'text/plain',
            },
            responseType: 'arraybuffer',
        });

        if (response.status === 200) {
            const zip = await JSZip.loadAsync(response.data);
            const newZip = new JSZip();

            const folderName = 'testP5';
            zip.forEach((relativePath, file) => {
                newZip.file(`${folderName}/${relativePath}`, file.async('arraybuffer'));
            });

            const zipBlob = await newZip.generateAsync({ type: 'blob' });

            return zipBlob;
        } else {
            throw new Error('Falha ao gerar os arquivos.');
        }
    } catch (error) {
        console.error('Erro ao gerar arquivos:', error);
        throw new Error('Erro ao comunicar com o servidor.');
    }
};