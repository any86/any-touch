import { propX, propY } from '../const';
export default (input) => ({
    x: input.pointers[1][propX] - input.pointers[0][propX],
    y: input.pointers[1][propY] - input.pointers[0][propY]
});
