export default class DrawFigureService {
    static CIRCLE_STEP = 0.01;
    static NUMBER_OF_POINTS_IN_CIRCLE = Math.round(Math.PI * 2 / this.CIRCLE_STEP);

    static getCirclePoints(x: number | string, y: number | string, radius: number | string, step = this.CIRCLE_STEP) {
        const _x = Number(x);
        const _y = Number(y);
        const _radius = Number(radius);
        const _step = Number(step);

        return (new Array(this.NUMBER_OF_POINTS_IN_CIRCLE)).fill(null).map((_, i) => {
            const _pointStep = _step * i
            const a = _x + _radius * Math.cos(_pointStep);
            const b = _y + _radius * Math.sin(_pointStep);

            return { x: a, y: b };
        })
    }
}
