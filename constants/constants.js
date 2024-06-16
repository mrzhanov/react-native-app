import defaultImage from '../assets/sky-sports-logo-black-and-white.png';
import trashIcon from '../assets/trash-bin.png'
import { Audio } from 'expo-av';

export const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
        require('../assets/125fa2b779d4bb9687.mp3') // путь к вашему звуковому файлу
        );
        await sound.playAsync();
        };

        
        export const playSoundError = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/windows-critical-stop.mp3') // путь к вашему звуковому файлу
                );
                await sound.playAsync();
                };
        export const playStartSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/windows-11-startup.mp3') // путь к вашему звуковому файлу
                );
                await sound.playAsync();
                };
        export const exitSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/windows-shutdown.mp3') // путь к вашему звуковому файлу
                );
                await sound.playAsync();
                };
