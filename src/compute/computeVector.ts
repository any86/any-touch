import { propX, propY } from '../const';
export default (input: any): { x: number, y: number } => ({
    x: input.points[1][propX] - input.points[0][propX],
    y: input.points[1][propY] - input.points[0][propY]
});