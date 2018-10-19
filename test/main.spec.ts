import AnyTouch from '../src/main'
test('流程ok?', (done) => {
    document.body.innerHTML = '<span id="box">box</span>';
    const el = document.getElementById('box');
    const at = new AnyTouch(el);
    let data = 0;
    at.on('panstart', ({ deltaX }) => {
        data += 1900;
    });

    at.on('panmove', () => {
        
        done();
    });



    let event1: any = new Event('touchstart', {});
    event1.touches = event1.changedTouches = [{
        clientX: 0,
        clientY: 0,
    }];
    el.dispatchEvent(event1);

    function dispatchTouchMove(x:any, y:any) {
        let event2: any = new Event('touchmove', {});
        event2.touches = event2.changedTouches = [{
            clientX: x,
            clientY: y
        }];
        el.dispatchEvent(event2);
    };




    function dispatchTouchEnd(x:any,y:any) {
        let event3: any = new Event('touchend', {});
        event3.touches = event3.changedTouches = [{
            clientX: x,
            clientY: y
        }];
        el.dispatchEvent(event3);
    }

    dispatchTouchMove(11, 11);
    dispatchTouchMove(100, 100);

    // let x = 0;
    // let y = 0;
    // let timer = setInterval(() => {
    //     x += 1;
    //     y += 1;
    //     dispatchTouchMove(x, y);
    //     if(100 < x) {
    //         clearInterval(timer);
    //         dispatchTouchEnd(x, y);
    //     }
    // }, 100);

    expect(data).toBe(1900);
});