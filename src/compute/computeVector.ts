import { Input } from '@/types';
import { CLIENT_X, CLIENT_Y } from '../const';
export default (input: Input): { x: number, y: number } => ({
    x: input.points[1][CLIENT_X] - input.points[0][CLIENT_X],
    y: input.points[1][CLIENT_Y] - input.points[0][CLIENT_Y]
});